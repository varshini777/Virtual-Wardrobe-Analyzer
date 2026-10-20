import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';
import http from 'node:http';

let server;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    server = http.createServer(app).listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test('Extended Item Metadata & Multi-attribute Filtering & Sorting', async () => {
  const user = {
    username: `filter_test_${Date.now()}`,
    email: `filter_${Date.now()}@example.com`,
    password: 'Password123!',
    seedSample: false
  };

  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const { token } = await regRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Add items with extended metadata
  const item1 = await (await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Linen Summer Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'White',
      secondary_color: 'Blue',
      pattern: 'Striped',
      fabric: 'Linen',
      season: 'Summer',
      style: 'Smart Casual',
      weather_suitability: 'Hot'
    })
  })).json();

  const item2 = await (await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Merino Wool Winter Knit',
      category: 'Top',
      sub_category: 'Sweater',
      color: 'Grey',
      fabric: 'Wool',
      season: 'Winter',
      style: 'Minimalist',
      weather_suitability: 'Cold'
    })
  })).json();

  const item3 = await (await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Tailored Wool Trousers',
      category: 'Bottom',
      sub_category: 'Trousers',
      color: 'Charcoal',
      season: 'Winter',
      fabric: 'Wool',
      style: 'Formal',
      weather_suitability: 'Cold'
    })
  })).json();

  assert.equal(item1.success, true);
  assert.equal(item1.item.fabric, 'Linen');
  assert.equal(item1.item.pattern, 'Striped');
  assert.equal(item1.item.season, 'Summer');

  // Test filter by season=Summer
  const summerFilterRes = await (await fetch(`${baseUrl}/api/items?season=Summer`, {
    headers: authHeaders
  })).json();
  assert.equal(summerFilterRes.success, true);
  assert.equal(summerFilterRes.count, 1);
  assert.equal(summerFilterRes.items[0].name, 'Linen Summer Shirt');

  // Test filter by category=Top and season=Winter
  const winterTopRes = await (await fetch(`${baseUrl}/api/items?category=Top&season=Winter`, {
    headers: authHeaders
  })).json();
  assert.equal(winterTopRes.success, true);
  assert.equal(winterTopRes.count, 1);
  assert.equal(winterTopRes.items[0].name, 'Merino Wool Winter Knit');

  // Test search query
  const searchRes = await (await fetch(`${baseUrl}/api/items?search=wool`, {
    headers: authHeaders
  })).json();
  assert.equal(searchRes.success, true);
  assert.equal(searchRes.count, 2);

  // Test sorting by name_asc
  const sortRes = await (await fetch(`${baseUrl}/api/items?sort=name_asc`, {
    headers: authHeaders
  })).json();
  assert.equal(sortRes.success, true);
  assert.equal(sortRes.items[0].name, 'Linen Summer Shirt');
});

test('Preferences API - Updates and persists default_season', async () => {
  const user = {
    username: `pref_season_${Date.now()}`,
    email: `pref_season_${Date.now()}@example.com`,
    password: 'Password123!',
    seedSample: false
  };

  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const { token } = await regRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Update preferences with default_season
  const updateRes = await (await fetch(`${baseUrl}/api/preferences`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      favorite_colors: ['Navy', 'Burgundy'],
      disliked_colors: ['Yellow'],
      preferred_styles: ['Minimalist', 'Smart Casual'],
      default_weather: 'Cold',
      default_occasion: 'Work',
      default_season: 'Autumn'
    })
  })).json();

  assert.equal(updateRes.success, true);
  assert.equal(updateRes.preferences.default_season, 'Autumn');
  assert.deepEqual(updateRes.preferences.favorite_colors, ['Navy', 'Burgundy']);

  // Fetch preferences to verify persistence
  const getRes = await (await fetch(`${baseUrl}/api/preferences`, {
    headers: authHeaders
  })).json();
  assert.equal(getRes.success, true);
  assert.equal(getRes.preferences.default_season, 'Autumn');
});

test('Saved Outfits - Graceful handling when a clothing item is deleted', async () => {
  const user = {
    username: `archived_outfit_${Date.now()}`,
    email: `archived_${Date.now()}@example.com`,
    password: 'Password123!',
    seedSample: true // seed sample items
  };

  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const { token } = await regRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Get items including an accessory
  const itemsRes = await (await fetch(`${baseUrl}/api/items`, { headers: authHeaders })).json();
  const top = itemsRes.items.find(i => i.category === 'Top');
  const bottom = itemsRes.items.find(i => i.category === 'Bottom');
  const shoe = itemsRes.items.find(i => i.category === 'Shoes');
  const acc = itemsRes.items.find(i => i.category === 'Accessories');

  // Save outfit with accessory
  const saveRes = await (await fetch(`${baseUrl}/api/outfits`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Summer Casual Look',
      weather: 'Hot',
      occasion: 'Casual',
      top_id: top.id,
      bottom_id: bottom.id,
      shoes_id: shoe.id,
      accessory_id: acc ? acc.id : null,
      explanation: 'Great color harmony.'
    })
  })).json();
  assert.equal(saveRes.success, true);

  if (acc) {
    // Delete the accessory from the closet
    const delAccRes = await (await fetch(`${baseUrl}/api/items/${acc.id}`, {
      method: 'DELETE',
      headers: authHeaders
    })).json();
    assert.equal(delAccRes.success, true);

    // Fetch saved outfits - outfit must remain saved, and accessory falls back gracefully
    const outfitsRes = await (await fetch(`${baseUrl}/api/outfits`, { headers: authHeaders })).json();
    assert.equal(outfitsRes.success, true);
    assert.equal(outfitsRes.count, 1);
    const outfit = outfitsRes.outfits[0];
    assert.ok(outfit.accessory);
    assert.equal(outfit.accessory.name, 'Accessory'); // fallback default
    assert.ok(outfit.accessory.image_url);
  }

  // Now delete the core top item from closet - SQLite ON DELETE CASCADE cleans up saved outfit
  const delTopRes = await (await fetch(`${baseUrl}/api/items/${top.id}`, {
    method: 'DELETE',
    headers: authHeaders
  })).json();
  assert.equal(delTopRes.success, true);

  const finalOutfitsRes = await (await fetch(`${baseUrl}/api/outfits`, { headers: authHeaders })).json();
  assert.equal(finalOutfitsRes.success, true);
  assert.equal(finalOutfitsRes.count, 0); // cleanly cascaded
});
