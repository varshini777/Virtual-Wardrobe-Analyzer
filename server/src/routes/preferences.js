import express from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication on all preference routes
router.use(authenticateToken);

// GET /api/preferences - fetch preferences for authenticated user
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    let pref = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(userId);

    if (!pref) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, default_season, gender_presentation, preferred_fit, strict_occasion, strict_weather, strict_color_exclusion, updated_at)
        VALUES (?, '[]', '[]', '[]', 'Hot', 'Casual', 'All Seasons', 'Show All', 'All', 0, 0, 0, ?)
      `).run(userId, now);
      pref = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(userId);
    }

    res.json({
      success: true,
      preferences: {
        user_id: pref.user_id,
        favorite_colors: JSON.parse(pref.favorite_colors || '[]'),
        disliked_colors: JSON.parse(pref.disliked_colors || '[]'),
        preferred_styles: JSON.parse(pref.preferred_styles || '[]'),
        default_weather: pref.default_weather || 'Hot',
        default_occasion: pref.default_occasion || 'Casual',
        default_season: pref.default_season || 'All Seasons',
        gender_presentation: pref.gender_presentation || 'Show All',
        preferred_fit: pref.preferred_fit || 'All',
        strict_occasion: Boolean(pref.strict_occasion),
        strict_weather: Boolean(pref.strict_weather),
        strict_color_exclusion: Boolean(pref.strict_color_exclusion),
        updated_at: pref.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/preferences - update preferences for authenticated user
router.put('/', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      favorite_colors = [],
      disliked_colors = [],
      preferred_styles = [],
      default_weather = 'Hot',
      default_occasion = 'Casual',
      default_season = 'All Seasons',
      gender_presentation = 'Show All',
      preferred_fit = 'All',
      strict_occasion = false,
      strict_weather = false,
      strict_color_exclusion = false
    } = req.body;

    const now = new Date().toISOString();

    const existing = db.prepare('SELECT user_id FROM user_preferences WHERE user_id = ?').get(userId);
    if (existing) {
      db.prepare(`
        UPDATE user_preferences SET
          favorite_colors = ?,
          disliked_colors = ?,
          preferred_styles = ?,
          default_weather = ?,
          default_occasion = ?,
          default_season = ?,
          gender_presentation = ?,
          preferred_fit = ?,
          strict_occasion = ?,
          strict_weather = ?,
          strict_color_exclusion = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(
        JSON.stringify(favorite_colors),
        JSON.stringify(disliked_colors),
        JSON.stringify(preferred_styles),
        default_weather,
        default_occasion,
        default_season,
        gender_presentation,
        preferred_fit,
        strict_occasion ? 1 : 0,
        strict_weather ? 1 : 0,
        strict_color_exclusion ? 1 : 0,
        now,
        userId
      );
    } else {
      db.prepare(`
        INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, default_season, gender_presentation, preferred_fit, strict_occasion, strict_weather, strict_color_exclusion, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        JSON.stringify(favorite_colors),
        JSON.stringify(disliked_colors),
        JSON.stringify(preferred_styles),
        default_weather,
        default_occasion,
        default_season,
        gender_presentation,
        preferred_fit,
        strict_occasion ? 1 : 0,
        strict_weather ? 1 : 0,
        strict_color_exclusion ? 1 : 0,
        now
      );
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: {
        user_id: userId,
        favorite_colors,
        disliked_colors,
        preferred_styles,
        default_weather,
        default_occasion,
        default_season,
        gender_presentation,
        preferred_fit,
        strict_occasion: Boolean(strict_occasion),
        strict_weather: Boolean(strict_weather),
        strict_color_exclusion: Boolean(strict_color_exclusion),
        updated_at: now
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
