import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db, seedSampleWardrobe } from '../db/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { username, name, password, seedSample = true } = req.body;

    // Validation
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 characters long.' });
    }
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, error: 'Username contains invalid characters (letters, numbers, underscores only).' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const cleanName = name && typeof name === 'string' && name.trim().length > 0 ? name.trim() : cleanUsername;

    // Check unique username
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username is already registered. Please choose another.' });
    }

    const userId = `user-${crypto.randomUUID()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, username, name, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, cleanUsername, cleanName, passwordHash, now);

    // Initial preferences
    db.prepare(`
      INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, updated_at)
      VALUES (?, '[]', '[]', '[]', 'Hot', 'Casual', ?)
    `).run(userId, now);

    if (seedSample) {
      seedSampleWardrobe(userId);
    }

    const newUser = { id: userId, username: cleanUsername, name: cleanName };
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
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = db.prepare('SELECT id, username, name, password_hash FROM users WHERE username = ?').get(cleanUsername);

    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const authUser = { id: user.id, username: user.username, name: user.name };
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
    let demoUser = db.prepare('SELECT id, username, name, password_hash FROM users WHERE id = ?').get('default-user');
    if (!demoUser) {
      const now = new Date().toISOString();
      const hash = bcrypt.hashSync('demo123', 10);
      db.prepare(`
        INSERT INTO users (id, username, name, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run('default-user', 'demo', 'Alex Morgan', hash, now);
      demoUser = db.prepare('SELECT id, username, name, password_hash FROM users WHERE id = ?').get('default-user');
      seedSampleWardrobe('default-user');
    }

    const authUser = { id: demoUser.id, username: demoUser.username, name: demoUser.name };
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
    const user = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?').get(req.user.id);
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
