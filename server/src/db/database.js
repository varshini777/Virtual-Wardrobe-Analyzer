import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

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

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
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

  // Ensure default user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get('default-user');
  if (!existingUser) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, username, name, created_at)
      VALUES (?, ?, ?, ?)
    `).run('default-user', 'fashionista', 'Alex Morgan', now);

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

    seedSampleWardrobe('default-user');
  }
}

export function ensureUserExists(userId, name) {
  if (!userId) return;
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!existing) {
    const now = new Date().toISOString();
    const cleanUsername = userId.toLowerCase().replace(/[^a-z0-9_-]/g, '') || `user_${Date.now()}`;
    db.prepare(`
      INSERT OR IGNORE INTO users (id, username, name, created_at)
      VALUES (?, ?, ?, ?)
    `).run(userId, cleanUsername, name || userId, now);

    db.prepare(`
      INSERT OR IGNORE INTO user_preferences (user_id, favorite_colors, disliked_colors, preferred_styles, default_weather, default_occasion, updated_at)
      VALUES (?, '[]', '[]', '[]', 'Hot', 'Casual', ?)
    `).run(userId, now);
  }
}

export function seedSampleWardrobe(userId) {
  const count = db.prepare('SELECT COUNT(*) as count FROM clothing_items WHERE user_id = ?').get(userId);
  if (count.count > 0) return;

  const now = new Date().toISOString();
  const sampleItems = [
    // Tops
    {
      id: 'item-top-1',
      name: 'Classic White Linen Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'White',
      hex_color: '#FFFFFF',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      notes: 'Lightweight and breathable'
    },
    {
      id: 'item-top-2',
      name: 'Navy Oxford Button-Down',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'Navy',
      hex_color: '#1E3A8A',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      notes: 'Structured formal cotton'
    },
    {
      id: 'item-top-3',
      name: 'Grey Cashmere Crewneck',
      category: 'Top',
      sub_category: 'Sweater',
      color: 'Grey',
      hex_color: '#6B7280',
      weather_suitability: 'Cold',
      occasion: 'Casual',
      notes: 'Soft warm layering piece'
    },
    {
      id: 'item-top-4',
      name: 'Black Minimalist T-Shirt',
      category: 'Top',
      sub_category: 'T-shirt',
      color: 'Black',
      hex_color: '#111827',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      notes: 'Heavyweight organic cotton'
    },
    {
      id: 'item-top-5',
      name: 'Olive Polo Shirt',
      category: 'Top',
      sub_category: 'Polo',
      color: 'Olive',
      hex_color: '#556B2F',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      notes: 'Smart casual waffle knit'
    },
    // Bottoms
    {
      id: 'item-bot-1',
      name: 'Beige Stretch Chinos',
      category: 'Bottom',
      sub_category: 'Chinos',
      color: 'Beige',
      hex_color: '#D4C4A8',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      notes: 'Versatile slim-straight fit'
    },
    {
      id: 'item-bot-2',
      name: 'Dark Indigo Slim Jeans',
      category: 'Bottom',
      sub_category: 'Jeans',
      color: 'Blue',
      hex_color: '#1E293B',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      notes: 'Raw denim finish'
    },
    {
      id: 'item-bot-3',
      name: 'Charcoal Tailored Trousers',
      category: 'Bottom',
      sub_category: 'Trousers',
      color: 'Grey',
      hex_color: '#374151',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      notes: 'Sharp press fold for office or formal wear'
    },
    {
      id: 'item-bot-4',
      name: 'Khaki Tailored Shorts',
      category: 'Bottom',
      sub_category: 'Shorts',
      color: 'Beige',
      hex_color: '#C2B280',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      notes: 'Chino shorts for warm sunny days'
    },
    // Shoes
    {
      id: 'item-sho-1',
      name: 'Crisp White Minimalist Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      hex_color: '#F8FAFC',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      notes: 'Clean leather low-tops'
    },
    {
      id: 'item-sho-2',
      name: 'Cognac Leather Penny Loafers',
      category: 'Shoes',
      sub_category: 'Loafers',
      color: 'Brown',
      hex_color: '#78350F',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      notes: 'Italian full-grain leather'
    },
    {
      id: 'item-sho-3',
      name: 'Waterproof Black Chelsea Boots',
      category: 'Shoes',
      sub_category: 'Boots',
      color: 'Black',
      hex_color: '#000000',
      weather_suitability: 'Rainy',
      occasion: 'Casual',
      notes: 'Weatherproof treated leather with rubber lug sole'
    },
    {
      id: 'item-sho-4',
      name: 'Classic Black Oxford Shoes',
      category: 'Shoes',
      sub_category: 'Formal Shoes',
      color: 'Black',
      hex_color: '#18181B',
      weather_suitability: 'All Weather',
      occasion: 'Formal',
      notes: 'Polished calfskin for formal occasions'
    },
    // Accessories
    {
      id: 'item-acc-1',
      name: 'Brown Leather Minimalist Watch',
      category: 'Accessories',
      sub_category: 'Watch',
      color: 'Brown',
      hex_color: '#78350F',
      weather_suitability: 'All Weather',
      occasion: 'All Occasions',
      notes: 'Rose gold bezel with chestnut strap'
    },
    {
      id: 'item-acc-2',
      name: 'Tortoise Shell Sunglasses',
      category: 'Accessories',
      sub_category: 'Sunglasses',
      color: 'Brown',
      hex_color: '#451A03',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      notes: 'UV400 polarized shades'
    },
    {
      id: 'item-acc-3',
      name: 'Charcoal Wool Ribbed Scarf',
      category: 'Accessories',
      sub_category: 'Scarf',
      color: 'Grey',
      hex_color: '#4B5563',
      weather_suitability: 'Cold',
      occasion: 'Casual',
      notes: 'Cozy merino wool'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO clothing_items (
      id, user_id, name, category, sub_category, color, hex_color,
      weather_suitability, occasion, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of sampleItems) {
    stmt.run(
      item.id,
      userId,
      item.name,
      item.category,
      item.sub_category,
      item.color,
      item.hex_color,
      item.weather_suitability,
      item.occasion,
      item.notes || null,
      now,
      now
    );
  }
}
