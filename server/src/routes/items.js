import express from 'express';
import { db } from '../db/database.js';
import { seedSampleWardrobe } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { resolveItemImage } from '../services/imageService.js';
import crypto from 'node:crypto';

const router = express.Router();

// Apply authentication middleware to all items routes
router.use(authenticateToken);

// GET /api/items - list items for authenticated user only with search, filters, and sorting
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const { category, sub_category, color, weather, season, occasion, search, sort = 'recently_added' } = req.query;

    let query = 'SELECT * FROM clothing_items WHERE user_id = ?';
    const params = [userId];

    if (category && category !== 'All') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (sub_category && sub_category !== 'All') {
      query += ' AND LOWER(sub_category) = LOWER(?)';
      params.push(sub_category);
    }

    if (color && color !== 'All') {
      query += ' AND (LOWER(color) = LOWER(?) OR LOWER(secondary_color) = LOWER(?))';
      params.push(color, color);
    }

    if (season && season !== 'All') {
      query += " AND (season = ? OR season = 'All Seasons' OR season IS NULL)";
      params.push(season);
    }

    if (weather && weather !== 'All') {
      query += " AND (weather_suitability = ? OR weather_suitability = 'All Weather')";
      params.push(weather);
    }

    if (occasion && occasion !== 'All') {
      query += " AND (occasion = ? OR occasion = 'All Occasions')";
      params.push(occasion);
    }

    if (search) {
      query += " AND (LOWER(name) LIKE ? OR LOWER(color) LIKE ? OR LOWER(sub_category) LIKE ? OR LOWER(COALESCE(fabric, '')) LIKE ? OR LOWER(COALESCE(notes, '')) LIKE ?)";
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s, s, s, s);
    }

    // Sort order
    if (sort === 'name_asc') {
      query += ' ORDER BY name COLLATE NOCASE ASC';
    } else if (sort === 'name_desc') {
      query += ' ORDER BY name COLLATE NOCASE DESC';
    } else if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const items = db.prepare(query).all(...params);
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/items/:id - get single item if owned by authenticated user
router.get('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const item = db.prepare('SELECT * FROM clothing_items WHERE id = ? AND user_id = ?').get(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/items - add clothing item with dynamic image resolution and complete metadata
router.post('/', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      category,
      sub_category,
      color,
      hex_color,
      secondary_color = null,
      pattern = null,
      fabric = null,
      style = null,
      season = 'All Seasons',
      weather_suitability = 'All Weather',
      occasion = 'All Occasions',
      image_url = '',
      notes = '',
      silhouette = null,
      gender_presentation = 'Unisex',
      waterproof_status = 'Unknown'
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Item name is required.' });
    }
    if (!category || !['Top', 'Bottom', 'Shoes', 'Accessories'].includes(category)) {
      return res.status(400).json({ success: false, error: 'Valid category (Top, Bottom, Shoes, Accessories) is required.' });
    }
    if (!sub_category || !sub_category.trim()) {
      return res.status(400).json({ success: false, error: 'Sub-category is required.' });
    }
    if (!color || !color.trim()) {
      return res.status(400).json({ success: false, error: 'Color is required.' });
    }

    // Dynamic image resolution: if user didn't upload/provide image, assign appropriate catalog image
    const finalImageUrl = resolveItemImage({
      name: name.trim(),
      category,
      sub_category: sub_category.trim(),
      color: color.trim(),
      weather_suitability,
      occasion,
      notes,
      existingImageUrl: image_url
    });

    const id = `item-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO clothing_items (
        id, user_id, name, category, sub_category, color, hex_color,
        secondary_color, pattern, fabric, style, season,
        weather_suitability, occasion, image_url, notes,
        silhouette, gender_presentation, waterproof_status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      name.trim(),
      category,
      sub_category.trim(),
      color.trim(),
      hex_color || null,
      secondary_color && secondary_color.trim() ? secondary_color.trim() : null,
      pattern && pattern.trim() ? pattern.trim() : null,
      fabric && fabric.trim() ? fabric.trim() : null,
      style && style.trim() ? style.trim() : null,
      season || 'All Seasons',
      weather_suitability || 'All Weather',
      occasion || 'All Occasions',
      finalImageUrl,
      notes ? notes.trim() : null,
      silhouette ? silhouette.trim() : null,
      gender_presentation || 'Unisex',
      waterproof_status || 'Unknown',
      now,
      now
    );

    const newItem = db.prepare('SELECT * FROM clothing_items WHERE id = ?').get(id);
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/items/:id - update item owned by authenticated user
router.put('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const existing = db.prepare('SELECT * FROM clothing_items WHERE id = ? AND user_id = ?').get(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }

    const {
      name,
      category,
      sub_category,
      color,
      hex_color,
      secondary_color,
      pattern,
      fabric,
      style,
      season,
      weather_suitability,
      occasion,
      image_url,
      notes,
      silhouette,
      gender_presentation,
      waterproof_status
    } = req.body;

    const updatedCategory = category || existing.category;
    const updatedSub = sub_category !== undefined ? sub_category.trim() : existing.sub_category;
    const updatedColor = color !== undefined ? color.trim() : existing.color;
    const updatedName = name !== undefined ? name.trim() : existing.name;

    let finalImageUrl = image_url !== undefined ? image_url : existing.image_url;
    // If image was empty or needs reassignment
    if (!finalImageUrl) {
      finalImageUrl = resolveItemImage({
        name: updatedName,
        category: updatedCategory,
        sub_category: updatedSub,
        color: updatedColor,
        weather_suitability: weather_suitability || existing.weather_suitability,
        occasion: occasion || existing.occasion,
        notes: notes !== undefined ? notes : existing.notes,
        existingImageUrl: ''
      });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE clothing_items SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        sub_category = COALESCE(?, sub_category),
        color = COALESCE(?, color),
        hex_color = COALESCE(?, hex_color),
        secondary_color = COALESCE(?, secondary_color),
        pattern = COALESCE(?, pattern),
        fabric = COALESCE(?, fabric),
        style = COALESCE(?, style),
        season = COALESCE(?, season),
        weather_suitability = COALESCE(?, weather_suitability),
        occasion = COALESCE(?, occasion),
        image_url = ?,
        notes = COALESCE(?, notes),
        silhouette = COALESCE(?, silhouette),
        gender_presentation = COALESCE(?, gender_presentation),
        waterproof_status = COALESCE(?, waterproof_status),
        updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(
      name !== undefined ? name.trim() : null,
      category !== undefined ? category : null,
      sub_category !== undefined ? sub_category.trim() : null,
      color !== undefined ? color.trim() : null,
      hex_color !== undefined ? hex_color : null,
      secondary_color !== undefined ? secondary_color : null,
      pattern !== undefined ? pattern : null,
      fabric !== undefined ? fabric : null,
      style !== undefined ? style : null,
      season !== undefined ? season : null,
      weather_suitability !== undefined ? weather_suitability : null,
      occasion !== undefined ? occasion : null,
      finalImageUrl,
      notes !== undefined ? notes : null,
      silhouette !== undefined ? silhouette : null,
      gender_presentation !== undefined ? gender_presentation : null,
      waterproof_status !== undefined ? waterproof_status : null,
      now,
      req.params.id,
      userId
    );

    const updated = db.prepare('SELECT * FROM clothing_items WHERE id = ?').get(req.params.id);
    res.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/items/:id - delete item owned by authenticated user
router.delete('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const existing = db.prepare('SELECT id FROM clothing_items WHERE id = ? AND user_id = ?').get(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }

    db.prepare('DELETE FROM clothing_items WHERE id = ? AND user_id = ?').run(req.params.id, userId);
    res.json({ success: true, message: 'Item deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/items/reset-sample
router.post('/reset-sample', (req, res) => {
  try {
    const userId = req.user.id;
    db.prepare('DELETE FROM clothing_items WHERE user_id = ?').run(userId);
    seedSampleWardrobe(userId);
    const items = db.prepare('SELECT * FROM clothing_items WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json({ success: true, message: 'Sample wardrobe restored with realistic catalog visuals', count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/items/clear-all
router.delete('/clear-all', (req, res) => {
  try {
    const userId = req.user.id;
    db.prepare('DELETE FROM clothing_items WHERE user_id = ?').run(userId);
    res.json({ success: true, message: 'All clothing items deleted from your closet' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
