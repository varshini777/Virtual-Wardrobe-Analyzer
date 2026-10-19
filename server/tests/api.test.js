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

test('API Health - returns status healthy', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('Authentication - Registration, Login, Token Validation and Rejection', async () => {
  const testUser = {
    username: `user_auth_${Date.now()}`,
    name: 'Test Fashionista',
    password: 'SecurePassword123'
  };

  // 1. Unauthenticated request to protected route is rejected
  const unauthRes = await fetch(`${baseUrl}/api/items`);
  assert.equal(unauthRes.status, 401);
  const unauthData = await unauthRes.json();
  assert.equal(unauthData.success, false);

  // 2. Register new user
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...testUser, seedSample: false })
  });
  assert.equal(regRes.status, 201);
  const regData = await regRes.json();
  assert.equal(regData.success, true);
  assert.ok(regData.token);
  assert.equal(regData.user.username, testUser.username);

  // 3. Prevent duplicate username registration
  const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  assert.equal(dupRes.status, 409);

  // 4. Login with invalid password fails
  const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser.username, password: 'WrongPassword' })
  });
  assert.equal(badLoginRes.status, 401);

  // 5. Login with valid password succeeds
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser.username, password: testUser.password })
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token);

  // 6. Access /api/auth/me with valid Bearer token
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  assert.equal(meRes.status, 200);
  const meData = await meRes.json();
  assert.equal(meData.user.username, testUser.username);
});

test('Email Authentication - Registration, Email Validation, Duplicate Check, and Email Login', async () => {
  const timestamp = Date.now();
  const emailUser = {
    email: `fashionista_${timestamp}@wardrobe.me`,
    name: 'Helena Vance',
    password: 'CouturePassword2026'
  };

  // 1. Reject invalid email format
  const invalidEmailRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'not-an-email',
      name: 'Bad Email',
      password: 'ValidPassword123'
    })
  });
  assert.equal(invalidEmailRes.status, 400);

  // 2. Register with valid email
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...emailUser, seedSample: false })
  });
  assert.equal(regRes.status, 201);
  const regData = await regRes.json();
  assert.equal(regData.success, true);
  assert.ok(regData.token);
  assert.equal(regData.user.email, emailUser.email);
  assert.equal(regData.user.name, emailUser.name);

  // 3. Reject duplicate email registration
  const dupEmailRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...emailUser, name: 'Duplicate User' })
  });
  assert.equal(dupEmailRes.status, 409);

  // 4. Login with email
  const emailLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailUser.email,
      password: emailUser.password
    })
  });
  assert.equal(emailLoginRes.status, 200);
  const loginData = await emailLoginRes.json();
  assert.equal(loginData.success, true);
  assert.ok(loginData.token);
  assert.equal(loginData.user.email, emailUser.email);

  // 5. Login with demo email
  const demoEmailLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@wardrobe.internal',
      password: 'demo123'
    })
  });
  assert.equal(demoEmailLoginRes.status, 200);
  const demoData = await demoEmailLoginRes.json();
  assert.equal(demoData.success, true);
});

