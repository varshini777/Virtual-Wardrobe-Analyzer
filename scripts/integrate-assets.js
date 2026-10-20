import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const MANIFEST_PATH = 'D:\\Wardrobe_Asset_Refresh_Output\\asset-manifest.json';
const CURATED_FILE = path.resolve('server/src/data/curatedWardrobe.js');
const DB_PATH = path.resolve('server/data/wardrobe.db');

console.log('--- 1. READING MANIFEST ---');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const manifestMap = new Map();
manifest.forEach(m => {
  manifestMap.set(m.item_id, {
    replacementFilename: m.replacement_filename,
    replacementUrl: `/clothing-assets/${m.replacement_filename}`,
    sourceType: m.source_type,
    conceptId: m.concept_id
  });
});
console.log(`Loaded ${manifestMap.size} manifest mappings.`);

console.log('\n--- 2. UPDATING server/src/data/curatedWardrobe.js ---');
// Dynamically import existing curated wardrobe
const { CURATED_WARDROBE } = await import(`file://${CURATED_FILE}`);

let updatedCuratedCount = 0;
const updatedWardrobe = CURATED_WARDROBE.map(item => {
  const mapping = manifestMap.get(item.id);
  if (!mapping) {
    throw new Error(`Item ${item.id} not found in manifest!`);
  }
  if (item.image_url !== mapping.replacementUrl) {
    updatedCuratedCount++;
  }
  return {
    ...item,
    image_url: mapping.replacementUrl
  };
});

const fileHeader = `/**
 * VIRTUAL WARDROBE ANALYZER — MASTER CURATED WARDROBE
 * Exactly 160 Genuinely Distinct Garment Designs.
 * 
 * Integrated with Codex Photorealistic Fashion Asset Refresh Pack.
 * - Every single item has a unique Design Concept ID.
 * - 149 High-Resolution Original Garment Photography Assets (.png)
 * - 11 Retained High-Resolution Atelier Project Photographs (.jpg)
 * - bot-017 resolved to custom Tailored Poplin Pyjama Pant asset (bot-017.png)
 * - Zero clip art or placeholder vectors.
 */

export const CURATED_WARDROBE = ${JSON.stringify(updatedWardrobe, null, 2)};
`;

fs.writeFileSync(CURATED_FILE, fileHeader, 'utf8');
console.log(`Successfully updated curatedWardrobe.js (${updatedCuratedCount} URLs updated, ${CURATED_WARDROBE.length - updatedCuratedCount} retained).`);

console.log('\n--- 3. UPDATING SQLITE DATABASE (default-user catalog items) ---');
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

// Verify user-created items before update
const beforeCustom = db.prepare("SELECT COUNT(*) as count FROM clothing_items WHERE id LIKE 'item-%'").get();
console.log(`User-created items count before update: ${beforeCustom.count}`);

const updateStmt = db.prepare(`
  UPDATE clothing_items 
  SET image_url = ?, updated_at = ? 
  WHERE user_id = 'default-user' AND id = ?
`);

const now = new Date().toISOString();
let dbUpdatedCount = 0;

for (const item of updatedWardrobe) {
  const result = updateStmt.run(item.image_url, now, item.id);
  if (result.changes > 0) {
    dbUpdatedCount++;
  }
}
console.log(`Updated ${dbUpdatedCount} default-user records in clothing_items.`);

// Also update any seeded clone items where user_id != 'default-user' that have matching id prefixes like 'top-002-xxxxxx'
// But DO NOT touch id LIKE 'item-%'
const updateCloneStmt = db.prepare(`
  UPDATE clothing_items
  SET image_url = ?, updated_at = ?
  WHERE id LIKE ? AND id NOT LIKE 'item-%' AND user_id != 'default-user'
`);

let cloneUpdatedCount = 0;
for (const item of updatedWardrobe) {
  const result = updateCloneStmt.run(item.image_url, now, `${item.id}-%`);
  cloneUpdatedCount += Number(result.changes);
}
console.log(`Updated ${cloneUpdatedCount} cloned catalog records across other accounts.`);

// Verify user-created items after update
const afterCustom = db.prepare("SELECT COUNT(*) as count FROM clothing_items WHERE id LIKE 'item-%'").get();
console.log(`User-created items count after update: ${afterCustom.count}`);
if (beforeCustom.count !== afterCustom.count) {
  throw new Error('CRITICAL: User-created items count changed!');
}

console.log('\n--- 4. AUDIT ITEM bot-017 ---');
const bot017Db = db.prepare("SELECT id, name, category, sub_category, color, fabric, image_url FROM clothing_items WHERE id = 'bot-017' AND user_id = 'default-user'").get();
console.log('DB record for bot-017:', bot017Db);

const bot017Curated = updatedWardrobe.find(i => i.id === 'bot-017');
console.log('Curated record for bot-017:', {
  id: bot017Curated.id,
  name: bot017Curated.name,
  fabric: bot017Curated.fabric,
  color: bot017Curated.color,
  image_url: bot017Curated.image_url
});

if (bot017Curated.image_url === '/clothing-assets/dark_indigo_jeans.jpg' || bot017Db.image_url === '/clothing-assets/dark_indigo_jeans.jpg') {
  throw new Error('FAIL: bot-017 still points to dark_indigo_jeans.jpg!');
}
if (bot017Curated.image_url !== '/clothing-assets/bot-017.png' || bot017Db.image_url !== '/clothing-assets/bot-017.png') {
  throw new Error('FAIL: bot-017 does not point to /clothing-assets/bot-017.png!');
}

console.log('✓ bot-017 audit PASSED: correctly points to /clothing-assets/bot-017.png');
db.close();
console.log('\n--- INTEGRATION SUCCESSFUL ---');
