/**
 * Rule-Based Outfit Recommendation Engine
 * Evaluates clothing combinations (Top + Bottom + Shoes + optional Accessory)
 * based on weather suitability, occasion formality, color harmony, and user preferences.
 */

// Color classification
const NEUTRAL_COLORS = new Set([
  'white', 'black', 'grey', 'gray', 'navy', 'beige', 'khaki', 'brown', 'cream', 'tan', 'charcoal', 'off-white'
]);

// Classic harmonious pairs (bidirectional)
const COLOR_HARMONY_PAIRS = [
  ['navy', 'white'],
  ['navy', 'beige'],
  ['navy', 'brown'],
  ['navy', 'tan'],
  ['navy', 'grey'],
  ['white', 'blue'],
  ['white', 'black'],
  ['white', 'beige'],
  ['white', 'olive'],
  ['white', 'grey'],
  ['black', 'grey'],
  ['black', 'white'],
  ['black', 'beige'],
  ['black', 'olive'],
  ['black', 'burgundy'],
  ['olive', 'beige'],
  ['olive', 'white'],
  ['olive', 'black'],
  ['olive', 'navy'],
  ['burgundy', 'grey'],
  ['burgundy', 'navy'],
  ['burgundy', 'black'],
  ['burgundy', 'white'],
  ['blue', 'brown'],
  ['blue', 'tan'],
  ['blue', 'beige'],
  ['pink', 'white'],
  ['pink', 'grey'],
  ['pink', 'navy']
];

function normalizeColor(color) {
  if (!color) return 'unknown';
  const c = color.trim().toLowerCase();
  if (c === 'dark blue' || c === 'indigo') return 'navy';
  if (c === 'light blue' || c === 'denim') return 'blue';
  if (c === 'maroon') return 'burgundy';
  if (c === 'gray') return 'grey';
  if (c === 'off-white' || c === 'ivory') return 'white';
  return c;
}

function areColorsHarmonious(c1, c2) {
  const norm1 = normalizeColor(c1);
  const norm2 = normalizeColor(c2);

  if (norm1 === norm2) return true; // Monochromatic

  for (const [p1, p2] of COLOR_HARMONY_PAIRS) {
    if ((norm1 === p1 && norm2 === p2) || (norm1 === p2 && norm2 === p1)) {
      return true;
    }
  }

  // Both neutrals are almost always harmonious
  if (NEUTRAL_COLORS.has(norm1) && NEUTRAL_COLORS.has(norm2)) {
    return true;
  }

  return false;
}

function checkClashingColors(c1, c2) {
  const norm1 = normalizeColor(c1);
  const norm2 = normalizeColor(c2);

  // Red + Green holiday clash
  if ((norm1 === 'red' && norm2 === 'green') || (norm1 === 'green' && norm2 === 'red')) {
    return true;
  }

  // Harsh clashing bright colors without neutral anchor
  const brights = ['yellow', 'orange', 'purple', 'neon'];
  if (brights.includes(norm1) && brights.includes(norm2) && norm1 !== norm2) {
    return true;
  }

  return false;
}

/**
 * Checks if wardrobe has the required base items
 */
export function checkWardrobeCompleteness(items) {
  const tops = items.filter(i => i.category.toLowerCase() === 'top');
  const bottoms = items.filter(i => i.category.toLowerCase() === 'bottom');
  const shoes = items.filter(i => i.category.toLowerCase() === 'shoes');
  const accessories = items.filter(i => i.category.toLowerCase() === 'accessories');

  const missingCategories = [];
  if (tops.length === 0) missingCategories.push('Top');
  if (bottoms.length === 0) missingCategories.push('Bottom');
  if (shoes.length === 0) missingCategories.push('Shoes');

  const canGenerate = missingCategories.length === 0;
  let message = '';

  if (!canGenerate) {
    message = `You need at least 1 Top, 1 Bottom, and 1 pair of Shoes to generate outfits. Currently missing: ${missingCategories.join(', ')}.`;
  } else {
    message = `Wardrobe is complete with ${tops.length} Tops, ${bottoms.length} Bottoms, ${shoes.length} Shoes, and ${accessories.length} Accessories.`;
  }

  return {
    canGenerate,
    missingCategories,
    message,
    counts: {
      tops: tops.length,
      bottoms: bottoms.length,
      shoes: shoes.length,
      accessories: accessories.length,
      total: items.length
    }
  };
}

