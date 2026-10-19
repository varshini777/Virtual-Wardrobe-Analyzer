import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';
import http from 'node:http';

let server;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    // Listen on port 0 for random free port
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

test('API Health - returns status healthy', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('API Clothing Items - CRUD workflow and validation', async () => {
  const userId = `test-user-crud-${Date.now()}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };

  // 1. Initial items should be 0 for new test user
  const initialRes = await fetch(`${baseUrl}/api/items`, { headers });
  const initialData = await initialRes.json();
  assert.equal(initialData.success, true);
  assert.equal(initialData.items.length, 0);

  // 2. Validation error when missing required fields
  const invalidRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: '' })
  });
  assert.equal(invalidRes.status, 400);

  // 3. Create valid top
  const createTopRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Sky Blue Oxford Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'Blue',
      hex_color: '#38BDF8',
      weather_suitability: 'All Weather',
      occasion: 'Work',
      notes: 'Cotton fabric'
    })
  });
  assert.equal(createTopRes.status, 201);
  const createdTop = await createTopRes.json();
  assert.equal(createdTop.item.name, 'Sky Blue Oxford Shirt');
  assert.equal(createdTop.item.weather_suitability, 'All Weather');
  const topId = createdTop.item.id;

  // 4. Update the item
  const updateRes = await fetch(`${baseUrl}/api/items/${topId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      name: 'Sky Blue Oxford Shirt (Slim Fit)',
      weather_suitability: 'Hot'
    })
  });
  assert.equal(updateRes.status, 200);
  const updatedData = await updateRes.json();
  assert.equal(updatedData.item.name, 'Sky Blue Oxford Shirt (Slim Fit)');
  assert.equal(updatedData.item.weather_suitability, 'Hot');

  // 5. Delete the item
  const deleteRes = await fetch(`${baseUrl}/api/items/${topId}`, {
    method: 'DELETE',
    headers
  });
  assert.equal(deleteRes.status, 200);

  // 6. Verify item is gone
  const verifyRes = await fetch(`${baseUrl}/api/items/${topId}`, { headers });
  assert.equal(verifyRes.status, 404);
});

test('API Recommendations - Handles incomplete wardrobe and generates outfits when complete', async () => {
  const userId = `test-user-rec-${Date.now()}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };

  // Add 1 Top and 1 Bottom (missing Shoes)
  await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'White Tee',
      category: 'Top',
      sub_category: 'T-shirt',
      color: 'White',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    })
  });
  await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Blue Jeans',
      category: 'Bottom',
      sub_category: 'Jeans',
      color: 'Blue',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    })
  });

  // Check recommendation status
  const statusRes = await fetch(`${baseUrl}/api/recommendations/status`, { headers });
  const statusData = await statusRes.json();
  assert.equal(statusData.canGenerate, false);
  assert.deepEqual(statusData.missingCategories, ['Shoes']);

  // Generate call should report incomplete
  const genIncompleteRes = await fetch(`${baseUrl}/api/recommendations/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ weather: 'Hot', occasion: 'Casual' })
  });
  const genIncompleteData = await genIncompleteRes.json();
  assert.equal(genIncompleteData.canGenerate, false);
  assert.deepEqual(genIncompleteData.missingCategories, ['Shoes']);

  // Now add Shoes
  const shoeRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'White Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    })
  });
  const shoeData = await shoeRes.json();

  // Generate recommendations now
  const genRes = await fetch(`${baseUrl}/api/recommendations/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ weather: 'Hot', occasion: 'Casual' })
  });
  const genData = await genRes.json();
  assert.equal(genData.canGenerate, true);
  assert.ok(genData.recommendations.length > 0);
  assert.equal(genData.recommendations[0].top.name, 'White Tee');
  assert.equal(genData.recommendations[0].bottom.name, 'Blue Jeans');
  assert.equal(genData.recommendations[0].shoes.name, 'White Sneakers');
  assert.ok(genData.recommendations[0].explanation.length > 20);

  // Save the outfit
  const saveRes = await fetch(`${baseUrl}/api/outfits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'Crisp Weekend Look',
      weather: 'Hot',
      occasion: 'Casual',
      top_id: genData.recommendations[0].top.id,
      bottom_id: genData.recommendations[0].bottom.id,
      shoes_id: genData.recommendations[0].shoes.id,
      explanation: genData.recommendations[0].explanation,
      score: genData.recommendations[0].score
    })
  });
  assert.equal(saveRes.status, 201);
  const saveData = await saveRes.json();
  assert.equal(saveData.success, true);

  // List saved outfits
  const listOutfitsRes = await fetch(`${baseUrl}/api/outfits`, { headers });
  const listOutfitsData = await listOutfitsRes.json();
  assert.equal(listOutfitsData.count, 1);
  assert.equal(listOutfitsData.outfits[0].title, 'Crisp Weekend Look');
});

test('API User Preferences - updates and retrieves preferences', async () => {
  const userId = `test-pref-user-${Date.now()}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };

  const updateRes = await fetch(`${baseUrl}/api/preferences`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      favorite_colors: ['Navy', 'Olive'],
      disliked_colors: ['Neon Green'],
      preferred_styles: ['Minimalist'],
      default_weather: 'Cold',
      default_occasion: 'Work'
    })
  });
  assert.equal(updateRes.status, 200);

  const getRes = await fetch(`${baseUrl}/api/preferences`, { headers });
  const getData = await getRes.json();
  assert.deepEqual(getData.preferences.favorite_colors, ['Navy', 'Olive']);
  assert.deepEqual(getData.preferences.disliked_colors, ['Neon Green']);
  assert.equal(getData.preferences.default_weather, 'Cold');
  assert.equal(getData.preferences.default_occasion, 'Work');
});
