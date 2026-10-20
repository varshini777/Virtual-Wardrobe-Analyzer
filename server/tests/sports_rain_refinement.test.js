import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateWeatherSuitability,
  evaluateOccasionFormality,
  generateAccurateExplanation,
  generateOutfitRecommendations
} from '../src/services/recommender.js';
import { CURATED_WARDROBE } from '../src/data/curatedWardrobe.js';

test('SPORTS & RAIN REFINEMENT TEST SUITE', async (suite) => {

  await suite.test('1. Athletic shorts versus tailored linen shorts for Sports / Active', () => {
    const athleticTrailShorts = CURATED_WARDROBE.find(i => i.id === 'bot-034'); // Fast-Drying Nylon Trail Shorts
    const tailoredLinenShorts = CURATED_WARDROBE.find(i => i.id === 'bot-033'); // Tailored Linen Bermuda Shorts
    const athleticTee = CURATED_WARDROBE.find(i => i.id === 'top-006'); // Technical Micro-Mesh Cotton Tee
    const trainer = CURATED_WARDROBE.find(i => i.id === 'sho-004'); // Trail Runner

    assert.ok(athleticTrailShorts, 'Athletic trail shorts should exist in catalog');
    assert.ok(tailoredLinenShorts, 'Tailored linen shorts should exist in catalog');

    // Tailored linen shorts must NOT be accepted for Sports / Active
    const linenRes = evaluateOccasionFormality(athleticTee, tailoredLinenShorts, trainer, 'Sports / Active');
    assert.equal(linenRes.valid, false, 'Tailored linen bermuda shorts must be excluded from Sports / Active');
    assert.match(linenRes.reason, /tailored.*shorts.*not suitable/i);

    // Athletic trail shorts must be accepted with high suitability
    const athleticRes = evaluateOccasionFormality(athleticTee, athleticTrailShorts, trainer, 'Sports / Active');
    assert.equal(athleticRes.valid, true, 'Athletic trail shorts must be accepted for Sports / Active');
    assert.ok(athleticRes.score >= 85, 'Athletic shorts should score high in Sports occasion');
  });

  await suite.test('2. Track pants versus formal trousers for Sports / Active', () => {
    const trackPants = CURATED_WARDROBE.find(i => i.id === 'bot-016'); // Side-Snap Track Pants
    const formalTrousers = CURATED_WARDROBE.find(i => i.id === 'bot-001'); // Double-Pleated Tailored Trousers
    const athleticTee = CURATED_WARDROBE.find(i => i.id === 'top-010'); // Raglan Baseball Henley
    const trainer = CURATED_WARDROBE.find(i => i.id === 'sho-007'); // Seamless Knit Sock Runner

    assert.ok(trackPants, 'Track pants should exist');
    assert.ok(formalTrousers, 'Formal trousers should exist');

    // Formal trousers must be rejected
    const formalRes = evaluateOccasionFormality(athleticTee, formalTrousers, trainer, 'Sports / Active');
    assert.equal(formalRes.valid, false, 'Formal trousers must be rejected for Sports / Active');
    assert.match(formalRes.reason, /formal trousers.*not suitable/i);

    // Track pants must be accepted
    const trackRes = evaluateOccasionFormality(athleticTee, trackPants, trainer, 'Sports / Active');
    assert.equal(trackRes.valid, true, 'Track pants must be valid for Sports / Active');
    assert.ok(trackRes.score >= 85);
  });

  await suite.test('3. Athletic trainers versus formal footwear for Sports / Active', () => {
    const athleticTee = CURATED_WARDROBE.find(i => i.id === 'top-006');
    const runningShorts = CURATED_WARDROBE.find(i => i.id === 'bot-042'); // Dolphin Running Shorts
    const trainer = CURATED_WARDROBE.find(i => i.id === 'sho-004'); // Trail Runner
    const formalOxford = CURATED_WARDROBE.find(i => i.id === 'sho-023'); // Cap-Toe Oxford
    const deckShoe = CURATED_WARDROBE.find(i => i.id === 'sho-005'); // Canvas Deck Shoe

    // Formal dress shoes must be rejected
    const formalShoeRes = evaluateOccasionFormality(athleticTee, runningShorts, formalOxford, 'Sports / Active');
    assert.equal(formalShoeRes.valid, false, 'Formal oxfords must be rejected for Sports');

    // Deck shoes must be rejected for Sports
    const deckRes = evaluateOccasionFormality(athleticTee, runningShorts, deckShoe, 'Sports / Active');
    assert.equal(deckRes.valid, false, 'Canvas deck shoes are casual lifestyle shoes, not athletic footwear');

    // Dedicated athletic trainer must be accepted with high performance bonus
    const trainerRes = evaluateOccasionFormality(athleticTee, runningShorts, trainer, 'Sports / Active');
    assert.equal(trainerRes.valid, true);
    assert.ok(trainerRes.score >= 90, 'Athletic trainer should receive high occasion formality score');
  });

  await suite.test('4. Rainy-weather canvas footwear receives suitability penalty and honest warning', () => {
    const canvasDeck = CURATED_WARDROBE.find(i => i.id === 'sho-005'); // Slip-On Canvas Deck Shoes
    const rubberDuckBoot = CURATED_WARDROBE.find(i => i.id === 'sho-021'); // Weatherproof Rubber Duck Boots

    const canvasEval = evaluateWeatherSuitability(canvasDeck, 'Rainy');
    const bootEval = evaluateWeatherSuitability(rubberDuckBoot, 'Rainy');

    assert.equal(canvasEval.valid, true, 'Canvas deck shoes remain enclosed and valid as a last resort');
    assert.ok(canvasEval.score <= 45, `Canvas shoes must receive a strong rainy penalty, got ${canvasEval.score}`);
    assert.equal(canvasEval.tier, 'canvas');
    assert.match(canvasEval.note, /absorbs moisture/i);

    // Boot evaluation should be Tier 1 with high score
    assert.equal(bootEval.valid, true);
    assert.ok(bootEval.score >= 95, `Duck boots should score 95+, got ${bootEval.score}`);
    assert.equal(bootEval.tier, 'waterproof');

    // When generating explanation for canvas footwear in rain, no false "moisture-resistant" claims
    const dummyTop = CURATED_WARDROBE.find(i => i.id === 'top-001');
    const dummyBottom = CURATED_WARDROBE.find(i => i.id === 'bot-019');
    const explanation = generateAccurateExplanation({
      top: dummyTop,
      bottom: dummyBottom,
      shoes: canvasDeck,
      weather: 'Rainy',
      occasion: 'Casual',
      evalResult: {
        colorRes: { reasons: ['Clean contrast'] },
        shoeWeather: canvasEval,
        topWeather: { note: 'Everyday layer' }
      }
    });

    assert.doesNotMatch(explanation, /moisture-resistant fabrication.*Slip-On Canvas/i);
    assert.match(explanation, /untreated canvas readily absorbs moisture/i);
  });

  await suite.test('5. Verified waterproof footwear ranks higher than water-resistant and leather in rain', () => {
    const rubberDuckBoot = CURATED_WARDROBE.find(i => i.id === 'sho-021'); // Tier 1: Waterproof (96)
    const trailRunner = CURATED_WARDROBE.find(i => i.id === 'sho-004'); // Tier 2: Water-resistant (86)
    const leatherDerby = CURATED_WARDROBE.find(i => i.id === 'sho-024'); // Tier 3: Enclosed leather (68)
    const canvasDeck = CURATED_WARDROBE.find(i => i.id === 'sho-005'); // Tier 4: Canvas (42)

    const bootScore = evaluateWeatherSuitability(rubberDuckBoot, 'Rainy').score;
    const runnerScore = evaluateWeatherSuitability(trailRunner, 'Rainy').score;
    const derbyScore = evaluateWeatherSuitability(leatherDerby, 'Rainy').score;
    const canvasScore = evaluateWeatherSuitability(canvasDeck, 'Rainy').score;

    assert.ok(bootScore > runnerScore, `Waterproof (${bootScore}) must outrank water-resistant (${runnerScore})`);
    assert.ok(runnerScore > derbyScore, `Water-resistant (${runnerScore}) must outrank untreated leather (${derbyScore})`);
    assert.ok(derbyScore > canvasScore, `Untreated leather (${derbyScore}) must outrank canvas (${canvasScore})`);
  });

  await suite.test('6. Unknown waterproof status is not assumed waterproof', () => {
    const genericItem = {
      id: 'gen-001',
      name: 'Generic Leather Sneaker',
      category: 'Shoes',
      sub_category: 'Sneakers',
      color: 'Brown',
      fabric: 'Smooth Cowhide',
      notes: 'Standard casual sneaker'
    };

    const res = evaluateWeatherSuitability(genericItem, 'Rainy');
    assert.equal(res.valid, true);
    assert.equal(res.tier, 'leather_enclosed');
    assert.notEqual(res.tier, 'waterproof', 'Unknown status must never be assumed waterproof');
    assert.ok(res.score < 80, `Score without verified water-resistance should be conservative (<80), got ${res.score}`);
  });

  await suite.test('7. White leather footwear receives sensible splash penalty without blanket exclusion', () => {
    const whiteLeatherSneaker = CURATED_WARDROBE.find(i => i.id === 'sho-001'); // Minimalist Clean Calfskin Sneaker (White)
    assert.ok(whiteLeatherSneaker);

    const res = evaluateWeatherSuitability(whiteLeatherSneaker, 'Rainy');
    assert.equal(res.valid, true, 'White leather sneaker must NOT be blanket-excluded in rain');
    assert.equal(res.tier, 'leather_enclosed');
    assert.equal(res.score, 56, 'Should receive sensible splash penalty (68 - 12 = 56)');
    assert.match(res.note, /puddle splash/i);
  });

  await suite.test('8. Wardrobe with no suitable athletic garments returns honest limitation message', () => {
    // Closet with only formal shirts, tailored trousers, and dress shoes
    const formalWardrobe = [
      CURATED_WARDROBE.find(i => i.id === 'top-019'), // Tuxedo shirt
      CURATED_WARDROBE.find(i => i.id === 'top-023'), // Banker shirt
      CURATED_WARDROBE.find(i => i.id === 'bot-001'), // Double-pleated trousers
      CURATED_WARDROBE.find(i => i.id === 'bot-008'), // Satin dress pants
      CURATED_WARDROBE.find(i => i.id === 'sho-023'), // Oxford shoes
      CURATED_WARDROBE.find(i => i.id === 'sho-027')  // Wholecut oxford
    ];

    const res = generateOutfitRecommendations({
      items: formalWardrobe,
      weather: 'Hot',
      occasion: 'Sports / Active'
    });

    assert.equal(res.success, true);
    assert.equal(res.recommendations.length, 0, 'No recommendations should be made with zero athletic items');
    assert.match(res.message, /no dedicated athletic bottoms.*or athletic trainers were found/i);
  });

  await suite.test('9. Wardrobe with no rain-suitable footwear returns honest limitation message', () => {
    // Closet with only sandals and untreated suede shoes
    const vulnerableWardrobe = [
      CURATED_WARDROBE.find(i => i.id === 'top-001'),
      CURATED_WARDROBE.find(i => i.id === 'bot-019'),
      CURATED_WARDROBE.find(i => i.id === 'sho-029'), // Fisherman Sandals
      CURATED_WARDROBE.find(i => i.id === 'sho-030'), // Cork Slides
      CURATED_WARDROBE.find(i => i.id === 'sho-002'), // Suede Runner
      CURATED_WARDROBE.find(i => i.id === 'sho-018')  // Suede Chukka Boots
    ];

    const res = generateOutfitRecommendations({
      items: vulnerableWardrobe,
      weather: 'Rainy',
      occasion: 'Casual'
    });

    assert.equal(res.success, true);
    assert.equal(res.recommendations.length, 0, 'No recommendations should be made when only sandals/suede are available');
    assert.match(res.message, /no rain-appropriate or water-resistant footwear was found/i);
  });

  await suite.test('10. End-to-end: Hot + Sports / Active recommends genuine athletic items', () => {
    const res = generateOutfitRecommendations({
      items: CURATED_WARDROBE,
      weather: 'Hot',
      occasion: 'Sports / Active',
      maxRecommendations: 5
    });

    assert.equal(res.success, true);
    assert.ok(res.recommendations.length >= 3, 'Should recommend active outfits');

    for (const outfit of res.recommendations) {
      // Must not be tailored linen shorts or dress shoes
      assert.notEqual(outfit.bottom.id, 'bot-033', 'Tailored Linen Bermuda Shorts must never be recommended for Sports');
      assert.notEqual(outfit.bottom.id, 'bot-035', 'Double-Pleated Chino Shorts must never be recommended for Sports');
      assert.notEqual(outfit.bottom.id, 'bot-038', 'Gurkha Shorts must never be recommended for Sports');
      assert.notEqual(outfit.shoes.id, 'sho-005', 'Canvas Deck Shoes must never be recommended for Sports');

      // Top must be athletic tee/tank/polo
      const topSub = (outfit.top.sub_category || '').toLowerCase();
      assert.ok(['t-shirt', 'tee', 'polo', 'tank', 'hoodie'].some(k => topSub.includes(k)));

      // Bottom must be athletic
      const botText = (outfit.bottom.name + ' ' + (outfit.bottom.style || '')).toLowerCase();
      assert.ok(botText.includes('trail') || botText.includes('running') || botText.includes('basketball') || botText.includes('terry') || botText.includes('track'));

      // Shoes must be athletic
      const shoText = (outfit.shoes.name + ' ' + (outfit.shoes.style || '')).toLowerCase();
      assert.ok(shoText.includes('runner') || shoText.includes('trail') || shoText.includes('court') || shoText.includes('athletic') || shoText.includes('sneaker'));

      // Explanation must cite athletic mobility
      assert.match(outfit.explanation, /unrestricted mobility for physical activity/i);
    }
  });

  await suite.test('11. End-to-end: Rainy + Casual prefers waterproof rubber duck boots over canvas', () => {
    const res = generateOutfitRecommendations({
      items: CURATED_WARDROBE,
      weather: 'Rainy',
      occasion: 'Casual',
      maxRecommendations: 5
    });

    assert.equal(res.success, true);
    assert.ok(res.recommendations.length > 0);

    // Duck boots should be top recommended footwear
    const topOutfit = res.recommendations[0];
    assert.equal(topOutfit.shoes.id, 'sho-021', 'Weatherproof Rubber Duck Boots should rank #1 for Rainy + Casual');
    assert.match(topOutfit.explanation, /verified waterproof Weatherproof Rubber Duck Boots/i);
  });

});
