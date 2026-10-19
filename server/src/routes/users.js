import express from 'express';
import { db, seedSampleWardrobe } from '../db/database.js';
import crypto from 'node:crypto';

const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, name, created_at FROM users ORDER BY created_at ASC').all();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/current
router.get('/current', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    let user = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?').get(userId);
    if (!user) {
      // Fallback to default user
      user = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?').get('default-user');
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users
router.post('/', (req, res) => {
  try {
    const { username, name, loadSample = true } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanName = name && name.trim() ? name.trim() : username.trim();

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
      return res.status(409).json({ success: false, error: 'User already exists', userId: existing.id });
    }

    const userId = `user-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, username, name, created_at)
      VALUES (?, ?, ?, ?)
    `).run(userId, cleanUsername, cleanName, now);

    // Default preferences
    db.prepare(`
      INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, updated_at)
      VALUES (?, '[]', '[]', '[]', 'Hot', 'Casual', ?)
    `).run(userId, now);

    if (loadSample) {
      seedSampleWardrobe(userId);
    }

    const newUser = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?').get(userId);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