/**
 * Check weather suitability of an individual item
 */
function evaluateWeatherSuitability(item, targetWeather) {
  const weather = (targetWeather || 'Hot').toLowerCase();
  const itemWeather = (item.weather_suitability || 'All Weather').toLowerCase();
  const subCategory = (item.sub_category || '').toLowerCase();

  // Explicit incompatible overrides
  if (weather === 'hot') {
    if (itemWeather === 'cold' || itemWeather === 'rainy') return { valid: false, reason: 'Unsuitable for hot weather' };
    if (['sweater', 'hoodie', 'heavy jacket', 'thermal', 'heavy coat'].includes(subCategory) && itemWeather !== 'hot') {
      return { valid: false, reason: 'Heavy knitwear is uncomfortable in hot weather' };
    }
    if (['heavy boots', 'snow boots', 'winter boots'].includes(subCategory)) {
      return { valid: false, reason: 'Winter boots too warm for hot weather' };
    }
    // Boost for hot weather items
    if (itemWeather === 'hot' || ['t-shirt', 'shorts', 'sandals', 'linen shirt', 'polo'].includes(subCategory)) {
      return { valid: true, score: 25, note: 'Lightweight & breathable for hot weather' };
    }
    return { valid: true, score: 10, note: 'Passable for hot weather' };
  }

  if (weather === 'cold') {
    if (itemWeather === 'hot') return { valid: false, reason: 'Too light for cold weather' };
    if (['shorts', 'sandals', 'flip flops', 'tank top', 'sleeveless'].includes(subCategory)) {
      return { valid: false, reason: 'Exposes skin to cold temperatures' };
    }
    if (itemWeather === 'cold' || ['sweater', 'hoodie', 'jacket', 'boots', 'jeans', 'trousers', 'scarf'].includes(subCategory)) {
      return { valid: true, score: 25, note: 'Provides comfortable insulation for cold weather' };
    }
    return { valid: true, score: 10, note: 'Passable for cold weather' };
  }

  if (weather === 'rainy') {
    if (itemWeather === 'hot') {
      return { valid: false, reason: 'Hot-weather garment unsuitable for wet conditions' };
    }
    // In rain, avoid sandals, flip-flops, and easily-stained white shoes
    if (item.category.toLowerCase() === 'shoes') {
      if (['sandals', 'flip flops', 'canvas sneakers'].includes(subCategory) || subCategory.includes('sandals')) {
        return { valid: false, reason: 'Easily soaked or ruined in the rain' };
      }
      if (item.color.toLowerCase() === 'white') {
        return { valid: false, reason: 'White footwear easily stains in wet, muddy conditions' };
      }
    }
    if (itemWeather === 'rainy' || ['boots', 'leather shoes', 'waterproof boots'].includes(subCategory)) {
      return { valid: true, score: 35, note: 'Water-resistant protection for wet streets' };
    }
    if (itemWeather === 'all weather') {
      return { valid: true, score: 10, note: 'Versatile in rain' };
    }
    return { valid: true, score: 6, note: 'Acceptable for rainy conditions' };
  }

  return { valid: true, score: 10, note: 'Versatile for current weather' };
}

/**
 * Check occasion appropriateness
 */
