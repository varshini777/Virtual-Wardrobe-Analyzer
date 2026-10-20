import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db, seedSampleWardrobe } from '../db/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please wait 15 minutes before trying again.'
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: 'Too many registration requests. Please wait an hour before trying again.'
});

// POST /api/auth/register
router.post('/register', registerLimiter, (req, res) => {
  try {
    const { username, email, name, password, seedSample = false } = req.body;

    // Validate email if provided
    let cleanEmail = null;
    if (email) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
      }
      cleanEmail = email.trim().toLowerCase();

      const existingEmail = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
      if (existingEmail) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists. Please log in.' });
      }
    }

    // Determine clean username
    let cleanUsername = '';
    if (username && typeof username === 'string' && username.trim().length >= 3) {
      cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    } else if (cleanEmail) {
      cleanUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_-]/g, '');
      if (cleanUsername.length < 3) cleanUsername = `user_${cleanUsername}`;
    }

    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 valid characters (letters, numbers, underscores).' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    // Ensure username uniqueness (auto-resolve if derived from email)
    let candidateUsername = cleanUsername;
    let suffix = 1;
    while (db.prepare('SELECT id FROM users WHERE username = ?').get(candidateUsername)) {
      if (username) {
        return res.status(409).json({ success: false, error: 'Username is already registered. Please choose another.' });
      }
      candidateUsername = `${cleanUsername}${suffix++}`;
    }
    cleanUsername = candidateUsername;

    const cleanName = name && typeof name === 'string' && name.trim().length > 0 
      ? name.trim() 
      : cleanUsername;

    const userId = `user-${crypto.randomUUID()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, username, email, name, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, cleanUsername, cleanEmail, cleanName, passwordHash, now);

    // Initial preferences
    db.prepare(`
      INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, updated_at)
      VALUES (?, '[]', '[]', '[]', 'Hot', 'Casual', ?)
    `).run(userId, now);

    if (seedSample) {
      seedSampleWardrobe(userId);
    }

    const newUser = { id: userId, username: cleanUsername, email: cleanEmail, name: cleanName };
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => {
  try {
    const { username, email, identifier: rawId, password } = req.body;
    const identifier = (rawId || email || username || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password are required.' });
    }

    let user = null;
    if (identifier === 'demo' || identifier === 'fashionista' || identifier === 'demo@wardrobe.internal') {
      user = db.prepare('SELECT id, username, email, name, password_hash FROM users WHERE id = ?').get('default-user');
    } else {
      user = db.prepare('SELECT id, username, email, name, password_hash FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?').get(identifier, identifier);
    }

    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const authUser = { id: user.id, username: user.username, email: user.email, name: user.name };
    const token = generateToken(authUser);

    res.json({
      success: true,
      token,
      user: authUser
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/demo - One-click access for evaluation
router.post('/demo', (req, res) => {
  try {
    let demoUser = db.prepare('SELECT id, username, email, name, password_hash FROM users WHERE id = ?').get('default-user');
    if (!demoUser) {
      const now = new Date().toISOString();
      const hash = bcrypt.hashSync('demo123', 10);
      db.prepare(`
        INSERT INTO users (id, username, email, name, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('default-user', 'demo', 'demo@wardrobe.internal', 'Alex Morgan', hash, now);
      demoUser = db.prepare('SELECT id, username, email, name, password_hash FROM users WHERE id = ?').get('default-user');
      seedSampleWardrobe('default-user');
    }

    const authUser = { id: demoUser.id, username: demoUser.username, email: demoUser.email || 'demo@wardrobe.internal', name: demoUser.name };
    const token = generateToken(authUser);

    res.json({
      success: true,
      token,
      user: authUser
    });
  } catch (error) {
    console.error('Error during demo login:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me - Verify active authenticated session
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, name, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
