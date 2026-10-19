import express from 'express';
import { db } from '../db/database.js';
import { getUserId } from './items.js';
import crypto from 'node:crypto';

const router = express.Router();

// GET /api/outfits
router.get('/', (req, res) => {
  try {
    const userId = getUserId(req);
    const savedOutfits = db.prepare(`
      SELECT o.*,
        t.name as top_name, t.category as top_category, t.sub_category as top_sub_category, t.color as top_color, t.hex_color as top_hex, t.image_url as top_image,
        b.name as bottom_name, b.category as bottom_category, b.sub_category as bottom_sub_category, b.color as bottom_color, b.hex_color as bottom_hex, b.image_url as bottom_image,
        s.name as shoes_name, s.category as shoes_category, s.sub_category as shoes_sub_category, s.color as shoes_color, s.hex_color as shoes_hex, s.image_url as shoes_image,
        a.name as acc_name, a.category as acc_category, a.sub_category as acc_sub_category, a.color as acc_color, a.hex_color as acc_hex, a.image_url as acc_image
      FROM saved_outfits o
      LEFT JOIN clothing_items t ON o.top_id = t.id
      LEFT JOIN clothing_items b ON o.bottom_id = b.id
      LEFT JOIN clothing_items s ON o.shoes_id = s.id
      LEFT JOIN clothing_items a ON o.accessory_id = a.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(userId);

    const formatted = savedOutfits.map(row => ({
      id: row.id,
      title: row.title,
      weather: row.weather,
      occasion: row.occasion,
      score: row.score,
      explanation: row.explanation,
      created_at: row.created_at,
      top: {
        id: row.top_id,
        name: row.top_name || 'Top',
        category: row.top_category,
        sub_category: row.top_sub_category,
        color: row.top_color,
        hex_color: row.top_hex,
        image_url: row.top_image
      },
      bottom: {
        id: row.bottom_id,
        name: row.bottom_name || 'Bottom',
        category: row.bottom_category,
        sub_category: row.bottom_sub_category,
        color: row.bottom_color,
        hex_color: row.bottom_hex,
        image_url: row.bottom_image
      },
      shoes: {
        id: row.shoes_id,
        name: row.shoes_name || 'Shoes',
        category: row.shoes_category,
        sub_category: row.shoes_sub_category,
        color: row.shoes_color,
        hex_color: row.shoes_hex,
        image_url: row.shoes_image
      },
      accessory: row.accessory_id ? {
        id: row.accessory_id,
        name: row.acc_name || 'Accessory',
        category: row.acc_category,
        sub_category: row.acc_sub_category,
        color: row.acc_color,
        hex_color: row.acc_hex,
        image_url: row.acc_image
      } : null
    }));

    res.json({ success: true, count: formatted.length, outfits: formatted });
  } catch (error) {
    console.error('Error fetching saved outfits:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/outfits
router.post('/', (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      title,
      weather,
      occasion,
      top_id,
      bottom_id,
      shoes_id,
      accessory_id,
      explanation,
      score = 85
    } = req.body;

    if (!top_id || !bottom_id || !shoes_id) {
      return res.status(400).json({ success: false, error: 'Top, Bottom, and Shoes are required to save an outfit.' });
    }

    const id = `outfit-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const outfitTitle = title && title.trim() ? title.trim() : `${weather} ${occasion} Ensemble`;

    db.prepare(`
      INSERT INTO saved_outfits (
        id, user_id, title, weather, occasion, top_id, bottom_id, shoes_id, accessory_id, explanation, score, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      outfitTitle,
      weather || 'Hot',
      occasion || 'Casual',
      top_id,
      bottom_id,
      shoes_id,
      accessory_id || null,
      explanation || 'Curated outfit combination.',
      score,
      now
    );

    res.status(201).json({ success: true, message: 'Outfit saved successfully', id });
  } catch (error) {
    console.error('Error saving outfit:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/outfits/:id
router.delete('/:id', (req, res) => {
  try {
    const userId = getUserId(req);
    const existing = db.prepare('SELECT id FROM saved_outfits WHERE id = ? AND user_id = ?').get(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Saved outfit not found' });
    }

    db.prepare('DELETE FROM saved_outfits WHERE id = ? AND user_id = ?').run(req.params.id, userId);
    res.json({ success: true, message: 'Outfit deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/outfits/history
router.get('/history', (req, res) => {
  try {
    const userId = getUserId(req);
    const history = db.prepare(`
      SELECT * FROM recommendation_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `).all(userId);

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
