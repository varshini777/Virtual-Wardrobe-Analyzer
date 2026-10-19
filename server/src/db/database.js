import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

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

    seedSampleWardrobe('default-user');
  } else {
    if (!existingDefault.password_hash) {
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(defaultPasswordHash, 'default-user');
    }
    if (!existingDefault.email) {
      db.prepare('UPDATE users SET email = ? WHERE id = ?').run('demo@wardrobe.internal', 'default-user');
    }
  }

  // Backfill sample items with realistic image URLs if previously null
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

export function seedSampleWardrobe(userId) {
  const count = db.prepare('SELECT COUNT(*) as count FROM clothing_items WHERE user_id = ?').get(userId);
  if (count.count > 0) return;

  const now = new Date().toISOString();
  const sampleItems = [
    // Tops
    {
      id: `item-top-1-${userId.slice(-6)}`,
      name: 'Classic White Linen Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'White',
      hex_color: '#FFFFFF',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      image_url: '/clothing-assets/top_white_shirt.svg',
      notes: 'Lightweight, airy breathable European linen'
    },
    {
      id: `item-top-2-${userId.slice(-6)}`,
      name: 'Navy Oxford Button-Down',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'Navy',
      hex_color: '#1E3A8A',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      image_url: '/clothing-assets/top_navy_shirt.jpg',
      notes: 'Structured formal cotton with button-down collar'
    },
    {
      id: `item-top-3-${userId.slice(-6)}`,
      name: 'Grey Cashmere Crewneck',
      category: 'Top',
      sub_category: 'Sweater',
      color: 'Grey',
      hex_color: '#6B7280',
      weather_suitability: 'Cold',
      occasion: 'Casual',
      image_url: '/clothing-assets/top_grey_sweater.jpg',
      notes: 'Soft warm layering knit'
    },
    {
      id: `item-top-4-${userId.slice(-6)}`,
      name: 'Black Minimalist T-Shirt',
      category: 'Top',
      sub_category: 'T-shirt',
      color: 'Black',
      hex_color: '#111827',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      image_url: '/clothing-assets/top_black_tshirt.svg',
      notes: 'Heavyweight organic combed cotton'
    },
    {
      id: `item-top-5-${userId.slice(-6)}`,
      name: 'Olive Polo Shirt',
      category: 'Top',
      sub_category: 'Polo',
      color: 'Olive',
      hex_color: '#556B2F',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      image_url: '/clothing-assets/top_olive_polo.jpg',
      notes: 'Smart casual textured waffle knit'
    },
    // Bottoms
    {
      id: `item-bot-1-${userId.slice(-6)}`,
      name: 'Beige Stretch Chinos',
      category: 'Bottom',
      sub_category: 'Chinos',
      color: 'Beige',
      hex_color: '#D4C4A8',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      image_url: '/clothing-assets/bottom_beige_chinos.jpg',
      notes: 'Versatile slim-straight silhouette'
    },
    {
      id: `item-bot-2-${userId.slice(-6)}`,
      name: 'Dark Indigo Slim Jeans',
      category: 'Bottom',
      sub_category: 'Jeans',
      color: 'Blue',
      hex_color: '#1E293B',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      image_url: '/clothing-assets/bottom_blue_jeans.jpg',
      notes: 'Raw denim finish with copper stitching'
    },
    {
      id: `item-bot-3-${userId.slice(-6)}`,
      name: 'Charcoal Tailored Trousers',
      category: 'Bottom',
      sub_category: 'Trousers',
      color: 'Grey',
      hex_color: '#374151',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      image_url: '/clothing-assets/bottom_grey_trousers.jpg',
      notes: 'Sharp center press fold for office and events'
    },
    {
      id: `item-bot-4-${userId.slice(-6)}`,
      name: 'Khaki Tailored Shorts',
      category: 'Bottom',
      sub_category: 'Shorts',
      color: 'Beige',
      hex_color: '#C2B280',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      image_url: '/clothing-assets/bottom_beige_shorts.svg',
      notes: 'Chino shorts for warm summer days'
    },
    // Shoes
    {
      id: `item-sho-1-${userId.slice(-6)}`,
      name: 'Crisp White Minimalist Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      hex_color: '#F8FAFC',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      image_url: '/clothing-assets/shoes_white_sneakers.jpg',
      notes: 'Clean full-grain leather low-tops'
    },
    {
      id: `item-sho-2-${userId.slice(-6)}`,
      name: 'Cognac Leather Penny Loafers',
      category: 'Shoes',
      sub_category: 'Loafers',
      color: 'Brown',
      hex_color: '#78350F',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      image_url: '/clothing-assets/shoes_brown_loafers.jpg',
      notes: 'Italian hand-stitched leather'
    },
    {
      id: `item-sho-3-${userId.slice(-6)}`,
      name: 'Waterproof Black Chelsea Boots',
      category: 'Shoes',
      sub_category: 'Boots',
      color: 'Black',
      hex_color: '#000000',
      weather_suitability: 'Rainy',
      occasion: 'Casual',
      image_url: '/clothing-assets/shoes_black_boots.svg',
      notes: 'Weatherproof treated leather with rubber lug sole'
    },
    {
      id: `item-sho-4-${userId.slice(-6)}`,
      name: 'Classic Black Oxford Shoes',
      category: 'Shoes',
      sub_category: 'Formal Shoes',
      color: 'Black',
      hex_color: '#18181B',
      weather_suitability: 'All Weather',
      occasion: 'Formal',
      image_url: '/clothing-assets/shoes_black_oxfords.svg',
      notes: 'Polished calfskin for formal occasions'
    },
    // Accessories
    {
      id: `item-acc-1-${userId.slice(-6)}`,
      name: 'Brown Leather Minimalist Watch',
      category: 'Accessories',
      sub_category: 'Watch',
      color: 'Brown',
      hex_color: '#78350F',
      weather_suitability: 'All Weather',
      occasion: 'All Occasions',
      image_url: '/clothing-assets/accessory_brown_watch.jpg',
      notes: 'Rose gold bezel with chestnut strap'
    },
    {
      id: `item-acc-2-${userId.slice(-6)}`,
      name: 'Tortoise Shell Sunglasses',
      category: 'Accessories',
      sub_category: 'Sunglasses',
      color: 'Brown',
      hex_color: '#451A03',
      weather_suitability: 'Hot',
      occasion: 'Casual',
      image_url: '/clothing-assets/accessory_sunglasses.jpg',
      notes: 'Polarized UV400 lenses'
    },
    {
      id: `item-acc-3-${userId.slice(-6)}`,
      name: 'Charcoal Wool Ribbed Scarf',
      category: 'Accessories',
      sub_category: 'Scarf',
      color: 'Grey',
      hex_color: '#4B5563',
      weather_suitability: 'Cold',
      occasion: 'Casual',
      image_url: '/clothing-assets/accessory_grey_scarf.jpg',
      notes: 'Cozy merino wool'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO clothing_items (
      id, user_id, name, category, sub_category, color, hex_color,
      weather_suitability, occasion, image_url, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      item.image_url,
      item.notes || null,
      now,
      now
    );
  }
}