function evaluateOccasionFormality(top, bottom, shoes, targetOccasion) {
  const occasion = (targetOccasion || 'Casual').toLowerCase();

  const topSub = (top.sub_category || '').toLowerCase();
  const botSub = (bottom.sub_category || '').toLowerCase();
  const shoSub = (shoes.sub_category || '').toLowerCase();

  const topOccasion = (top.occasion || 'All Occasions').toLowerCase();
  const botOccasion = (bottom.occasion || 'All Occasions').toLowerCase();
  const shoOccasion = (shoes.occasion || 'All Occasions').toLowerCase();

  // Incompatible combo rules regardless of occasion
  if (['shorts'].includes(botSub) && ['formal shoes', 'oxford', 'oxfords'].includes(shoSub)) {
    return { valid: false, reason: 'Formal dress shoes clash heavily with casual shorts' };
  }
  if (['t-shirt', 'hoodie'].includes(topSub) && ['formal shoes', 'oxford'].includes(shoSub) && occasion === 'formal') {
    return { valid: false, reason: 'Casual tee/hoodie conflicts with formal footwear' };
  }

  if (occasion === 'formal') {
    // Stricter requirements: No shorts, hoodies, graphic t-shirts, athletic sneakers, sandals
    if (['shorts'].includes(botSub)) return { valid: false, reason: 'Shorts are inappropriate for formal occasions' };
    if (['t-shirt', 'hoodie'].includes(topSub) && topOccasion !== 'formal') {
      return { valid: false, reason: 'T-shirts and hoodies are too casual for formal events' };
    }
    if (['sandals', 'flip flops', 'athletic sneakers'].includes(shoSub)) {
      return { valid: false, reason: 'Casual shoes do not meet formal dress codes' };
    }

    let score = 15;
    if (['shirt', 'blazer', 'formal top'].includes(topSub) || topOccasion === 'formal') score += 10;
    if (['trousers', 'suit pants'].includes(botSub) || botOccasion === 'formal') score += 10;
    if (['formal shoes', 'loafers', 'oxfords', 'derbies'].includes(shoSub) || shoOccasion === 'formal') score += 10;
    return { valid: true, score, note: 'Elegant and tailored for formal occasions' };
  }

  if (occasion === 'work') {
    // Smart casual / business casual
    if (['shorts'].includes(botSub)) {
      return { valid: false, reason: 'Shorts are typically unsuitable for professional office work' };
    }
    if (['sandals', 'flip flops'].includes(shoSub)) {
      return { valid: false, reason: 'Open-toe sandals are inappropriate for workplace standards' };
    }

    let score = 15;
    if (['shirt', 'polo', 'sweater'].includes(topSub) || topOccasion === 'work') score += 8;
    if (['trousers', 'chinos', 'jeans'].includes(botSub) || botOccasion === 'work') score += 8;
    if (['loafers', 'formal shoes', 'sneakers'].includes(shoSub) || shoOccasion === 'work') score += 8;
    return { valid: true, score, note: 'Polished and professional for workplace settings' };
  }

  if (occasion === 'casual') {
    // Casual: great freedom, but overly formal three-piece pieces get less natural synergy
    let score = 20;
    if (['t-shirt', 'polo', 'hoodie', 'casual shirt'].includes(topSub) || topOccasion === 'casual') score += 6;
    if (['jeans', 'chinos', 'shorts'].includes(botSub) || botOccasion === 'casual') score += 6;
    if (['sneakers', 'boots', 'loafers', 'sandals'].includes(shoSub) || shoOccasion === 'casual') score += 6;
    return { valid: true, score, note: 'Relaxed and comfortable for casual wear' };
  }

  return { valid: true, score: 15, note: 'Adaptable combination' };
}

/**
 * Evaluate color coordination across items
 */
