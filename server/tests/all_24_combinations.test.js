import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOutfitRecommendations, checkWardrobeCompleteness } from '../src/services/recommender.js';
import { CURATED_WARDROBE } from '../src/data/curatedWardrobe.js';

const WEATHERS = ['Hot', 'Mild', 'Cold', 'Rainy'];
const OCCASIONS = ['Casual', 'Smart Casual', 'Work / Formal', 'Party', 'Sports / Active', 'Traditional'];

test('AUDIT: All 24 Weather-Occasion Combinations Produce Stylistically & Thermodynamically Valid Outfits', async (t) => {
  for (const weather of WEATHERS) {
    for (const occasion of OCCASIONS) {
      await t.test(`Matrix Test: ${weather} × ${occasion}`, () => {
        const res = generateOutfitRecommendations({
          items: CURATED_WARDROBE,
          weather,
          occasion,
          maxRecommendations: 5
        });

        assert.equal(res.success, true, `Recommendation should succeed for ${weather} × ${occasion}`);
        assert.equal(res.canGenerate, true);
        assert.ok(res.recommendations.length > 0, `Expected recommendations for ${weather} × ${occasion}, got ${res.recommendations.length}`);

        for (const outfit of res.recommendations) {
          // 1. Structure
          assert.ok(outfit.top, 'Outfit must have a top');
          assert.ok(outfit.bottom, 'Outfit must have a bottom');
          assert.ok(outfit.shoes, 'Outfit must have shoes');
          assert.equal(outfit.weather, weather);
          assert.equal(outfit.occasion, occasion);

          const topSub = (outfit.top.sub_category || '').toLowerCase();
          const botSub = (outfit.bottom.sub_category || '').toLowerCase();
          const shoSub = (outfit.shoes.sub_category || '').toLowerCase();
          const topName = (outfit.top.name || '').toLowerCase();
          const botName = (outfit.bottom.name || '').toLowerCase();
          const shoName = (outfit.shoes.name || '').toLowerCase();

          // 2. Weather thermodynamic rules
          if (weather === 'Hot') {
            assert.ok(!['sweater', 'hoodie', 'overcoat', 'heavy coat', 'parka', 'beanie', 'scarf', 'turtleneck'].includes(topSub),
              `Hot weather must not contain heavy knitwear: ${outfit.top.name}`);
            assert.ok(!['boots', 'winter boots', 'lug boot', 'chelsea boots'].includes(shoSub),
              `Hot weather must not contain heavy boots: ${outfit.shoes.name}`);
          }

          if (weather === 'Cold') {
            assert.ok(!['shorts', 'flip flops', 'tank top', 'sleeveless'].includes(botSub) && !['shorts'].includes(botSub),
              `Cold weather must not contain shorts: ${outfit.bottom.name}`);
            assert.ok(!shoSub.includes('sandal') && !shoSub.includes('flip flop'),
              `Cold weather must not contain open sandals: ${outfit.shoes.name}`);
          }

          if (weather === 'Rainy') {
            assert.ok(!shoSub.includes('sandal') && !shoSub.includes('flip flop'),
              `Rainy weather must not contain open sandals: ${outfit.shoes.name}`);
            assert.ok(!shoName.includes('suede'),
              `Rainy weather must not contain vulnerable suede footwear: ${outfit.shoes.name}`);
          }

          // 3. Occasion formality rules
          if (occasion === 'Work / Formal') {
            assert.ok(!['t-shirt', 'hoodie', 'tank top'].includes(topSub) && !topName.includes('tee') && !topName.includes('hoodie'),
              `Work / Formal must not have casual tees/hoodies: ${outfit.top.name}`);
            assert.ok(!['shorts', 'joggers', 'track pants', 'cargo pants', 'overalls', 'jeans'].includes(botSub) && !botName.includes('jeans'),
              `Work / Formal must not have casual denim or sweatpants: ${outfit.bottom.name}`);
            assert.ok(!['sandals', 'flip flops', 'running shoes', 'athletic sneakers', 'slippers', 'deck shoes', 'sneakers'].includes(shoSub) && !shoName.includes('sneaker') && !shoName.includes('runner'),
              `Work / Formal must not have sneakers or casual deck shoes: ${outfit.shoes.name}`);
          }

          if (occasion === 'Sports / Active') {
            assert.ok(!['blazer', 'suit jacket', 'kurta', 'sherwani', 'dress shirt'].includes(topSub) && !topName.includes('blazer'),
              `Sports must not have formal tops/blazers: ${outfit.top.name}`);
            assert.ok(['shorts', 'joggers', 'track pants', 'sweatpants'].includes(botSub) || botName.includes('jogger') || botName.includes('track') || botName.includes('trail') || botName.includes('running'),
              `Sports must have athletic bottoms: ${outfit.bottom.name}`);
            assert.ok(['sneakers', 'running shoes', 'trainers', 'athletic sneakers'].includes(shoSub) || shoName.includes('runner') || shoName.includes('trainer') || shoName.includes('court'),
              `Sports must have athletic sneakers/trainers: ${outfit.shoes.name}`);
            assert.ok(!['deck', 'loafer', 'oxford', 'derby', 'boot', 'sandal'].some(k => shoName.includes(k) || shoSub.includes(k)),
              `Sports must not have dress shoes or deck shoes: ${outfit.shoes.name}`);
          }

          if (occasion === 'Traditional') {
            assert.ok(['kurta', 'sherwani', 'nehru jacket'].includes(topSub) || topName.includes('kurta') || topName.includes('nehru'),
              `Traditional must have authentic traditional tops: ${outfit.top.name}`);
            assert.ok(!botName.includes('jeans') && !['shorts', 'sweatpants'].includes(botSub),
              `Traditional must not have blue jeans or sweatpants: ${outfit.bottom.name}`);
            assert.ok(!shoName.includes('running') && !shoName.includes('athletic'),
              `Traditional must not have gym running shoes: ${outfit.shoes.name}`);
          }

          if (occasion === 'Smart Casual') {
            assert.ok(!['shorts', 'track pants', 'joggers'].includes(botSub),
              `Smart Casual must not have gym sweatpants or shorts: ${outfit.bottom.name}`);
            assert.ok(!shoSub.includes('sandal') && !shoSub.includes('flip flop') && !shoName.includes('running'),
              `Smart Casual must not have open sandals or gym trainers: ${outfit.shoes.name}`);
          }

          // 4. Derived compatibility scores (0-100 without artificial floor clamp)
          assert.ok(typeof outfit.score === 'number' && outfit.score >= 0 && outfit.score <= 100,
            `Score should be between 0 and 100, got ${outfit.score}`);
          assert.ok(outfit.score_breakdown, 'Must provide detailed score breakdown');

          // 5. Accurate explanations referencing garments
          assert.ok(outfit.explanation && outfit.explanation.length > 25, 'Must provide descriptive explanation');
          assert.ok(
            outfit.explanation.includes(outfit.top.name) ||
            outfit.explanation.includes(outfit.bottom.name) ||
            outfit.explanation.includes(outfit.shoes.name) ||
            outfit.explanation.includes(outfit.top.color) ||
            outfit.explanation.includes(outfit.bottom.color),
            'Explanation must refer to actual garment details'
          );
        }
      });
    }
  }
});

