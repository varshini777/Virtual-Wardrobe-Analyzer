import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateOutfitRecommendations,
  evaluatePairHarmony,
  evaluateEnsembleColorCoordination,
  evaluateWeatherSuitability,
  evaluateOccasionFormality,
  evaluateGenderPresentation,
  evaluateFitAndSilhouette,
  evaluatePersonalStyle,
  normalizeColor,
  checkWardrobeCompleteness
} from '../src/services/recommender.js';

// =============================================================================
// COLOR COMPATIBILITY TESTS
// =============================================================================

test('COLOR: Navy + beige + brown forms a classic harmonious palette', () => {
  const top = { id: 't1', name: 'Navy Shirt', color: 'Navy', category: 'Top' };
  const bot = { id: 'b1', name: 'Beige Chinos', color: 'Beige', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Brown Loafers', color: 'Brown', category: 'Shoes' };

  const res = evaluateEnsembleColorCoordination(top, bot, shoe);
  assert.equal(res.valid, true);
  assert.ok(res.score >= 80, `Expected high score for navy+beige+brown, got ${res.score}`);
  assert.ok(res.reasons.some(r => r.includes('nautical-tailored') || r.includes('contrast') || r.includes('harmonize')));
});

test('COLOR: White + black forms clean high-contrast monochrome harmony', () => {
  const top = { id: 't1', name: 'White Tee', color: 'White', category: 'Top' };
  const bot = { id: 'b1', name: 'Black Jeans', color: 'Black', category: 'Bottom' };
  const shoe = { id: 's1', name: 'White Sneakers', color: 'White', category: 'Shoes' };

  const res = evaluateEnsembleColorCoordination(top, bot, shoe);
  assert.equal(res.valid, true);
  assert.ok(res.score >= 80);
});

test('COLOR: Olive + cream + brown forms an organic earth-tone palette', () => {
  const top = { id: 't1', name: 'Olive Overshirt', color: 'Olive', category: 'Top' };
  const bot = { id: 'b1', name: 'Cream Trousers', color: 'Cream', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Brown Boots', color: 'Brown', category: 'Shoes' };

  const res = evaluateEnsembleColorCoordination(top, bot, shoe);
  assert.equal(res.valid, true);
  assert.ok(res.score >= 80);
  assert.ok(res.reasons.some(r => r.includes('earth-tone') || r.includes('earthy') || r.includes('organic') || r.includes('anchors')));
});

test('COLOR: Favorite-color ranking boosts score and is reflected in output', () => {
  const top1 = { id: 't1', name: 'Olive Tee', color: 'Olive', category: 'Top' };
  const top2 = { id: 't2', name: 'Red Tee', color: 'Red', category: 'Top' };
  const bot = { id: 'b1', name: 'Black Jeans', color: 'Black', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Black Boots', color: 'Black', category: 'Shoes' };

  const withFav = evaluateEnsembleColorCoordination(top1, bot, shoe, null, { favorite_colors: ['Olive'] });
  const withoutFav = evaluateEnsembleColorCoordination(top1, bot, shoe, null, {});

  assert.ok(withFav.score > withoutFav.score, 'Favorite color must boost score');
  assert.ok(withFav.reasons.some(r => r.includes('preferred color palette')));
});

test('COLOR: Disliked-color soft penalty lowers ranking', () => {
  const top = { id: 't1', name: 'Yellow Tee', color: 'Yellow', category: 'Top' };
  const bot = { id: 'b1', name: 'Black Jeans', color: 'Black', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Black Boots', color: 'Black', category: 'Shoes' };

  const neutralPref = evaluateEnsembleColorCoordination(top, bot, shoe, null, {});
  const dislikedPref = evaluateEnsembleColorCoordination(top, bot, shoe, null, { disliked_colors: ['Yellow'] });

  assert.ok(dislikedPref.score < neutralPref.score, 'Disliked color must lower score');
  assert.equal(dislikedPref.valid, true, 'Disliked color is not hard-excluded by default');
});

test('COLOR: Strict disliked-color exclusion rejects outfit', () => {
  const top = { id: 't1', name: 'Yellow Tee', color: 'Yellow', category: 'Top' };
  const bot = { id: 'b1', name: 'Black Jeans', color: 'Black', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Black Boots', color: 'Black', category: 'Shoes' };

  const strictDisliked = evaluateEnsembleColorCoordination(top, bot, shoe, null, {
    disliked_colors: ['Yellow'],
    strict_color_exclusion: true
  });

  assert.equal(strictDisliked.valid, false);
  assert.match(strictDisliked.reason, /Excluded disliked color/);
});

test('COLOR: Patterned garments evaluate secondary color harmony with bottom', () => {
  const topStriped = {
    id: 't-str',
    name: 'Breton Tee',
    color: 'Navy',
    secondary_color: 'White',
    pattern: 'Striped',
    category: 'Top'
  };
  const botWhite = { id: 'b1', name: 'White Jeans', color: 'White', category: 'Bottom' };
  const shoeWhite = { id: 's1', name: 'White Shoes', color: 'White', category: 'Shoes' };

  const res = evaluateEnsembleColorCoordination(topStriped, botWhite, shoeWhite);
  assert.equal(res.valid, true);
  assert.ok(res.reasons.some(r => r.includes('secondary accents') || r.includes('Striped') || r.includes('striped')));
});

test('COLOR: Unknown or custom color names normalize gracefully without crashing', () => {
  const normalized = normalizeColor('  Electric Ultramarine  ');
  assert.equal(typeof normalized, 'string');
  assert.equal(normalized, 'electric ultramarine');

  const topCustom = { id: 't-c', name: 'Custom Shirt', color: 'Electric Ultramarine', category: 'Top' };
  const bot = { id: 'b1', name: 'Black Jeans', color: 'Black', category: 'Bottom' };
  const shoe = { id: 's1', name: 'Black Shoes', color: 'Black', category: 'Shoes' };

  const res = evaluateEnsembleColorCoordination(topCustom, bot, shoe);
  assert.equal(res.valid, true);
  assert.ok(res.score > 0);
});

// =============================================================================
// WEATHER & TEMPERATURE TESTS
// =============================================================================

test('WEATHER: Hot weather penalizes heavy winter layers and rewards breathable fabrics', () => {
  const heavyJacket = {
    name: 'Heavy Shearling Parka',
    category: 'Top',
    sub_category: 'Parka',
    weather_suitability: 'Cold',
    fabric: 'Wool and Shearling'
  };
  const linenShirt = {
    name: 'Breezy Linen Shirt',
    category: 'Top',
    sub_category: 'Shirt',
    weather_suitability: 'Hot',
    fabric: 'Pure Washed Linen'
  };

  const hotParka = evaluateWeatherSuitability(heavyJacket, 'Hot');
  const hotLinen = evaluateWeatherSuitability(linenShirt, 'Hot');

  assert.equal(hotParka.valid, false, 'Heavy parka must be invalid for hot weather');
  assert.equal(hotLinen.valid, true, 'Linen shirt must be valid for hot weather');
  assert.ok(hotLinen.score >= 85);
});

test('WEATHER: Cold weather favors suitable warm layers and disallows shorts', () => {
  const shorts = {
    name: 'Tailored Linen Shorts',
    category: 'Bottom',
    sub_category: 'Shorts',
    weather_suitability: 'Hot',
    fabric: 'Linen'
  };
  const woolTrousers = {
    name: 'Flannel Wool Trousers',
    category: 'Bottom',
    sub_category: 'Trousers',
    weather_suitability: 'Cold',
    fabric: 'Flannel Wool'
  };

  const coldShorts = evaluateWeatherSuitability(shorts, 'Cold');
  const coldTrousers = evaluateWeatherSuitability(woolTrousers, 'Cold');

  assert.equal(coldShorts.valid, false, 'Shorts must be rejected in cold weather');
  assert.equal(coldTrousers.valid, true, 'Flannel wool trousers must be valid in cold weather');
  assert.ok(coldTrousers.score >= 85);
});

test('WEATHER: Rainy weather prioritizes verified water-resistant garments and excludes suede/sandals', () => {
  const suedeShoes = {
    name: 'Brown Suede Loafers',
    category: 'Shoes',
    sub_category: 'Loafers',
    color: 'Brown',
    fabric: 'Suede',
    weather_suitability: 'All Weather'
  };
  const sandals = {
    name: 'Leather Slide Sandals',
    category: 'Shoes',
    sub_category: 'Sandals',
    color: 'Black',
    weather_suitability: 'Hot'
  };
  const waterproofBoots = {
    name: 'Lugged Waterproof Chelsea Boots',
    category: 'Shoes',
    sub_category: 'Boots',
    color: 'Black',
    fabric: 'Waxed Leather with Rubber Lug Sole',
    waterproof_status: 'Waterproof',
    weather_suitability: 'Rainy',
    notes: 'Waterproof sealed construction for heavy precipitation'
  };

  const rainSuede = evaluateWeatherSuitability(suedeShoes, 'Rainy');
  const rainSandals = evaluateWeatherSuitability(sandals, 'Rainy');
  const rainBoots = evaluateWeatherSuitability(waterproofBoots, 'Rainy');

  assert.equal(rainSuede.valid, false, 'Suede must be excluded in rainy weather');
  assert.equal(rainSandals.valid, false, 'Sandals must be excluded in rainy weather');
  assert.equal(rainBoots.valid, true, 'Waterproof boots must be valid');
  assert.ok(rainBoots.score >= 90, `Expected waterproof bonus, got ${rainBoots.score}`);
});

test('WEATHER: Unknown waterproof status is NOT considered waterproof', () => {
  const genericShoes = {
    name: 'Standard Derby Shoe',
    category: 'Shoes',
    sub_category: 'Derby',
    color: 'Black',
    fabric: 'Smooth Leather',
    waterproof_status: 'Unknown',
    weather_suitability: 'All Weather'
  };

  const rainGeneric = evaluateWeatherSuitability(genericShoes, 'Rainy');
  assert.equal(rainGeneric.valid, true);
  // Must NOT receive the 90+ verified waterproof score
  assert.ok(rainGeneric.score < 80, `Non-waterproof shoe should not get waterproof bonus, got ${rainGeneric.score}`);
});

// =============================================================================
// OCCASION & DRESS CODE TESTS
// =============================================================================

test('OCCASION: Formal rejects inappropriate casual items (T-shirt, shorts, sneakers)', () => {
  const tShirt = { name: 'Graphic Tee', sub_category: 'T-shirt', occasion: 'Casual' };
  const shorts = { name: 'Cargo Shorts', sub_category: 'Shorts', occasion: 'Casual' };
  const sneakers = { name: 'Running Sneakers', sub_category: 'Running Shoes', occasion: 'Casual' };

  const dressShirt = { name: 'Tuxedo Shirt', sub_category: 'Dress Shirt', occasion: 'Formal' };
  const trousers = { name: 'Wool Trousers', sub_category: 'Trousers', occasion: 'Formal' };
  const oxfords = { name: 'Patent Oxfords', sub_category: 'Oxfords', occasion: 'Formal' };

  const formalCasual = evaluateOccasionFormality(tShirt, shorts, sneakers, 'Formal');
  const formalReal = evaluateOccasionFormality(dressShirt, trousers, oxfords, 'Formal');

  assert.equal(formalCasual.valid, false, 'Casual items must be rejected for formal occasions');
  assert.equal(formalReal.valid, true, 'Formal ensemble must be valid');
  assert.ok(formalReal.score >= 90);
});

test('OCCASION: Sports favors activewear and rejects stiff dress shoes', () => {
  const athleticTee = { name: 'Tech Tee', sub_category: 'T-shirt', occasion: 'Sports/Active' };
  const joggers = { name: 'Performance Track Pants', sub_category: 'Track Pants', occasion: 'Sports/Active' };
  const dressShoes = { name: 'Formal Oxfords', sub_category: 'Formal Shoes', occasion: 'Formal' };
  const runners = { name: 'Trail Runners', sub_category: 'Running Shoes', occasion: 'Sports/Active' };

  const sportsWithDressShoes = evaluateOccasionFormality(athleticTee, joggers, dressShoes, 'Sports');
  const sportsWithRunners = evaluateOccasionFormality(athleticTee, joggers, runners, 'Sports');

  assert.equal(sportsWithDressShoes.valid, false, 'Formal shoes must be rejected for sports');
  assert.equal(sportsWithRunners.valid, true, 'Runners with joggers must be valid for sports');
  assert.ok(sportsWithRunners.score >= 90);
});

test('OCCASION: Traditional favors properly categorized ethnic garments and rejects athletic shoes', () => {
  const kurta = { name: 'Embroidered Silk Kurta', sub_category: 'Kurta', occasion: 'Traditional/Ethnic' };
  const churidar = { name: 'Silk Churidar', sub_category: 'Churidar', occasion: 'Traditional/Ethnic' };
  const juttis = { name: 'Handcrafted Juttis', sub_category: 'Juttis', occasion: 'Traditional/Ethnic' };
  const gymShoes = { name: 'Neon Gym Sneakers', sub_category: 'Running Shoes', occasion: 'Casual' };

  const tradGood = evaluateOccasionFormality(kurta, churidar, juttis, 'Traditional/Ethnic');
  const tradClash = evaluateOccasionFormality(kurta, churidar, gymShoes, 'Traditional/Ethnic');

  assert.equal(tradGood.valid, true);
  assert.ok(tradGood.score >= 90);
  assert.equal(tradClash.valid, false, 'Gym sneakers must clash with traditional ethnic attire');
});

// =============================================================================
// PERSONALIZATION: GENDER PRESENTATION, FIT & STYLE
// =============================================================================

test('PERSONALIZATION: Gender filtering is neutralized so all wardrobe garments are eligible without gender barriers', () => {
  const unisexItem = { name: 'Classic Poplin Shirt', gender_presentation: 'Unisex' };
  const mensItem = { name: 'Double Breasted Blazer', gender_presentation: "Men's" };
  const womensItem = { name: 'Silk Slip Dress', gender_presentation: "Women's" };

  // All garments are eligible without gender bias or friction
  assert.equal(evaluateGenderPresentation(unisexItem).eligible, true);
  assert.equal(evaluateGenderPresentation(mensItem).eligible, true);
  assert.equal(evaluateGenderPresentation(womensItem).eligible, true);
});

test('PERSONALIZATION: Fit preferences boost garments matching requested silhouette', () => {
  const relaxedTop = { silhouette: 'Boxy Relaxed with Dropped Shoulders' };
  const relaxedBot = { silhouette: 'Relaxed Wide-Leg Tailored Trousers' };
  const slimTop = { silhouette: 'Tailored Slim-Fit' };
  const slimBot = { silhouette: 'Clean Ergonomic Slim Fit' };

  const relaxedMatch = evaluateFitAndSilhouette(relaxedTop, relaxedBot, 'Relaxed');
  const slimMismatch = evaluateFitAndSilhouette(slimTop, slimBot, 'Relaxed');

  assert.ok(relaxedMatch.score > slimMismatch.score, 'Matching fit preference must boost score');
  assert.ok(relaxedMatch.notes.some(n => n.includes('Relaxed')));
});

test('PERSONALIZATION: Style preferences boost items matching user archetype', () => {
  const minimalTop = { name: 'Crewneck Tee', style: 'Minimalist Luxury', color: 'White' };
  const minimalBot = { name: 'Pleated Trousers', style: 'Minimalist Luxury', color: 'Charcoal' };
  const minimalShoe = { name: 'Leather Sneakers', style: 'Minimalist', color: 'White' };

  const resMinimal = evaluatePersonalStyle(minimalTop, minimalBot, minimalShoe, null, 'Minimalist', {
    preferred_styles: ['Minimalist']
  });

  assert.ok(resMinimal.score >= 85);
  assert.ok(resMinimal.matchedStyles.includes('minimalist'));
});

// =============================================================================
// OUTFIT COMPOSITION & DIVERSITY
// =============================================================================

test('COMPOSITION: Generates complete outfit with top, bottom, shoes and optional accessory', () => {
  const items = [
    { id: 'top-1', name: 'Navy Shirt', category: 'Top', sub_category: 'Shirt', color: 'Navy', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'bot-1', name: 'Beige Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Beige', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'sho-1', name: 'Brown Loafers', category: 'Shoes', sub_category: 'Loafers', color: 'Brown', weather_suitability: 'All Weather', occasion: 'Casual' },
    { id: 'acc-1', name: 'Brown Leather Belt', category: 'Accessories', sub_category: 'Belt', color: 'Brown', fabric: 'Leather', weather_suitability: 'All Weather', occasion: 'Casual' }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Mild',
    occasion: 'Casual'
  });

  assert.equal(res.success, true);
  assert.equal(res.recommendations.length, 1);
  const out = res.recommendations[0];
  assert.equal(out.top.id, 'top-1');
  assert.equal(out.bottom.id, 'bot-1');
  assert.equal(out.shoes.id, 'sho-1');
  assert.equal(out.accessory.id, 'acc-1');
  assert.ok(out.score >= 70 && out.score <= 96);
  assert.ok(out.score_breakdown !== undefined);
  assert.equal(typeof out.score_breakdown.colorHarmony, 'number');
});

test('COMPOSITION: Accessories are NOT forced on every outfit when not additive', () => {
  const items = [
    { id: 'top-1', name: 'Black Minimalist Tee', category: 'Top', sub_category: 'T-shirt', color: 'Black', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'bot-1', name: 'Black Jeans', category: 'Bottom', sub_category: 'Jeans', color: 'Black', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'sho-1', name: 'White Sneakers', category: 'Shoes', sub_category: 'Sneakers', color: 'White', weather_suitability: 'Hot', occasion: 'Casual' },
    // Only a formal winter scarf is in accessories — should NOT be forced onto a hot casual outfit!
    { id: 'acc-heavy', name: 'Heavy Wool Tartan Scarf', category: 'Accessories', sub_category: 'Scarf', color: 'Red', fabric: 'Heavy Wool', weather_suitability: 'Cold', occasion: 'Formal' }
  ];

  const res = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual'
  });

  assert.equal(res.success, true);
  assert.equal(res.recommendations.length, 1);
  // Accessory must be omitted (null)
  assert.equal(res.recommendations[0].accessory, null, 'Incompatible accessory must not be forced onto outfit');
});

test('DIVERSITY: History penalty discourages repeating recently saved outfits', () => {
  const items = [
    { id: 't1', name: 'Navy Shirt', category: 'Top', sub_category: 'Shirt', color: 'Navy', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 't2', name: 'White Shirt', category: 'Top', sub_category: 'Shirt', color: 'White', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'b1', name: 'Beige Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Beige', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 's1', name: 'Brown Shoes', category: 'Shoes', sub_category: 'Loafers', color: 'Brown', weather_suitability: 'Hot', occasion: 'Casual' }
  ];

  // First run without history
  const resFresh = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual'
  });

  // Second run with top outfit in recentSaved
  const topOutfit = resFresh.recommendations[0];
  const resWithHistory = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    recentSaved: [{ top_id: topOutfit.top.id, bottom_id: topOutfit.bottom.id, shoes_id: topOutfit.shoes.id }]
  });

  const matchingInHistory = resWithHistory.recommendations.find(r => r.top.id === topOutfit.top.id);
  assert.ok(matchingInHistory.score < topOutfit.score, 'Recently saved combination must receive score penalty');
});

