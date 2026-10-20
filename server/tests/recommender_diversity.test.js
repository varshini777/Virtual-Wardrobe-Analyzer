import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOutfitRecommendations } from '../src/services/recommender.js';

test('Recommender Diversity - Generates unique combinations without duplicates', () => {
  const items = [
    // Tops
    { id: 'top-1', name: 'White Linen Shirt', category: 'Top', sub_category: 'Shirt', color: 'White', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'top-2', name: 'Navy Polo Shirt', category: 'Top', sub_category: 'Polo', color: 'Navy', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'top-3', name: 'Grey Henley Tee', category: 'Top', sub_category: 'T-shirt', color: 'Grey', weather_suitability: 'Hot', occasion: 'Casual' },
    // Bottoms
    { id: 'bot-1', name: 'Beige Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Beige', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'bot-2', name: 'Olive Cotton Shorts', category: 'Bottom', sub_category: 'Shorts', color: 'Olive', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'bot-3', name: 'Dark Indigo Jeans', category: 'Bottom', sub_category: 'Jeans', color: 'Blue', weather_suitability: 'Hot', occasion: 'Casual' },
    // Shoes
    { id: 'sho-1', name: 'White Minimalist Sneakers', category: 'Shoes', sub_category: 'Sneakers', color: 'White', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'sho-2', name: 'Brown Suede Loafers', category: 'Shoes', sub_category: 'Loafers', color: 'Brown', weather_suitability: 'Hot', occasion: 'Casual' },
    // Accessories
    { id: 'acc-1', name: 'Brown Leather Watch', category: 'Accessories', sub_category: 'Watch', color: 'Brown', weather_suitability: 'All Weather', occasion: 'All Occasions' }
  ];

  const result = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    maxRecommendations: 5
  });

  assert.equal(result.success, true);
  assert.ok(result.recommendations.length >= 3);

  // Check no duplicate combinations
  const seenCombos = new Set();
  for (const rec of result.recommendations) {
    const key = `${rec.top.id}-${rec.bottom.id}-${rec.shoes.id}`;
    assert.equal(seenCombos.has(key), false, `Duplicate outfit found: ${key}`);
    seenCombos.add(key);
  }
});

test('Occasion Specificity - Traditional and Sports rules filter appropriately', () => {
  const items = [
    // Traditional pieces
    { id: 'top-kurta', name: 'White Chikan Kurta', category: 'Top', sub_category: 'Kurta', color: 'White', weather_suitability: 'Hot', occasion: 'Traditional/Ethnic' },
    { id: 'bot-pyjama', name: 'Churidar Pyjama', category: 'Bottom', sub_category: 'Pyjama', color: 'White', weather_suitability: 'Hot', occasion: 'Traditional/Ethnic' },
    { id: 'sho-jutti', name: 'Tan Leather Juttis', category: 'Shoes', sub_category: 'Juttis', color: 'Tan', weather_suitability: 'Hot', occasion: 'Traditional/Ethnic' },
    // Sports pieces
    { id: 'top-gym', name: 'Breathable Running Tee', category: 'Top', sub_category: 'T-shirt', color: 'Black', weather_suitability: 'Hot', occasion: 'Sports/Active' },
    { id: 'bot-shorts', name: 'Athletic Training Shorts', category: 'Bottom', sub_category: 'Shorts', color: 'Black', weather_suitability: 'Hot', occasion: 'Sports/Active' },
    { id: 'sho-runner', name: 'Pro Cushion Running Shoes', category: 'Shoes', sub_category: 'Running Shoes', color: 'Black', weather_suitability: 'Hot', occasion: 'Sports/Active' },
    // Incompatible formal piece
    { id: 'sho-oxford', name: 'Formal Black Oxfords', category: 'Shoes', sub_category: 'Formal Shoes', color: 'Black', weather_suitability: 'All Weather', occasion: 'Formal' }
  ];

  // Test Sports occasion
  const sportsRec = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Sports/Active',
    maxRecommendations: 3
  });
  assert.equal(sportsRec.success, true);
  for (const rec of sportsRec.recommendations) {
    assert.notEqual(rec.top.sub_category.toLowerCase(), 'kurta');
    assert.notEqual(rec.shoes.sub_category.toLowerCase(), 'formal shoes');
    assert.notEqual(rec.shoes.sub_category.toLowerCase(), 'juttis');
  }

  // Test Traditional occasion
  const tradRec = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Traditional/Ethnic',
    maxRecommendations: 3
  });
  assert.equal(tradRec.success, true);
  for (const rec of tradRec.recommendations) {
    assert.notEqual(rec.shoes.sub_category.toLowerCase(), 'running shoes');
  }
});

test('Recent History Freshness - Penalizes recently saved combinations', () => {
  const items = [
    { id: 'top-1', name: 'Navy Shirt', category: 'Top', sub_category: 'Shirt', color: 'Navy', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'top-2', name: 'White Shirt', category: 'Top', sub_category: 'Shirt', color: 'White', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'bot-1', name: 'Beige Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Beige', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'sho-1', name: 'White Sneakers', category: 'Shoes', sub_category: 'Sneakers', color: 'White', weather_suitability: 'All Weather', occasion: 'Casual' }
  ];

  // Without recentSaved
  const freshRec = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    recentSaved: []
  });

  // With top-1 and bot-1 and sho-1 recently saved
  const penalizedRec = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    recentSaved: [{ top_id: 'top-1', bottom_id: 'bot-1', shoes_id: 'sho-1' }]
  });

  const outfitWithout = freshRec.recommendations.find(r => r.top.id === 'top-1');
  const outfitWith = penalizedRec.recommendations.find(r => r.top.id === 'top-1');

  if (outfitWithout && outfitWith) {
    assert.ok(outfitWith.score < outfitWithout.score, 'Recently saved outfit should receive a freshness penalty');
  }
});