test('Cross-User Data Isolation - Strict Authorization & Ownership Verification', async () => {
  // Register User A
  const userARes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `user_a_${Date.now()}`,
      name: 'User Alpha',
      password: 'Password123',
      seedSample: false
    })
  });
  const userAData = await userARes.json();
  const tokenA = userAData.token;

  // Register User B
  const userBRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `user_b_${Date.now()}`,
      name: 'User Beta',
      password: 'Password123',
      seedSample: false
    })
  });
  const userBData = await userBRes.json();
  const tokenB = userBData.token;

  // User A creates an item
  const createRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      name: 'Alpha Secret Designer Jacket',
      category: 'Top',
      sub_category: 'Jacket',
      color: 'Black'
    })
  });
  const createdItem = (await createRes.json()).item;

  // User B attempts to access User A's item -> MUST BE 404
  const breachGet = await fetch(`${baseUrl}/api/items/${createdItem.id}`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert.equal(breachGet.status, 404);

  // User B attempts to update User A's item -> MUST BE 404
  const breachPut = await fetch(`${baseUrl}/api/items/${createdItem.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({ name: 'Hacked Jacket' })
  });
  assert.equal(breachPut.status, 404);

  // User B attempts to delete User A's item -> MUST BE 404
  const breachDelete = await fetch(`${baseUrl}/api/items/${createdItem.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert.equal(breachDelete.status, 404);

  // User B listing items sees 0 items
  const userBList = await fetch(`${baseUrl}/api/items`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const userBItems = await userBList.json();
  assert.equal(userBItems.items.length, 0);

  // User B cannot save outfit using User A's item IDs -> 403 Forbidden
  const breachOutfit = await fetch(`${baseUrl}/api/outfits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({
      title: 'Stolen Outfit',
      weather: 'Hot',
      occasion: 'Casual',
      top_id: createdItem.id,
      bottom_id: 'fake-bottom',
      shoes_id: 'fake-shoes'
    })
  });
  assert.equal(breachOutfit.status, 403);
});

test('Clothing Item Management & Dynamic Image Assignment', async () => {
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `user_img_${Date.now()}`,
      name: 'Image Tester',
      password: 'Password123',
      seedSample: false
    })
  });
  const token = (await regRes.json()).token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 1. Add item with no image -> verify dynamic catalog image auto-assignment
  const addTshirtRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Organic White Crewneck',
      category: 'Top',
      sub_category: 'T-shirt',
      color: 'White',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    })
  });
  assert.equal(addTshirtRes.status, 201);
  const tshirt = (await addTshirtRes.json()).item;
  assert.match(tshirt.image_url, /top_white_tshirt\.jpg/);

  // 2. Add bottom with no image -> verify chinos asset assignment
  const addChinosRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Classic Beige Trousers',
      category: 'Bottom',
      sub_category: 'Chinos',
      color: 'Beige',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    })
  });
  const chinos = (await addChinosRes.json()).item;
  assert.match(chinos.image_url, /bottom_beige_chinos\.jpg/);

  // 3. Add item with explicit custom upload image URL -> verify custom image is preserved
  const customImgUrl = '/uploads/my-custom-sneaker.png';
  const addCustomRes = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Custom Sneaker',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual',
      image_url: customImgUrl
    })
  });
  const customShoe = (await addCustomRes.json()).item;
  assert.equal(customShoe.image_url, customImgUrl);

  // 4. Update item and verify database persistence
  const updateRes = await fetch(`${baseUrl}/api/items/${tshirt.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      name: 'Organic White Crewneck (Tailored Fit)',
      weather_suitability: 'All Weather'
    })
  });
  assert.equal(updateRes.status, 200);
  const updatedTshirt = (await updateRes.json()).item;
  assert.equal(updatedTshirt.name, 'Organic White Crewneck (Tailored Fit)');
  assert.equal(updatedTshirt.weather_suitability, 'All Weather');

  // 5. Delete item
  const delRes = await fetch(`${baseUrl}/api/items/${tshirt.id}`, {
    method: 'DELETE',
    headers
  });
  assert.equal(delRes.status, 200);
});

test('Outfit Recommendation, Saved Outfits & Persistent Garment Images', async () => {
  // Register user and seed sample wardrobe
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `user_rec_${Date.now()}`,
      name: 'Recommendation Tester',
      password: 'Password123',
      seedSample: true
    })
  });
  const token = (await regRes.json()).token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 1. Check status is complete
  const statusRes = await fetch(`${baseUrl}/api/recommendations/status`, { headers });
  const statusData = await statusRes.json();
  assert.equal(statusData.canGenerate, true);
  assert.equal(statusData.missingCategories.length, 0);

  // 2. Generate outfit recommendations
  const genRes = await fetch(`${baseUrl}/api/recommendations/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ weather: 'Hot', occasion: 'Casual' })
  });
  assert.equal(genRes.status, 200);
  const genData = await genRes.json();
  assert.equal(genData.canGenerate, true);
  assert.ok(genData.recommendations.length > 0);

  // Verify each recommendation has actual garment images
  const rec = genData.recommendations[0];
  assert.ok(rec.top.image_url, 'Top must have an image_url');
  assert.ok(rec.bottom.image_url, 'Bottom must have an image_url');
  assert.ok(rec.shoes.image_url, 'Shoes must have an image_url');
  assert.ok(rec.explanation.length > 20, 'Must have meaningful stylist rationale');
  assert.ok(rec.harmony_badge, 'Must have qualitative harmony badge');

  // 3. Save the outfit
  const saveRes = await fetch(`${baseUrl}/api/outfits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'Summer Seaside Casual',
      weather: 'Hot',
      occasion: 'Casual',
      top_id: rec.top.id,
      bottom_id: rec.bottom.id,
      shoes_id: rec.shoes.id,
      accessory_id: rec.accessory?.id || null,
      explanation: rec.explanation,
      score: rec.score
    })
  });
  assert.equal(saveRes.status, 201);

  // 4. Fetch saved outfits and verify images remain consistent
  const savedRes = await fetch(`${baseUrl}/api/outfits`, { headers });
  const savedData = await savedRes.json();
  assert.equal(savedData.count, 1);
  const savedOutfit = savedData.outfits[0];
  assert.equal(savedOutfit.title, 'Summer Seaside Casual');
  assert.ok(savedOutfit.top.image_url, 'Saved top must preserve image');
  assert.ok(savedOutfit.bottom.image_url, 'Saved bottom must preserve image');
  assert.ok(savedOutfit.shoes.image_url, 'Saved shoes must preserve image');
});