test('DIVERSITY: alternativeTo skips exact outfit and returns fresh alternative', () => {
  const items = [
    { id: 't1', name: 'Navy Shirt', category: 'Top', sub_category: 'Shirt', color: 'Navy', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 't2', name: 'White Shirt', category: 'Top', sub_category: 'Shirt', color: 'White', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 'b1', name: 'Beige Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Beige', weather_suitability: 'Hot', occasion: 'Casual' },
    { id: 's1', name: 'Brown Shoes', category: 'Shoes', sub_category: 'Loafers', color: 'Brown', weather_suitability: 'Hot', occasion: 'Casual' }
  ];

  const res1 = generateOutfitRecommendations({ items, weather: 'Hot', occasion: 'Casual' });
  const firstId = res1.recommendations[0].id;

  const resAlt = generateOutfitRecommendations({
    items,
    weather: 'Hot',
    occasion: 'Casual',
    alternativeTo: firstId
  });

  assert.ok(resAlt.recommendations.every(r => r.id !== firstId), 'alternativeTo must exclude the specified outfit ID');
});

// =============================================================================
// EXPLANATIONS REFLECT UNDERLYING DATA
// =============================================================================

test('EXPLANATIONS: Reflects actual garment names, colors, weather and occasion', () => {
  const items = [
    { id: 't1', name: 'Emerald Oxford Shirt', category: 'Top', sub_category: 'Shirt', color: 'Green', fabric: 'Oxford Cotton', weather_suitability: 'Hot', occasion: 'Smart Casual' },
    { id: 'b1', name: 'Khaki Commuter Chinos', category: 'Bottom', sub_category: 'Chinos', color: 'Khaki', fabric: 'Stretch Cotton', weather_suitability: 'Hot', occasion: 'Smart Casual' },
    { id: 's1', name: 'Penny Loafers', category: 'Shoes', sub_category: 'Loafers', color: 'Brown', fabric: 'Full Grain Leather', weather_suitability: 'Hot', occasion: 'Smart Casual' }
  ];

  const res = generateOutfitRecommendations({ items, weather: 'Hot', occasion: 'Smart Casual' });
  assert.equal(res.success, true);
  const expl = res.recommendations[0].explanation;

  assert.ok(expl.toLowerCase().includes('green') || expl.toLowerCase().includes('khaki') || expl.toLowerCase().includes('brown') || expl.toLowerCase().includes('earth-tone'));
  assert.ok(expl.toLowerCase().includes('hot') || expl.toLowerCase().includes('cooling') || expl.toLowerCase().includes('airflow') || expl.toLowerCase().includes('breathable'));
  assert.ok(expl.toLowerCase().includes('smart casual'));
});
