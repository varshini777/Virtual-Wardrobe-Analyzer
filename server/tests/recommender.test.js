import test from 'node:test';
import assert from 'node:assert/strict';
import { checkWardrobeCompleteness, generateOutfitRecommendations } from '../src/services/recommender.js';

test('Wardrobe Completeness - accurately flags missing essential categories', () => {
  // Empty wardrobe
  const emptyRes = checkWardrobeCompleteness([]);
  assert.equal(emptyRes.canGenerate, false);
  assert.deepEqual(emptyRes.missingCategories, ['Top', 'Bottom', 'Shoes']);

  // Missing shoes
  const itemsWithoutShoes = [
    { id: '1', name: 'White Tee', category: 'Top' },
    { id: '2', name: 'Blue Jeans', category: 'Bottom' }
  ];
  const missingShoesRes = checkWardrobeCompleteness(itemsWithoutShoes);
  assert.equal(missingShoesRes.canGenerate, false);
  assert.deepEqual(missingShoesRes.missingCategories, ['Shoes']);
  assert.match(missingShoesRes.message, /Currently missing: Shoes/);

  // Complete wardrobe
  const completeItems = [
    { id: '1', name: 'White Tee', category: 'Top' },
    { id: '2', name: 'Blue Jeans', category: 'Bottom' },
    { id: '3', name: 'Sneakers', category: 'Shoes' }
  ];
  const completeRes = checkWardrobeCompleteness(completeItems);
  assert.equal(completeRes.canGenerate, true);
  assert.deepEqual(completeRes.missingCategories, []);
});

test('Weather Suitability - Hot weather filters out heavy cold garments', () => {
  const items = [
    {
      id: 'top-hot',
      name: 'Linen Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'White',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    },
    {
      id: 'top-cold',
      name: 'Heavy Wool Sweater',
      category: 'Top',
      sub_category: 'Sweater',
      color: 'Grey',
      weather_suitability: 'Cold',
      occasion: 'Casual'
    },
    {
      id: 'bot-1',
      name: 'Chino Shorts',
      category: 'Bottom',
      sub_category: 'Shorts',
      color: 'Beige',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    },
    {
      id: 'sho-1',
      name: 'Canvas Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual'
  });

  assert.equal(res.canGenerate, true);
  assert.ok(res.recommendations.length > 0);
  // Heavy wool sweater must NOT be chosen for Hot weather
  for (const rec of res.recommendations) {
    assert.equal(rec.top.id, 'top-hot');
    assert.notEqual(rec.top.id, 'top-cold');
  }
});

test('Weather Suitability - Cold weather filters out shorts', () => {
  const items = [
    {
      id: 'top-1',
      name: 'Hoodie',
      category: 'Top',
      sub_category: 'Hoodie',
      color: 'Black',
      weather_suitability: 'Cold',
      occasion: 'Casual'
    },
    {
      id: 'bot-shorts',
      name: 'Gym Shorts',
      category: 'Bottom',
      sub_category: 'Shorts',
      color: 'Black',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    },
    {
      id: 'bot-jeans',
      name: 'Dark Jeans',
      category: 'Bottom',
      sub_category: 'Jeans',
      color: 'Navy',
      weather_suitability: 'Cold',
      occasion: 'Casual'
    },
    {
      id: 'sho-1',
      name: 'Chelsea Boots',
      category: 'Shoes',
      sub_category: 'Boots',
      color: 'Black',
      weather_suitability: 'Cold',
      occasion: 'Casual'
    }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Cold',
    occasion: 'Casual'
  });

  assert.equal(res.canGenerate, true);
  assert.ok(res.recommendations.length > 0);
  for (const rec of res.recommendations) {
    assert.equal(rec.bottom.id, 'bot-jeans');
    assert.notEqual(rec.bottom.id, 'bot-shorts');
  }
});

test('Occasion Filtering - Formal occasion filters out T-shirts and shorts', () => {
  const items = [
    {
      id: 'top-casual',
      name: 'Graphic T-Shirt',
      category: 'Top',
      sub_category: 'T-shirt',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'top-formal',
      name: 'French Cuff Dress Shirt',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Formal'
    },
    {
      id: 'bot-formal',
      name: 'Pleated Trousers',
      category: 'Bottom',
      sub_category: 'Trousers',
      color: 'Grey',
      weather_suitability: 'All Weather',
      occasion: 'Formal'
    },
    {
      id: 'sho-formal',
      name: 'Oxford Shoes',
      category: 'Shoes',
      sub_category: 'Formal Shoes',
      color: 'Black',
      weather_suitability: 'All Weather',
      occasion: 'Formal'
    }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Formal'
  });

  assert.equal(res.canGenerate, true);
  assert.ok(res.recommendations.length > 0);
  for (const rec of res.recommendations) {
    assert.equal(rec.top.id, 'top-formal');
  }
});

test('Color Harmony & Preferences - Boosts score for favorite colors', () => {
  const items = [
    {
      id: 'top-navy',
      name: 'Navy Polo',
      category: 'Top',
      sub_category: 'Polo',
      color: 'Navy',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'top-yellow',
      name: 'Bright Yellow Polo',
      category: 'Top',
      sub_category: 'Polo',
      color: 'Yellow',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'bot-beige',
      name: 'Beige Chinos',
      category: 'Bottom',
      sub_category: 'Chinos',
      color: 'Beige',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'sho-white',
      name: 'White Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    }
  ];

  const resWithNavyFav = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    preferences: {
      favorite_colors: ['Navy'],
      disliked_colors: ['Yellow']
    }
  });

  assert.ok(resWithNavyFav.recommendations.length > 0);
  // Top recommendation should be Navy Polo
  assert.equal(resWithNavyFav.recommendations[0].top.id, 'top-navy');
  assert.match(resWithNavyFav.recommendations[0].explanation, /Navy/);
});

test('Weather Suitability - Rainy weather prioritizes waterproof boots and excludes sandals and white footwear', () => {
  const items = [
    {
      id: 'top-1',
      name: 'Navy Button-Down',
      category: 'Top',
      sub_category: 'Shirt',
      color: 'Navy',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'bot-1',
      name: 'Dark Trousers',
      category: 'Bottom',
      sub_category: 'Trousers',
      color: 'Grey',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'sho-sandals',
      name: 'Leather Sandals',
      category: 'Shoes',
      sub_category: 'Sandals',
      color: 'Brown',
      weather_suitability: 'Hot',
      occasion: 'Casual'
    },
    {
      id: 'sho-white-snk',
      name: 'White Canvas Sneakers',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'White',
      weather_suitability: 'All Weather',
      occasion: 'Casual'
    },
    {
      id: 'sho-boots',
      name: 'Waterproof Chelsea Boots',
      category: 'Shoes',
      sub_category: 'Boots',
      color: 'Black',
      weather_suitability: 'Rainy',
      occasion: 'Casual'
    }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Rainy',
    occasion: 'Casual'
  });

  assert.equal(res.canGenerate, true);
  assert.ok(res.recommendations.length > 0);
  // Must select the Waterproof Chelsea Boots
  assert.equal(res.recommendations[0].shoes.id, 'sho-boots');
  assert.match(res.recommendations[0].explanation, /Rainy|damp|footwear/);
});