function evaluateColorCoordination(top, bottom, shoes, accessory, preferences = {}) {
  const colors = [top.color, bottom.color, shoes.color];
  if (accessory) colors.push(accessory.color);

  // Check hard clashes
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      if (checkClashingColors(colors[i], colors[j])) {
        return { valid: false, score: 0, reason: `Clashing colors detected (${colors[i]} with ${colors[j]})` };
      }
    }
  }

  let harmonyScore = 15;
  const harmonyReasons = [];

  // Pairwise harmony
  if (areColorsHarmonious(top.color, bottom.color)) {
    harmonyScore += 8;
    harmonyReasons.push(`${top.color} and ${bottom.color} provide balanced contrast`);
  }
  if (areColorsHarmonious(bottom.color, shoes.color)) {
    harmonyScore += 6;
  }
  if (accessory && areColorsHarmonious(shoes.color, accessory.color)) {
    harmonyScore += 4;
    harmonyReasons.push('Shoes and accessory harmonize nicely');
  }

  // Preference matching
  const favColors = (preferences.favorite_colors || []).map(c => c.toLowerCase());
  const disColors = (preferences.disliked_colors || []).map(c => c.toLowerCase());

  let favBonus = 0;
  for (const c of colors) {
    const norm = normalizeColor(c);
    if (favColors.includes(norm) || favColors.includes(c.toLowerCase())) {
      favBonus += 6;
    }
    if (disColors.includes(norm) || disColors.includes(c.toLowerCase())) {
      harmonyScore -= 15;
    }
  }
  if (favBonus > 0) {
    harmonyScore += Math.min(favBonus, 12);
    harmonyReasons.push('Incorporates your preferred color palette');
  }

  return {
    valid: true,
    score: Math.max(10, Math.min(harmonyScore, 40)),
    reasons: harmonyReasons
  };
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(top, bottom, shoes, accessory, weather, occasion, colorEval) {
  const parts = [];

  // Weather & Occasion Opening
  const occText = occasion.charAt(0).toUpperCase() + occasion.slice(1).toLowerCase();
  const weaText = weather.charAt(0).toUpperCase() + weather.slice(1).toLowerCase();

  parts.push(`An ideal ${occText} outfit tailored for ${weaText} conditions.`);

  // Garment highlights
  parts.push(
    `The ${top.name} (${top.color}) pairs seamlessly with ${bottom.name} (${bottom.color}), anchored by ${shoes.name}.`
  );

  // Weather specific reason
  if (weaText === 'Hot') {
    parts.push('Keeps you cool, airy, and effortlessly stylish.');
  } else if (weaText === 'Cold') {
    parts.push('Offers cozy insulation and smart layering.');
  } else if (weaText === 'Rainy') {
    parts.push('Features practical footwear and weather-ready pieces for damp days.');
  }

  // Color harmony highlight
  if (colorEval.reasons && colorEval.reasons.length > 0) {
    parts.push(colorEval.reasons.join('. ') + '.');
  } else {
    parts.push(`The ${top.color} and ${bottom.color} palette delivers an aesthetically cohesive silhouette.`);
  }

  if (accessory) {
    parts.push(`Accented with the ${accessory.name} for an elevated finishing touch.`);
  }

  return parts.join(' ');
}

/**
 * Main recommendation generator
 */
