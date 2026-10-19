import express from 'express';
import { db } from '../db/database.js';
import { checkWardrobeCompleteness, generateOutfitRecommendations } from '../services/recommender.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'node:crypto';

const router = express.Router();

// Enforce authentication on all recommendation routes
router.use(authenticateToken);

// GET /api/recommendations/status - check completeness of authenticated user's wardrobe
router.get('/status', (req, res) => {
  try {
    const userId = req.user.id;
    const items = db.prepare('SELECT * FROM clothing_items WHERE user_id = ?').all(userId);
    const status = checkWardrobeCompleteness(items);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/recommendations/generate - generate rule-based outfits with images
router.post('/generate', (req, res) => {
  try {
    const userId = req.user.id;
    const { weather = 'Hot', occasion = 'Casual', maxRecommendations = 5 } = req.body;

    // Fetch user items strictly for authenticated user
    const items = db.prepare('SELECT * FROM clothing_items WHERE user_id = ?').all(userId);

    // Fetch user preferences
    let preferences = {};
    const prefRow = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(userId);
    if (prefRow) {
      try {
        preferences = {
          favorite_colors: JSON.parse(prefRow.favorite_colors || '[]'),
          disliked_colors: JSON.parse(prefRow.disliked_colors || '[]'),
          preferred_styles: JSON.parse(prefRow.preferred_styles || '[]'),
          default_weather: prefRow.default_weather,
          default_occasion: prefRow.default_occasion
        };
      } catch (e) {
        console.error('Error parsing preferences:', e);
      }
    }

    const result = generateOutfitRecommendations({
      items,
      weather,
      occasion,
      preferences,
      maxRecommendations: Number(maxRecommendations) || 5
    });

    // Record in history if outfits were generated
    if (result.success && result.recommendations.length > 0) {
      const historyId = `hist-${crypto.randomUUID()}`;
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO recommendation_history (id, user_id, weather, occasion, outfit_count, summary, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        historyId,
        userId,
        weather,
        occasion,
        result.recommendations.length,
        result.message,
        now
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