test('AUDIT: Graceful Limitation Messages on Wardrobe Incompleteness & Gaps', () => {
  // Missing footwear
  const noShoes = CURATED_WARDROBE.filter(i => i.category !== 'Shoes');
  const resNoShoes = generateOutfitRecommendations({ items: noShoes, weather: 'Mild', occasion: 'Casual' });
  assert.equal(resNoShoes.canGenerate, false);
  assert.ok(resNoShoes.missingCategories.includes('Shoes'));
  assert.ok(resNoShoes.message.includes('missing: Shoes'));

  // Missing traditional garments when requesting Traditional
  const noTraditional = CURATED_WARDROBE.filter(i => 
    !i.name.toLowerCase().includes('kurta') && 
    !i.name.toLowerCase().includes('nehru') &&
    !i.name.toLowerCase().includes('traditional')
  );
  const resNoTrad = generateOutfitRecommendations({ items: noTraditional, weather: 'Mild', occasion: 'Traditional' });
  assert.equal(resNoTrad.canGenerate, true);
  assert.equal(resNoTrad.recommendations.length, 0);
  assert.ok(resNoTrad.message.includes('No traditional cultural garments'));
});

test('AUDIT: Preference Priority Hierarchy & Contradiction Resolution', () => {
  // Scenario 1: User explicitly requests preferredColor: 'Blue'
  // Even if saved preferences contained Blue as a disliked color, current request wins!
  const resWithBlue = generateOutfitRecommendations({
    items: CURATED_WARDROBE,
    weather: 'Mild',
    occasion: 'Casual',
    preferredColor: 'Blue',
    preferences: {
      favorite_colors: ['Green'],
      disliked_colors: ['Blue'] // Conflicting old saved preference
    }
  });

  assert.equal(resWithBlue.success, true);
  assert.ok(resWithBlue.recommendations.length > 0);
  // Top recommendation should incorporate Blue
  const topOutfitsHaveBlue = resWithBlue.recommendations.some(r => {
    const c = `${r.top.color} ${r.bottom.color} ${r.shoes.color} ${r.top.name} ${r.bottom.name}`.toLowerCase();
    return c.includes('blue') || c.includes('navy') || c.includes('denim') || c.includes('indigo');
  });
  assert.equal(topOutfitsHaveBlue, true, 'Explicitly preferred color Blue must influence top recommendations');

  // Scenario 2: User explicitly selects preferredColor: 'No Preference'
  // Should NOT fall back to saved favorite_colors
  const resNoPref = generateOutfitRecommendations({
    items: CURATED_WARDROBE,
    weather: 'Mild',
    occasion: 'Casual',
    preferredColor: 'No Preference',
    preferences: {
      favorite_colors: ['Neon Green']
    }
  });
  assert.equal(resNoPref.success, true);
  assert.ok(resNoPref.recommendations.length > 0);

  // Scenario 3: Preferred color does NOT force monochromatic outfits
  const topRec = resWithBlue.recommendations[0];
  const uniqueColors = new Set([topRec.top.color.toLowerCase(), topRec.bottom.color.toLowerCase(), topRec.shoes.color.toLowerCase()]);
  assert.ok(uniqueColors.size >= 2, 'Preferred color must not force unnatural monochromatic outfits');
});

test('AUDIT: White Footwear in Rainy Weather Has Appropriate Penalty Without Outright Exclusion', () => {
  // White sneakers in rain should be valid with a moderate splash vulnerability penalty, not hard-rejected
  const whiteSneakers = {
    name: 'Minimalist White Calfskin Sneaker',
    category: 'Shoes',
    sub_category: 'Sneakers',
    color: 'White',
    fabric: 'Smooth Calfskin Leather with Rubber Sole',
    weather_suitability: 'All Weather'
  };

  const rainSuitability = generateOutfitRecommendations({
    items: [
      { id: 't1', name: 'Water-Resistant Overshirt', category: 'Top', sub_category: 'Shirt', color: 'Navy', weather_suitability: 'All Weather' },
      { id: 'b1', name: 'Dark Indigo Raw Denim', category: 'Bottom', sub_category: 'Jeans', color: 'Navy', weather_suitability: 'All Weather' },
      whiteSneakers
    ],
    weather: 'Rainy',
    occasion: 'Casual'
  });

  assert.equal(rainSuitability.canGenerate, true);
  assert.ok(rainSuitability.recommendations.length > 0, 'White leather sneakers should not be outright excluded in rainy weather');
});