export function generateOutfitRecommendations({ items, weather = 'Hot', occasion = 'Casual', preferences = {}, maxRecommendations = 5 }) {
  // Check completeness first
  const completeness = checkWardrobeCompleteness(items);
  if (!completeness.canGenerate) {
    return {
      success: false,
      canGenerate: false,
      missingCategories: completeness.missingCategories,
      message: completeness.message,
      counts: completeness.counts,
      recommendations: []
    };
  }

  const tops = items.filter(i => i.category.toLowerCase() === 'top');
  const bottoms = items.filter(i => i.category.toLowerCase() === 'bottom');
  const shoes = items.filter(i => i.category.toLowerCase() === 'shoes');
  const accessories = items.filter(i => i.category.toLowerCase() === 'accessories');

  const candidateOutfits = [];

  for (const top of tops) {
    const topWeather = evaluateWeatherSuitability(top, weather);
    if (!topWeather.valid) continue;

    for (const bottom of bottoms) {
      const bottomWeather = evaluateWeatherSuitability(bottom, weather);
      if (!bottomWeather.valid) continue;

      for (const shoe of shoes) {
        const shoeWeather = evaluateWeatherSuitability(shoe, weather);
        if (!shoeWeather.valid) continue;

        // Occasion validation
        const occasionEval = evaluateOccasionFormality(top, bottom, shoe, occasion);
        if (!occasionEval.valid) continue;

        // Best compatible accessory (if any)
        let bestAccessory = null;
        let bestAccScore = 0;

        for (const acc of accessories) {
          const accWeather = evaluateWeatherSuitability(acc, weather);
          if (!accWeather.valid) continue;

          const accOccasion = (acc.occasion || 'All Occasions').toLowerCase();
          if (accOccasion !== 'all occasions' && accOccasion !== occasion.toLowerCase()) continue;

          const colorAcc = evaluateColorCoordination(top, bottom, shoe, acc, preferences);
          if (colorAcc.valid && colorAcc.score > bestAccScore) {
            bestAccScore = colorAcc.score;
            bestAccessory = acc;
          }
        }

        // Color coordination
        const colorEval = evaluateColorCoordination(top, bottom, shoe, bestAccessory, preferences);
        if (!colorEval.valid) continue;

        // Style preferences bonus
        let styleBonus = 0;
        const preferredStyles = (preferences.preferred_styles || []).map(s => s.toLowerCase());
        if (preferredStyles.includes('minimalist') && NEUTRAL_COLORS.has(normalizeColor(top.color)) && NEUTRAL_COLORS.has(normalizeColor(bottom.color))) {
          styleBonus += 5;
        }

        // Total score calculation (normalized roughly to 70 - 99 scale)
        const baseScore = 55;
        const weatherScore = topWeather.score + bottomWeather.score + shoeWeather.score; // ~30-60
        const occasionScore = occasionEval.score; // ~15-35
        const colorScore = colorEval.score; // ~10-40

        const rawScore = baseScore + (weatherScore * 0.25) + (occasionScore * 0.4) + (colorScore * 0.5) + styleBonus;
        const normalizedScore = Math.min(99, Math.max(70, Math.round(rawScore)));

        const explanation = generateExplanation(top, bottom, shoe, bestAccessory, weather, occasion, colorEval);

        candidateOutfits.push({
          id: `outfit-${top.id}-${bottom.id}-${shoe.id}${bestAccessory ? `-${bestAccessory.id}` : ''}`,
          top,
          bottom,
          shoes: shoe,
          accessory: bestAccessory,
          weather,
          occasion,
          score: normalizedScore,
          explanation,
          highlights: [
            topWeather.note,
            occasionEval.note,
            ...(colorEval.reasons || [])
          ].filter(Boolean)
        });
      }
    }
  }

  // Sort by highest score first
  candidateOutfits.sort((a, b) => b.score - a.score);

  // Pick top recommendations with diversity (ensure variety of tops/bottoms)
  const selectedOutfits = [];
  const usedTops = new Set();
  const usedBottoms = new Set();

  for (const outfit of candidateOutfits) {
    if (selectedOutfits.length >= maxRecommendations) break;

    // Prefer distinct combinations
    const isTopUsed = usedTops.has(outfit.top.id);
    const isBottomUsed = usedBottoms.has(outfit.bottom.id);

    if (!isTopUsed || !isBottomUsed || candidateOutfits.length < maxRecommendations * 2) {
      selectedOutfits.push(outfit);
      usedTops.add(outfit.top.id);
      usedBottoms.add(outfit.bottom.id);
    }
  }

  // If diversity filter took too few, fill up to maxRecommendations from the remaining top scorers
  if (selectedOutfits.length < maxRecommendations && candidateOutfits.length > selectedOutfits.length) {
    for (const outfit of candidateOutfits) {
      if (!selectedOutfits.some(o => o.id === outfit.id)) {
        selectedOutfits.push(outfit);
        if (selectedOutfits.length >= maxRecommendations) break;
      }
    }
  }

  if (selectedOutfits.length === 0) {
    return {
      success: true,
      canGenerate: true,
      message: `No matching combinations found for ${weather} weather and ${occasion} occasion with your current closet items. Try adding more suitable items or choosing another weather/occasion setting.`,
      recommendations: []
    };
  }

  return {
    success: true,
    canGenerate: true,
    message: `Generated ${selectedOutfits.length} high-match outfit combinations for ${weather} weather and ${occasion} occasion.`,
    recommendations: selectedOutfits
  };
}
