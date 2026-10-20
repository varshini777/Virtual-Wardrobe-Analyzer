import { db } from '../server/src/db/database.js';

const userItems = db.prepare("SELECT COUNT(*) as c FROM clothing_items WHERE id LIKE 'item-%'").get();
console.log('User created items count:', userItems.c);

const users = db.prepare('SELECT id, username, email FROM users').all();
console.log('Total users:', users.length);
const defaultUser = db.prepare("SELECT id, username, email FROM users WHERE id = 'default-user'").get();
console.log('Default user record:', defaultUser);
const demoUser = db.prepare("SELECT id, username, email FROM users WHERE username = 'demo'").get();
console.log('Demo username record:', demoUser);

const savedOutfits = db.prepare('SELECT COUNT(*) as c FROM saved_outfits').get();
console.log('Saved outfits count:', savedOutfits.c);

const history = db.prepare('SELECT COUNT(*) as c FROM recommendation_history').get();
console.log('Recommendation history count:', history.c);
