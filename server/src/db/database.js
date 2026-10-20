import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { CURATED_WARDROBE } from '../data/curatedWardrobe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH 
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(dbDir, 'wardrobe.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode, busy timeout, and foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA busy_timeout = 5000;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clothing_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      color TEXT NOT NULL,
      hex_color TEXT,
      weather_suitability TEXT DEFAULT 'All Weather',
      occasion TEXT DEFAULT 'All Occasions',
      image_url TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      favorite_colors TEXT DEFAULT '[]',
      disliked_colors TEXT DEFAULT '[]',
      preferred_styles TEXT DEFAULT '[]',
      default_weather TEXT DEFAULT 'Hot',
      default_occasion TEXT DEFAULT 'Casual',
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_outfits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      weather TEXT NOT NULL,
      occasion TEXT NOT NULL,
      top_id TEXT NOT NULL,
      bottom_id TEXT NOT NULL,
      shoes_id TEXT NOT NULL,
      accessory_id TEXT,
      explanation TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(top_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
      FOREIGN KEY(bottom_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
      FOREIGN KEY(shoes_id) REFERENCES clothing_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendation_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      weather TEXT NOT NULL,
      occasion TEXT NOT NULL,
      outfit_count INTEGER NOT NULL,
      summary TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Migration: Ensure password_hash and email columns exist
  const userColumns = db.prepare('PRAGMA table_info(users)').all();
  const hasPasswordHash = userColumns.some(c => c.name === 'password_hash');
  if (!hasPasswordHash) {
    db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT;');
  }
  const hasEmail = userColumns.some(c => c.name === 'email');
  if (!hasEmail) {
    db.exec('ALTER TABLE users ADD COLUMN email TEXT;');
  }

  // Migration: Ensure secondary_color, pattern, fabric, style, season in clothing_items
  const itemColumns = db.prepare('PRAGMA table_info(clothing_items)').all();
  const itemColumnNames = itemColumns.map(c => c.name);
  if (!itemColumnNames.includes('secondary_color')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN secondary_color TEXT;');
  }
  if (!itemColumnNames.includes('pattern')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN pattern TEXT;');
  }
  if (!itemColumnNames.includes('fabric')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN fabric TEXT;');
  }
  if (!itemColumnNames.includes('style')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN style TEXT;');
  }
  if (!itemColumnNames.includes('season')) {
    db.exec("ALTER TABLE clothing_items ADD COLUMN season TEXT DEFAULT 'All Seasons';");
  }
  if (!itemColumnNames.includes('concept_id')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN concept_id TEXT;');
  }
  if (!itemColumnNames.includes('silhouette')) {
    db.exec('ALTER TABLE clothing_items ADD COLUMN silhouette TEXT;');
  }
  if (!itemColumnNames.includes('gender_presentation')) {
    db.exec("ALTER TABLE clothing_items ADD COLUMN gender_presentation TEXT DEFAULT 'Unisex';");
  }
  if (!itemColumnNames.includes('waterproof_status')) {
    db.exec("ALTER TABLE clothing_items ADD COLUMN waterproof_status TEXT DEFAULT 'Unknown';");
  }

  // Migration: Ensure default_season, gender_presentation, preferred_fit in user_preferences
  const prefColumns = db.prepare('PRAGMA table_info(user_preferences)').all();
  const prefColumnNames = prefColumns.map(c => c.name);
  if (!prefColumnNames.includes('default_season')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN default_season TEXT DEFAULT 'All Seasons';");
  }
  if (!prefColumnNames.includes('gender_presentation')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN gender_presentation TEXT DEFAULT 'Show All';");
  }
  if (!prefColumnNames.includes('preferred_fit')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN preferred_fit TEXT DEFAULT 'All';");
  }
  if (!prefColumnNames.includes('strict_occasion')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN strict_occasion INTEGER DEFAULT 0;");
  }
  if (!prefColumnNames.includes('strict_weather')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN strict_weather INTEGER DEFAULT 0;");
  }
  if (!prefColumnNames.includes('strict_color_exclusion')) {
    db.exec("ALTER TABLE user_preferences ADD COLUMN strict_color_exclusion INTEGER DEFAULT 0;");
  }

  // Seed / Update standard demo account
  const defaultPasswordHash = bcrypt.hashSync('demo123', 10);
  const now = new Date().toISOString();

  const existingDefault = db.prepare('SELECT id, password_hash, email FROM users WHERE id = ?').get('default-user');
  if (!existingDefault) {
    db.prepare(`
      INSERT INTO users (id, username, email, name, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('default-user', 'demo', 'demo@wardrobe.internal', 'Alex Morgan', defaultPasswordHash, now);

    db.prepare(`
      INSERT INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'default-user',
      JSON.stringify(['Navy', 'White', 'Olive']),
      JSON.stringify(['Neon Pink']),
      JSON.stringify(['Smart Casual', 'Minimalist']),
      'Hot',
      'Casual',
      now
    );

    seedSampleWardrobe('default-user', true);
  } else {
    if (!existingDefault.password_hash) {
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(defaultPasswordHash, 'default-user');
    }
    if (!existingDefault.email) {
      db.prepare('UPDATE users SET email = ? WHERE id = ?').run('demo@wardrobe.internal', 'default-user');
    }
    const defaultCount = db.prepare('SELECT COUNT(*) as count FROM clothing_items WHERE user_id = ?').get('default-user');
    if (!defaultCount || defaultCount.count < 100) {
      seedSampleWardrobe('default-user', true);
    }
  }

  backfillSampleImages();
}

function backfillSampleImages() {
  const updates = [
    { id: 'item-top-1', img: '/clothing-assets/top_white_shirt.svg' },
    { id: 'item-top-2', img: '/clothing-assets/top_navy_shirt.jpg' },
    { id: 'item-top-3', img: '/clothing-assets/top_grey_sweater.jpg' },
    { id: 'item-top-4', img: '/clothing-assets/top_black_tshirt.svg' },
    { id: 'item-top-5', img: '/clothing-assets/top_olive_polo.jpg' },
    { id: 'item-bot-1', img: '/clothing-assets/bottom_beige_chinos.jpg' },
    { id: 'item-bot-2', img: '/clothing-assets/bottom_blue_jeans.jpg' },
    { id: 'item-bot-3', img: '/clothing-assets/bottom_grey_trousers.jpg' },
    { id: 'item-bot-4', img: '/clothing-assets/bottom_beige_shorts.svg' },
    { id: 'item-sho-1', img: '/clothing-assets/shoes_white_sneakers.jpg' },
    { id: 'item-sho-2', img: '/clothing-assets/shoes_brown_loafers.jpg' },
    { id: 'item-sho-3', img: '/clothing-assets/shoes_black_boots.svg' },
    { id: 'item-sho-4', img: '/clothing-assets/shoes_black_oxfords.svg' },
    { id: 'item-acc-1', img: '/clothing-assets/accessory_brown_watch.jpg' },
    { id: 'item-acc-2', img: '/clothing-assets/accessory_sunglasses.jpg' },
    { id: 'item-acc-3', img: '/clothing-assets/accessory_grey_scarf.jpg' }
  ];

  const stmt = db.prepare("UPDATE clothing_items SET image_url = ? WHERE id = ? AND (image_url IS NULL OR image_url = '' OR image_url NOT LIKE '/clothing-assets/%')");
  for (const u of updates) {
    try {
      stmt.run(u.img, u.id);
    } catch {
      // Ignore if item id doesn't exist
    }
  }
}

export const COLOR_HEX_MAP = {
  white: '#FFFFFF',
  black: '#111827',
  grey: '#6B7280',
  gray: '#6B7280',
  charcoal: '#374151',
  navy: '#1E3A8A',
  blue: '#2563EB',
  'light blue': '#93C5FD',
  denim: '#3B82F6',
  beige: '#D4C4A8',
  cream: '#FDFBF7',
  brown: '#78350F',
  tan: '#D2B48C',
  khaki: '#A39171',
  olive: '#556B2F',
  green: '#15803D',
  burgundy: '#831843',
  maroon: '#800000',
  red: '#DC2626',
  pink: '#EC4899',
  purple: '#7C3AED',
  yellow: '#EAB308',
  orange: '#EA580C',
  gold: '#D4AF37',
  silver: '#E2E8F0',
  bronze: '#CD7F32'
};

export function resolveColorHex(color) {
  if (!color) return '#94A3B8';
  return COLOR_HEX_MAP[color.trim().toLowerCase()] || '#94A3B8';
}

export function seedSampleWardrobe(userId, force = false) {
  if (!force) {
    const count = db.prepare('SELECT COUNT(*) as count FROM clothing_items WHERE user_id = ?').get(userId);
    if (count && count.count >= 100) return;
  }

  const now = new Date().toISOString();
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO clothing_items (
      id, user_id, name, category, sub_category, color, secondary_color, hex_color,
      pattern, fabric, silhouette, concept_id, style, season, weather_suitability, occasion, image_url, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const isDefaultUser = (userId === 'default-user');

  for (const item of CURATED_WARDROBE) {
    const itemId = isDefaultUser ? item.id : `${item.id}-${userId.slice(-6)}`;
    const hexColor = item.hex_color || resolveColorHex(item.color);

    insertStmt.run(
      itemId,
      userId,
      item.name,
      item.category,
      item.sub_category,
      item.color,
      item.secondary_color || null,
      hexColor,
      item.pattern || 'Solid',
      item.fabric || 'Cotton',
      item.silhouette || null,
      item.concept_id || null,
      item.style || 'Casual',
      item.season || 'All Seasons',
      item.weather_suitability || 'All Weather',
      item.occasion || 'Casual',
      item.image_url,
      item.notes || null,
      now,
      now
    );
  }
}
