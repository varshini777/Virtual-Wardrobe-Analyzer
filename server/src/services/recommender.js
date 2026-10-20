/**
 * VIRTUAL WARDROBE ANALYZER — ADVANCED RECOMMENDATION ENGINE
 * 
 * Centralized, explainable personal styling pipeline synthesizing:
 * 1. Color Harmony & Palette Coordination (Neutral, Earth, Monochromatic, Analogous, Complementary)
 * 2. Weather & Temperature Thermodynamics (Hot, Mild, Cool, Cold, Rainy)
 * 3. Independent Seasonal Alignment (Summer, Winter, Spring, Autumn, All Seasons)
 * 4. Occasion & Dress Code Rules (Casual, Smart Casual, Work, Business Formal, Formal, Party, Evening, Traditional, Sports, Travel, Loungewear)
 * 5. Gender Presentation & Silhouette Fit Optimization (Men's, Women's, Unisex, Show All; Slim, Regular, Relaxed, Oversized, Tailored, etc.)
 * 6. Personal Style Aesthetics (Minimalist, Classic, Streetwear, Old Money, Smart Casual, etc.)
 * 7. Non-forced, Coordinated Accessories (Belts matching shoes, formal ties, bags)
 * 8. Calibrated Multi-Factor Scoring with complete breakdown
 * 9. Context-aware, item-specific explanation generator
 * 10. Multi-tiered diversity ranking with recommendation history penalty
 */

// =============================================================================
// 1. COLOR DICTIONARY & HARMONY KNOWLEDGE BASE
// =============================================================================

export const COLOR_SYNONYMS = {
  // Whites & Off-whites
  white: 'white',
  snow: 'white',
  ivory: 'white',
  'off-white': 'white',
  pearl: 'white',
  chalk: 'white',
  alabaster: 'white',
  pure_white: 'white',

  // Blacks
  black: 'black',
  'jet black': 'black',
  onyx: 'black',
  ebony: 'black',
  pitch_black: 'black',

  // Greys & Charcoals
  grey: 'grey',
  gray: 'grey',
  charcoal: 'charcoal',
  'dark grey': 'charcoal',
  'dark gray': 'charcoal',
  slate: 'grey',
  'heather grey': 'grey',
  'heather gray': 'grey',
  silver: 'grey',
  ash: 'grey',
  smoke: 'grey',
  gunmetal: 'charcoal',
  anthracite: 'charcoal',

  // Blues & Navies
  navy: 'navy',
  'dark blue': 'navy',
  'midnight blue': 'navy',
  indigo: 'navy',
  blue: 'blue',
  'royal blue': 'blue',
  'sky blue': 'light blue',
  'light blue': 'light blue',
  'powder blue': 'light blue',
  'ice blue': 'light blue',
  denim: 'blue',
  chambray: 'light blue',
  cobalt: 'blue',
  cerulean: 'blue',

  // Earth Tones & Beiges
  beige: 'beige',
  cream: 'cream',
  sand: 'beige',
  ecru: 'cream',
  stone: 'beige',
  tan: 'tan',
  khaki: 'khaki',
  taupe: 'taupe',
  oatmeal: 'cream',
  champagne: 'cream',
  wheat: 'beige',
  biscuit: 'beige',
  camel: 'tan',
  cognac: 'brown',
  caramel: 'brown',
  sienna: 'brown',
  brown: 'brown',
  'dark brown': 'brown',
  chocolate: 'brown',
  espresso: 'brown',
  chestnut: 'brown',
  tobacco: 'brown',
  bronze: 'brown',

  // Greens & Olives
  olive: 'olive',
  'olive green': 'olive',
  'army green': 'olive',
  sage: 'olive',
  moss: 'olive',
  'forest green': 'green',
  green: 'green',
  emerald: 'green',
  mint: 'green',
  'kelly green': 'green',
  pine: 'green',
  hunter: 'green',

  // Reds, Burgundies & Earth Reds
  burgundy: 'burgundy',
  maroon: 'burgundy',
  wine: 'burgundy',
  bordeaux: 'burgundy',
  oxblood: 'burgundy',
  red: 'red',
  crimson: 'red',
  ruby: 'red',
  scarlet: 'red',
  rust: 'rust',
  terracotta: 'rust',
  clay: 'rust',
  'brick red': 'rust',

  // Pinks & Purples
  pink: 'pink',
  blush: 'pink',
  rose: 'pink',
  salmon: 'pink',
  coral: 'pink',
  'dusty rose': 'pink',
  purple: 'purple',
  plum: 'purple',
  violet: 'purple',
  lavender: 'purple',
  mauve: 'purple',
  lilac: 'purple',

  // Yellows & Oranges
  yellow: 'yellow',
  mustard: 'yellow',
  gold: 'yellow',
  amber: 'yellow',
  lemon: 'yellow',
  orange: 'orange',
  tangerine: 'orange',
  peach: 'orange',
  copper: 'orange',

  // Patterns / Multi
  multicolor: 'multicolor',
  multi: 'multicolor',
  patterned: 'multicolor'
};

export const COLOR_FAMILIES = {
  neutrals: new Set(['white', 'black', 'grey', 'charcoal', 'navy', 'beige', 'cream', 'tan', 'khaki', 'brown', 'taupe']),
  warm_neutrals: new Set(['beige', 'cream', 'tan', 'khaki', 'brown', 'taupe', 'rust']),
  cool_neutrals: new Set(['grey', 'charcoal', 'navy', 'white', 'black']),
  earth_tones: new Set(['olive', 'khaki', 'brown', 'tan', 'beige', 'cream', 'rust', 'taupe']),
  blues: new Set(['navy', 'blue', 'light blue']),
  greens: new Set(['olive', 'green']),
  warm_accents: new Set(['burgundy', 'red', 'rust', 'orange', 'yellow', 'pink']),
  cool_accents: new Set(['purple', 'blue', 'green', 'light blue'])
};

export function normalizeColor(color) {
  if (!color || typeof color !== 'string') return 'neutral';
  const raw = color.trim().toLowerCase();
  return COLOR_SYNONYMS[raw] || raw;
}

export function getColorFamily(normColor) {
  for (const [family, set] of Object.entries(COLOR_FAMILIES)) {
    if (set.has(normColor)) return family;
  }
  return 'other';
}

/**
 * Evaluates color compatibility between two colors
 */
export function evaluatePairHarmony(c1, c2) {
  const norm1 = normalizeColor(c1);
  const norm2 = normalizeColor(c2);
  const c1Name = c1 ? (c1.charAt(0).toUpperCase() + c1.slice(1)) : 'Neutral';
  const c2Name = c2 ? (c2.charAt(0).toUpperCase() + c2.slice(1)) : 'Neutral';

  if (norm1 === norm2) {
    return { harmonious: true, type: 'monochromatic', bonus: 14, note: `Monochromatic ${c1Name} cohesion` };
  }

  const isNeutral1 = COLOR_FAMILIES.neutrals.has(norm1);
  const isNeutral2 = COLOR_FAMILIES.neutrals.has(norm2);

  // Both neutrals are intrinsically harmonious
  if (isNeutral1 && isNeutral2) {
    // Specific high-elegance neutral pairs
    if ((norm1 === 'navy' && ['white', 'beige', 'cream', 'tan', 'grey'].includes(norm2)) ||
        (norm2 === 'navy' && ['white', 'beige', 'cream', 'tan', 'grey'].includes(norm1))) {
      return { harmonious: true, type: 'classic_neutral', bonus: 18, note: `${c1Name} and ${c2Name} provide quintessential nautical-tailored contrast` };
    }
    if ((norm1 === 'black' && ['white', 'grey', 'charcoal', 'beige'].includes(norm2)) ||
        (norm2 === 'black' && ['white', 'grey', 'charcoal', 'beige'].includes(norm1))) {
      return { harmonious: true, type: 'monochrome_contrast', bonus: 16, note: `${c1Name} and ${c2Name} create high-contrast architectural balance` };
    }
    return { harmonious: true, type: 'neutral_pair', bonus: 14, note: `${c1Name} and ${c2Name} harmonize naturally as complementary neutrals` };
  }

  // Earth tone combinations
  const isEarth1 = COLOR_FAMILIES.earth_tones.has(norm1);
  const isEarth2 = COLOR_FAMILIES.earth_tones.has(norm2);
  if (isEarth1 && isEarth2) {
    return { harmonious: true, type: 'earth_tones', bonus: 16, note: `${c1Name} and ${c2Name} form an organic, grounded earth-tone palette` };
  }

  // Neutral + Accent
  if (isNeutral1 || isNeutral2) {
    const neutral = isNeutral1 ? c1Name : c2Name;
    const accent = isNeutral1 ? c2Name : c1Name;
    return { harmonious: true, type: 'neutral_accent', bonus: 14, note: `${neutral} anchors the vibrant ${accent} accent cleanly` };
  }

  // Analogous combinations
  const blueTones = ['navy', 'blue', 'light blue'];
  const greenTones = ['olive', 'green'];
  if ((blueTones.includes(norm1) && greenTones.includes(norm2)) || (greenTones.includes(norm1) && blueTones.includes(norm2))) {
    return { harmonious: true, type: 'analogous', bonus: 12, note: `${c1Name} and ${c2Name} form a soothing analogous palette` };
  }

  // Complementary: Blue / Tan-Brown
  if ((blueTones.includes(norm1) && ['brown', 'tan', 'rust'].includes(norm2)) ||
      (blueTones.includes(norm2) && ['brown', 'tan', 'rust'].includes(norm1))) {
    return { harmonious: true, type: 'complementary', bonus: 16, note: `${c1Name} and ${c2Name} strike an attractive warm-cool balance` };
  }

  // Red/Green holiday clash check
  if ((norm1 === 'red' && norm2 === 'green') || (norm1 === 'green' && norm2 === 'red')) {
    return { harmonious: false, type: 'clash', bonus: -20, note: 'Clashing saturated red and green' };
  }

  return { harmonious: true, type: 'passable', bonus: 8, note: `${c1Name} and ${c2Name} combine decently` };
}

/**
 * Evaluates holistic color coordination across an ensemble
 */
export function evaluateEnsembleColorCoordination(top, bottom, shoes, accessory = null, preferences = {}) {
  const pieces = [
    { role: 'Top', item: top, color: top.color, secondary: top.secondary_color, pattern: top.pattern },
    { role: 'Bottom', item: bottom, color: bottom.color, secondary: bottom.secondary_color, pattern: bottom.pattern },
    { role: 'Shoes', item: shoes, color: shoes.color, secondary: shoes.secondary_color, pattern: shoes.pattern }
  ];
  if (accessory) {
    pieces.push({ role: 'Accessory', item: accessory, color: accessory.color, secondary: accessory.secondary_color, pattern: accessory.pattern });
  }

  const primaryColors = pieces.map(p => normalizeColor(p.color));
  const uniqueColors = Array.from(new Set(primaryColors));

  // Check hard exclusions
  const dislikedColors = (preferences.disliked_colors || []).map(c => normalizeColor(c));
  const favoriteColors = (preferences.favorite_colors || []).map(c => normalizeColor(c));
  const strictColorExclusion = Boolean(preferences.strict_color_exclusion);

  for (const c of primaryColors) {
    if (dislikedColors.includes(c)) {
      if (strictColorExclusion) {
        return { valid: false, score: 0, reason: `Excluded disliked color (${c}) present under strict exclusion` };
      }
    }
  }

  // Pairwise harmony evaluation
  let harmonyTotal = 0;
  const harmonyNotes = [];
  let pairCount = 0;

  // Primary top-bottom pair
  const topBot = evaluatePairHarmony(top.color, bottom.color);
  if (!topBot.harmonious && topBot.bonus < 0) {
    return { valid: false, score: 0, reason: topBot.note };
  }
  harmonyTotal += topBot.bonus;
  if (topBot.note) harmonyNotes.push(topBot.note);
  pairCount++;

  // Bottom-shoes pair
  const botShoe = evaluatePairHarmony(bottom.color, shoes.color);
  harmonyTotal += botShoe.bonus;
  pairCount++;

  // Top-shoes pair
  const topShoe = evaluatePairHarmony(top.color, shoes.color);
  harmonyTotal += topShoe.bonus * 0.7;
  pairCount++;

  // Pattern & secondary color harmony
  if (top.secondary_color && top.pattern && top.pattern.toLowerCase() !== 'solid') {
    const secHarmony = evaluatePairHarmony(top.secondary_color, bottom.color);
    if (secHarmony.harmonious) {
      harmonyTotal += 6;
      harmonyNotes.push(`The ${top.pattern.toLowerCase()} secondary accents in the top tie into the ${bottom.color}`);
    }
  }

  // Accessory coordination
  if (accessory) {
    const accShoe = evaluatePairHarmony(accessory.color, shoes.color);
    const isLeatherAccessory = (accessory.fabric || accessory.sub_category || '').toLowerCase().includes('leather');
    const isLeatherShoes = (shoes.fabric || shoes.sub_category || '').toLowerCase().includes('leather');

    if (accShoe.harmonious) {
      harmonyTotal += 8;
      if (isLeatherAccessory && isLeatherShoes && normalizeColor(accessory.color) === normalizeColor(shoes.color)) {
        harmonyNotes.push(`Matching ${accessory.color} leather tones coordinate the belt/accessory with the footwear`);
      } else {
        harmonyNotes.push(`Accessory harmonizes cleanly with footwear`);
      }
    }
    pairCount++;
  }

  // Favorite / Disliked Color Adjustments
  let favBonus = 0;
  let disPenalty = 0;

  for (const c of primaryColors) {
    if (favoriteColors.includes(c)) {
      favBonus += 8;
    }
    if (dislikedColors.includes(c)) {
      disPenalty += 14;
    }
  }

  if (favBonus > 0) {
    harmonyNotes.push('Incorporates your preferred color palette');
  }
  if (disPenalty > 0) {
    harmonyNotes.push('Includes a less preferred hue (penalized)');
  }

  // Calculate 0-100 normalized score
  const baseScore = 65;
  const netModifier = (harmonyTotal / Math.max(pairCount, 1)) * 1.5 + Math.min(favBonus, 16) - disPenalty;
  const finalScore = Math.max(30, Math.min(100, Math.round(baseScore + netModifier)));

  return {
    valid: true,
    score: finalScore,
    palette: uniqueColors,
    reasons: harmonyNotes
  };
}

// =============================================================================
// 2. WEATHER, TEMPERATURE & FABRIC THERMODYNAMICS
// =============================================================================

export const FABRIC_PROFILES = {
  // Ultra-breathable / Warm-weather
  linen: { breathability: 10, warmth: 2, rainResistance: 2 },
  seersucker: { breathability: 9, warmth: 2, rainResistance: 3 },
  'cotton poplin': { breathability: 8, warmth: 3, rainResistance: 3 },
  'bamboo cotton': { breathability: 9, warmth: 2, rainResistance: 2 },
  silk: { breathability: 7, warmth: 3, rainResistance: 1 },
  'mulberry silk': { breathability: 7, warmth: 3, rainResistance: 1 },
  chambray: { breathability: 8, warmth: 4, rainResistance: 3 },
  'tropical wool': { breathability: 8, warmth: 4, rainResistance: 4 },

  // Midweight / All-weather
  cotton: { breathability: 7, warmth: 5, rainResistance: 3 },
  'combed cotton': { breathability: 7, warmth: 5, rainResistance: 3 },
  denim: { breathability: 5, warmth: 6, rainResistance: 4 },
  'cotton twill': { breathability: 6, warmth: 6, rainResistance: 4 },
  'oxford cloth': { breathability: 6, warmth: 5, rainResistance: 3 },
  'french terry': { breathability: 6, warmth: 6, rainResistance: 3 },
  chinos: { breathability: 6, warmth: 5, rainResistance: 3 },

  // Insulating / Cold-weather
  wool: { breathability: 5, warmth: 9, rainResistance: 5 },
  cashmere: { breathability: 6, warmth: 10, rainResistance: 3 },
  alpaca: { breathability: 5, warmth: 10, rainResistance: 4 },
  mohair: { breathability: 5, warmth: 9, rainResistance: 3 },
  flannel: { breathability: 4, warmth: 8, rainResistance: 4 },
  corduroy: { breathability: 4, warmth: 8, rainResistance: 4 },
  fleece: { breathability: 5, warmth: 8, rainResistance: 3 },
  gabardine: { breathability: 5, warmth: 7, rainResistance: 7 },
  shearling: { breathability: 3, warmth: 10, rainResistance: 5 },

  // Water-resistant / Outerwear
  gore: { breathability: 6, warmth: 6, rainResistance: 10 },
  'waxed cotton': { breathability: 4, warmth: 7, rainResistance: 9 },
  nylon: { breathability: 4, warmth: 5, rainResistance: 8 },
  suede: { breathability: 5, warmth: 6, rainResistance: 0 } // Suede easily destroyed by rain
};

export function inspectFabric(fabricStr) {
  if (!fabricStr) return { breathability: 6, warmth: 5, rainResistance: 3 };
  const raw = fabricStr.toLowerCase();
  for (const [key, profile] of Object.entries(FABRIC_PROFILES)) {
    if (raw.includes(key)) return profile;
  }
  return { breathability: 6, warmth: 5, rainResistance: 3 };
}

// =============================================================================
// 2. WEATHER NORMALIZATION & CLIMATIC THERMODYNAMICS (4 Standard Weathers)
// =============================================================================

export function normalizeWeather(weather) {
  if (!weather) return 'Mild';
  const w = weather.toLowerCase().trim();
  if (w === 'hot' || w.includes('hot') || w.includes('warm') || w.includes('summer')) return 'Hot';
  if (w === 'cold' || w.includes('cold') || w.includes('winter') || w.includes('chilly') || w.includes('snow')) return 'Cold';
  if (w === 'rainy' || w.includes('rain') || w.includes('wet') || w.includes('monsoon')) return 'Rainy';
  return 'Mild';
}

export function evaluateWeatherSuitability(item, targetWeather = 'Mild', strict = false) {
  const normWeather = normalizeWeather(targetWeather);
  const weather = normWeather.toLowerCase();
  const itemWeather = (item.weather_suitability || 'All Weather').toLowerCase();
  const subCategory = (item.sub_category || '').toLowerCase();
  const fabricProfile = inspectFabric(item.fabric);
  const textInfo = `${item.name} ${item.notes || ''} ${item.fabric || ''} ${subCategory}`.toLowerCase();

  // 1. HOT WEATHER (Lightweight, breathable, cooling)
  if (weather === 'hot') {
    if (itemWeather === 'cold' || itemWeather === 'rainy') {
      return { valid: false, score: 0, reason: `${item.name} is designated for cold/wet conditions` };
    }
    if (['sweater', 'hoodie', 'overcoat', 'heavy coat', 'heavy jacket', 'parka', 'beanie', 'scarf', 'turtleneck'].includes(subCategory) && itemWeather !== 'hot') {
      return { valid: false, score: 0, reason: 'Heavy outerwear and knitwear cause overheating in hot weather' };
    }
    if (['boots', 'winter boots', 'lug boot', 'chelsea boots'].includes(subCategory)) {
      return { valid: false, score: 0, reason: 'Heavy boots are stifling in hot temperatures' };
    }
    if (fabricProfile.warmth >= 8) {
      return { valid: false, score: 0, reason: 'Heavy thermal fabric causes overheating in hot temperatures' };
    }

    let score = 72;
    if (itemWeather === 'hot') score += 15;
    if (fabricProfile.breathability >= 8) score += 12;
    if (['shorts', 'sandals', 't-shirt', 'polo', 'linen shirt', 'shirt'].includes(subCategory)) score += 10;
    return { valid: true, score: Math.min(100, score), note: 'Lightweight & breathable for warm conditions' };
  }

  // 2. COLD WEATHER (Insulating, warm layers, full-length)
  if (weather === 'cold') {
    if (itemWeather === 'hot') {
      return { valid: false, score: 0, reason: `${item.name} is excessively lightweight for cold weather` };
    }
    if (['shorts', 'sandals', 'flip flops', 'tank top', 'sleeveless'].includes(subCategory)) {
      return { valid: false, score: 0, reason: 'Exposes skin to cold temperatures' };
    }

    let score = 70;
    if (itemWeather === 'cold') score += 18;
    if (fabricProfile.warmth >= 8) score += 15;
    if (['sweater', 'jacket', 'coat', 'trousers', 'boots', 'scarf', 'beanie', 'flannel'].includes(subCategory)) score += 10;
    return { valid: true, score: Math.min(100, score), note: 'Thermal insulation and cold-weather protection' };
  }

  // 3. RAINY WEATHER (Water-repellent, enclosed, non-staining)
  if (weather === 'rainy') {
    const isShoe = item.category.toLowerCase() === 'shoes';
    const isTop = item.category.toLowerCase() === 'top';
    const isBottom = item.category.toLowerCase() === 'bottom';
    const isWhite = (item.color || '').toLowerCase() === 'white' || textInfo.includes('white');

    // Footwear evaluation in rain (Strict 6-tier classification)
    if (isShoe) {
      // Hard exclusion 1: Open sandals, slides, flip flops, chappals
      const isOpenFootwear =
        subCategory.includes('sandal') ||
        subCategory.includes('slide') ||
        subCategory.includes('flip flop') ||
        subCategory.includes('chappal') ||
        textInfo.includes('sandal') ||
        textInfo.includes('cork slide') ||
        textInfo.includes('fisherman') ||
        textInfo.includes('kolhapuri');

      if (isOpenFootwear) {
        return { valid: false, score: 0, reason: 'Open footwear exposes feet to rain, puddles, and street runoff' };
      }

      // Hard exclusion 2: Espadrilles & jute rope soles (water rots rope and separates soles)
      if (subCategory.includes('espadrille') || textInfo.includes('espadrille') || textInfo.includes('jute rope') || textInfo.includes('rope sole')) {
        return { valid: false, score: 0, reason: 'Jute rope soles and espadrille construction deteriorate rapidly when wet' };
      }

      // Hard exclusion 3: Untreated suede & velvet (unless waxed roughout/treated)
      const isWaxedSuede = textInfo.includes('waxed roughout') || textInfo.includes('waxed suede');
      const isSuede = textInfo.includes('suede') && !isWaxedSuede;
      if (isSuede) {
        return { valid: false, score: 0, reason: 'Untreated suede suffers permanent water damage and spotting in the rain' };
      }
      if (textInfo.includes('velvet')) {
        return { valid: false, score: 0, reason: 'Delicate silk velvet is permanently stained by water and moisture' };
      }

      // Tier 1: Verified Waterproof Footwear
      // Explicit waterproof designation or waterproof shell (rubber duck boot, waterproof membrane)
      const isVerifiedWaterproof =
        item.waterproof_status === 'Waterproof' ||
        (item.name || '').toLowerCase().includes('waterproof') ||
        textInfo.includes('waterproof membrane') ||
        textInfo.includes('duck boot') ||
        (textInfo.includes('rubber') && (textInfo.includes('lower shell') || textInfo.includes('rain boot') || textInfo.includes('wellington') || textInfo.includes('fully waterproof')));

      if (isVerifiedWaterproof) {
        let score = 96;
        if (isWhite) score -= 4; // Minimal stain penalty on wipeable waterproof rubber
        return {
          valid: true,
          score,
          tier: 'waterproof',
          note: 'Verified waterproof construction provides dependable barrier against rainfall and puddles'
        };
      }

      // Tier 4: Canvas / Textile Footwear (duck canvas, washed twill canvas, knit sock runners)
      // Check before Tier 2/3 so canvas sneakers with rubber soles are properly treated as canvas!
      const isCanvasOrKnit =
        textInfo.includes('canvas') ||
        textInfo.includes('duck canvas') ||
        textInfo.includes('knit') ||
        textInfo.includes('twill canvas') ||
        subCategory.includes('deck') ||
        textInfo.includes('deck shoe');

      if (isCanvasOrKnit) {
        let score = 42; // Strong suitability penalty for absorbent canvas in rain
        if (isWhite) score -= 12; // Splash penalty without hard exclusion
        return {
          valid: true,
          score: Math.max(25, score),
          tier: 'canvas',
          note: 'Untreated canvas/knit footwear readily absorbs moisture; requires caution in wet conditions'
        };
      }

      // Tier 2: Verified Water-Resistant / Heavy Lug / Storm-Welt Footwear
      const isWaterResistant =
        item.waterproof_status === 'Water-resistant' ||
        textInfo.includes('water-resistant') ||
        textInfo.includes('weatherproof') ||
        textInfo.includes('oil-tanned') ||
        isWaxedSuede ||
        (textInfo.includes('cordura') && textInfo.includes('rubberized')) ||
        (textInfo.includes('commando') && textInfo.includes('lug')) ||
        textInfo.includes('military cowhide');

      if (isWaterResistant) {
        let score = 86;
        if (isWhite) score -= 8;
        return {
          valid: true,
          score,
          tier: 'water_resistant',
          note: 'Durable water-resistant construction and traction lugs suited for wet streets'
        };
      }

      // Tier 3: Enclosed Untreated Smooth Leather Footwear (derbies, oxfords, calfskin sneakers)
      const isEnclosedLeather =
        textInfo.includes('leather') ||
        textInfo.includes('calfskin') ||
        textInfo.includes('calf') ||
        textInfo.includes('cowhide') ||
        subCategory.includes('derby') ||
        subCategory.includes('oxford') ||
        subCategory.includes('formal') ||
        subCategory.includes('loafers');

      if (isEnclosedLeather) {
        let score = 68;
        if (isWhite) {
          score -= 12; // Sensible splash/stain penalty without hard exclusion!
          return {
            valid: true,
            score,
            tier: 'leather_enclosed',
            note: 'Enclosed leather provides basic surface shielding; white finish requires care against puddle splashes'
          };
        }
        return {
          valid: true,
          score,
          tier: 'leather_enclosed',
          note: 'Enclosed leather shields against light drizzle; untreated leather absorbs water if submerged'
        };
      }

      // Default enclosed shoe
      let score = 58;
      if (isWhite) score -= 12;
      return {
        valid: true,
        score,
        tier: 'general_enclosed',
        note: 'Enclosed construction shields against light rain; lacks verified water resistance'
      };
    }

    // Top / Outerwear evaluation in rain
    if (isTop) {
      if (textInfo.includes('suede')) {
        return { valid: false, score: 0, reason: 'Suede outerwear suffers permanent water damage in the rain' };
      }
      const isWaterproofShell =
        textInfo.includes('waterproof') ||
        textInfo.includes('waxed') ||
        textInfo.includes('gore') ||
        textInfo.includes('storm cotton') ||
        textInfo.includes('trench');
      if (isWaterproofShell) {
        return { valid: true, score: 96, note: 'Verified water-repellent shell sheds rain and wind' };
      }
      if (textInfo.includes('silk') || textInfo.includes('crochet') || textInfo.includes('open-weave')) {
        return { valid: true, score: 50, note: 'Delicate fabric is prone to moisture spotting in the rain' };
      }
      return { valid: true, score: 72, note: 'Everyday layer for overcast and damp weather' };
    }

    // Bottoms evaluation in rain
    if (isBottom) {
      if (textInfo.includes('dwr') || textInfo.includes('cordura stretch ripstop')) {
        return { valid: true, score: 95, note: 'DWR water-repellent finish repels moisture and street splash' };
      }
      if (textInfo.includes('linen') && !textInfo.includes('blend')) {
        return { valid: true, score: 52, note: 'Linen becomes translucent and damp in persistent rain' };
      }
      if (subCategory.includes('short')) {
        return { valid: true, score: 54, note: 'Exposes bare legs to wet spray and puddle splashes' };
      }
      return { valid: true, score: 80, note: 'Durable, full-length coverage for rainy conditions' };
    }

    // Accessories in rain
    if (textInfo.includes('umbrella') || textInfo.includes('waterproof')) {
      return { valid: true, score: 95, note: 'Essential wet-weather accessory' };
    }
    return { valid: true, score: 70, note: 'Standard accessory' };
  }

  // 4. MILD WEATHER (Balanced versatile layers)
  let score = 75;
  if (['shirt', 'polo', 't-shirt', 'sweater', 'cardigan', 'overshirt', 'chinos', 'jeans', 'loafers', 'sneakers'].includes(subCategory)) score += 12;
  if (fabricProfile.breathability >= 5 && fabricProfile.warmth >= 4) score += 10;
  return { valid: true, score: Math.min(100, score), note: 'Versatile transitional layer for mild climate' };
}

// =============================================================================
// 3. SEASON SUITABILITY (Independent from weather)
// =============================================================================

export function evaluateSeasonSuitability(item, targetSeason = 'All Seasons') {
  if (!targetSeason || targetSeason === 'All Seasons') {
    return { score: 85, note: 'Trans-seasonal staple' };
  }

  const season = targetSeason.toLowerCase();
  const itemSeason = (item.season || 'All Seasons').toLowerCase();

  if (itemSeason === season) {
    return { score: 98, note: `Engineered specifically for ${targetSeason}` };
  }

  if (itemSeason === 'all seasons' || itemSeason === 'transitional') {
    return { score: 88, note: `Versatile in ${targetSeason}` };
  }

  // Check seasonal fabric synergy
  const fabric = inspectFabric(item.fabric);
  if (season === 'summer' && fabric.breathability >= 8) return { score: 90, note: 'Cooling summer texture' };
  if (season === 'winter' && fabric.warmth >= 8) return { score: 92, note: 'Insulating winter texture' };
  if ((season === 'spring' || season === 'autumn') && fabric.breathability >= 5 && fabric.warmth >= 5) {
    return { score: 88, note: 'Layer-ready transitional weight' };
  }

  return { score: 70, note: `Usable across ${targetSeason}` };
}

// =============================================================================
// 4. OCCASION & DRESS CODE MATRIX (6 Standard Occasions)
// =============================================================================

export const OCCASION_FORMALITY_LEVELS = {
  'work / formal': 5,
  formal: 5,
  'business formal': 5,
  evening: 4,
  work: 4,
  'smart casual': 3,
  party: 3,
  traditional: 3,
  'traditional/ethnic': 3,
  casual: 1,
  'sports / active': 1,
  'sports/active': 1,
  sports: 1,
  'all occasions': 2
};

export function normalizeOccasion(occasion) {
  if (!occasion) return 'Casual';
  const o = occasion.toLowerCase().trim();
  if (o.includes('smart casual')) return 'Smart Casual';
  if (o.includes('work') || o.includes('formal') || o.includes('business') || o.includes('office') || o.includes('evening') || o.includes('gala')) return 'Work / Formal';
  if (o.includes('party') || o.includes('night')) return 'Party';
  if (o.includes('sport') || o.includes('active') || o.includes('gym') || o.includes('athletic')) return 'Sports / Active';
  if (o.includes('traditional') || o.includes('ethnic') || o.includes('festive') || o.includes('cultural')) return 'Traditional';
  return 'Casual';
}

export function evaluateOccasionFormality(top, bottom, shoes, targetOccasion = 'Casual', strict = false) {
  const normOcc = normalizeOccasion(targetOccasion);
  const occ = normOcc.toLowerCase();
  const topSub = (top.sub_category || '').toLowerCase();
  const botSub = (bottom.sub_category || '').toLowerCase();
  const shoSub = (shoes.sub_category || '').toLowerCase();

  const topOcc = (top.occasion || 'All Occasions').toLowerCase();
  const botOcc = (bottom.occasion || 'All Occasions').toLowerCase();
  const shoOcc = (shoes.occasion || 'All Occasions').toLowerCase();

  const topName = (top.name || '').toLowerCase();
  const botName = (bottom.name || '').toLowerCase();
  const shoName = (shoes.name || '').toLowerCase();

  // Incompatible hybrid combinations
  if (['shorts', 'swimwear'].includes(botSub) && ['oxford', 'oxfords', 'derby', 'formal shoes'].includes(shoSub)) {
    return { valid: false, score: 0, reason: 'Dress shoes clash incompatibly with casual shorts' };
  }

  // 1. WORK / FORMAL
  if (occ === 'work / formal') {
    const isTeeOrHoodie = ['t-shirt', 'hoodie', 'tank top', 'sweatshirt'].includes(topSub) || topName.includes('tee') || topName.includes('hoodie');
    const isCasualBottom = ['shorts', 'joggers', 'track pants', 'cargo pants', 'overalls', 'jeans'].includes(botSub) || botName.includes('jeans') || botName.includes('cargo') || botName.includes('dungaree');
    const isCasualShoe = ['sandals', 'flip flops', 'athletic sneakers', 'running shoes', 'slippers', 'deck shoes', 'sneakers', 'trail runner', 'canvas shoes'].includes(shoSub) || shoName.includes('sneaker') || shoName.includes('runner') || shoName.includes('deck');

    if (isTeeOrHoodie || isCasualBottom || isCasualShoe) {
      return { valid: false, score: 0, reason: 'Work / Formal attire strictly requires formal shirts/blazers, tailored trousers, and dress shoes/loafers' };
    }

    let score = 75;
    if (['blazer', 'suit jacket', 'shirt', 'dress shirt', 'oxford shirt'].includes(topSub) || topOcc.includes('formal') || topOcc.includes('work')) score += 12;
    if (['trousers', 'suit trousers', 'tailored pants', 'chinos'].includes(botSub) || botOcc.includes('formal') || botOcc.includes('work')) score += 12;
    if (['oxfords', 'oxford', 'derbies', 'derby', 'formal shoes', 'loafers'].includes(shoSub) || shoOcc.includes('formal') || shoOcc.includes('work')) score += 12;
    return { valid: true, score: Math.min(100, score), note: 'Sharp, tailored silhouette honoring corporate and formal standards' };
  }

  // 2. SMART CASUAL
  if (occ === 'smart casual') {
    if (['shorts', 'track pants', 'joggers', 'cargo pants', 'overalls'].includes(botSub)) {
      return { valid: false, score: 0, reason: 'Shorts, sweatpants, and cargo pants do not meet smart casual refinement standards' };
    }
    if (['flip flops', 'sandals', 'running shoes', 'athletic sneakers', 'slippers'].includes(shoSub) || shoName.includes('running') || shoName.includes('sandal')) {
      return { valid: false, score: 0, reason: 'Open sandals and athletic running shoes clash with smart casual attire' };
    }
    if (botName.includes('painter') || botName.includes('bleach') || botName.includes('acid') || botName.includes('skate') || botName.includes('dungaree')) {
      return { valid: false, score: 0, reason: 'Heavily distressed or utilitarian workwear jeans are too informal for smart casual' };
    }

    let score = 75;
    if (['shirt', 'polo', 'sweater', 'blazer', 'overshirt'].includes(topSub)) score += 10;
    if (['chinos', 'trousers'].includes(botSub) || botOcc.includes('smart casual')) score += 10;
    if (['loafers', 'clean sneakers', 'derbies', 'chelsea boots', 'sneakers'].includes(shoSub)) score += 10;
    return { valid: true, score: Math.min(100, score), note: 'Polished, approachable smart casual tailoring' };
  }

  // 3. SPORTS / ACTIVE
  if (occ === 'sports / active') {
    // In Sports / Active, only athletic tops (tees, athletic tanks, athletic henleys, hoodies, sweatshirts, athletic polos) are suitable
    // Button-down shirts (linen, denim, oxford, chambray, etc.), blazers, knit sweaters, and overcoats are strictly excluded
    const isExcludedTop =
      ['shirt', 'blazer', 'jacket', 'sweater', 'cardigan', 'coat', 'trench', 'kurta', 'sherwani', 'nehru'].includes(topSub) ||
      ['button-down', 'oxford', 'chambray', 'denim shirt', 'linen shirt', 'dress shirt', 'overcoat', 'cardigan', 'pearl-snap', 'camp shirt', 'resort shirt'].some(k => topName.includes(k)) ||
      topOcc.includes('formal');

    if (isExcludedTop) {
      return { valid: false, score: 0, reason: 'Sports / Active wear requires athletic tops (such as athletic tees, tanks, or performance hoodies); button-down shirts, sweaters, and blazers are not suitable for active sports' };
    }

    const botText = `${bottom.name} ${bottom.sub_category || ''} ${bottom.fabric || ''} ${bottom.style || ''} ${bottom.notes || ''}`.toLowerCase();

    // Identify genuine athletic bottoms vs tailored / fashion shorts and formal trousers
    const isExplicitAthleticBottom =
      botText.includes('running') ||
      botText.includes('trail short') ||
      botText.includes('basketball') ||
      botText.includes('track pant') ||
      botText.includes('athletic') ||
      botText.includes('athleisure') ||
      botText.includes('french terry short') ||
      botText.includes('taslan nylon') ||
      botText.includes('tricot') ||
      botText.includes('mesh basketball') ||
      (botSub.includes('jogger') && !botText.includes('sartorial') && !botText.includes('flannel'));

    const isTailoredOrFashionShorts =
      ['tailored', 'pleated', 'chino', 'gurkha', 'seersucker', 'bermuda', 'linen', 'cut-off', 'resort', 'swim trunk'].some(k => botText.includes(k));

    const isFormalOrCasualPants =
      ['trouser', 'suit', 'chinos', 'jeans', 'dungaree', 'painter', 'overalls', 'palazzo', 'pyjama', 'wrap pant', 'cargo'].some(k => botSub.includes(k) || botText.includes(k));

    const isShort = botSub.includes('short') || botText.includes('short');
    const isPantOrTrouser =
      botSub.includes('trouser') ||
      botSub.includes('pant') ||
      botSub.includes('jeans') ||
      botSub.includes('chinos') ||
      botText.includes('trouser') ||
      botText.includes('pant') ||
      botText.includes('jeans') ||
      botText.includes('chinos');

    if (isShort && isTailoredOrFashionShorts && !isExplicitAthleticBottom) {
      return { valid: false, score: 0, reason: 'Tailored, pleated, or linen fashion shorts are not suitable for active sports' };
    }

    if (isPantOrTrouser && !isExplicitAthleticBottom) {
      return { valid: false, score: 0, reason: 'Formal trousers, denim jeans, and chinos are not suitable for sports or athletic training' };
    }

    if (!isExplicitAthleticBottom) {
      return { valid: false, score: 0, reason: 'Sports / Active wear strictly requires genuine athletic bottoms (such as running shorts, track pants, or athletic shorts)' };
    }

    // Footwear evaluation for Sports / Active
    const shoText = `${shoes.name} ${shoes.sub_category || ''} ${shoes.fabric || ''} ${shoes.style || ''} ${shoes.notes || ''}`.toLowerCase();

    // Reject all formal shoes, boots, loafers, sandals, slippers, and deck shoes
    const isNonSportShoe = ['deck', 'slipper', 'loafer', 'boot', 'oxford', 'derby', 'juttis', 'sandal', 'slide', 'espadrille', 'monk', 'pump'].some(k => shoSub.includes(k) || shoText.includes(k));
    if (isNonSportShoe) {
      return { valid: false, score: 0, reason: 'Sports / Active wear strictly requires athletic sneakers or running trainers for support' };
    }

    const isAthleticTrainer =
      shoText.includes('runner') ||
      shoText.includes('trail') ||
      shoText.includes('trainer') ||
      shoText.includes('court') ||
      shoText.includes('tennis') ||
      shoText.includes('basketball') ||
      shoText.includes('athletic') ||
      shoText.includes('sock runner') ||
      shoOcc.includes('sports');

    if (!isAthleticTrainer && !shoSub.includes('sneaker')) {
      return { valid: false, score: 0, reason: 'Sports / Active wear strictly requires athletic trainers or running shoes' };
    }

    let score = 75;
    if (botText.includes('running') || botText.includes('trail') || botText.includes('track')) score += 12;
    if (isAthleticTrainer) {
      score += 18; // Substantial performance boost for dedicated athletic trainers over lifestyle sneakers
    } else {
      score -= 10; // Penalty for lifestyle sneakers lacking athletic cushioning
    }

    return {
      valid: true,
      score: Math.min(100, score),
      note: isAthleticTrainer
        ? 'Ergonomic, flexible sportswear with supportive athletic footwear engineered for motion'
        : 'Casual sportswear pairing; dedicated athletic trainers recommended for high-impact training'
    };
  }

  // 4. TRADITIONAL
  if (occ === 'traditional') {
    const isTraditionalTop = ['kurta', 'sherwani', 'nehru jacket'].includes(topSub) || topOcc.includes('traditional') || topName.includes('kurta') || topName.includes('nehru');
    if (!isTraditionalTop) {
      return { valid: false, score: 0, reason: 'Traditional occasion requires authentic cultural garments (such as Kurta or Nehru Jacket)' };
    }
    if (['athletic sneakers', 'running shoes', 'deck shoes'].includes(shoSub) || shoName.includes('running') || shoName.includes('athletic')) {
      return { valid: false, score: 0, reason: 'Athletic gym sneakers clash with traditional ethnic wear' };
    }
    if (['shorts', 'sweatpants', 'joggers', 'cargo pants', 'jeans'].includes(botSub) || botName.includes('jeans') || botName.includes('cargo')) {
      return { valid: false, score: 0, reason: 'Denim and athletic shorts clash with traditional ethnic wear' };
    }
    let score = 80;
    if (botName.includes('churidar') || botOcc.includes('traditional')) score += 12;
    if (shoName.includes('juttis') || shoOcc.includes('traditional')) score += 12;
    return { valid: true, score: Math.min(100, score), note: 'Cultural refinement and ceremonial traditional grace' };
  }

  // 5. PARTY
  if (occ === 'party') {
    if (['track pants', 'joggers', 'cargo pants', 'overalls', 'sweatpants'].includes(botSub)) {
      return { valid: false, score: 0, reason: 'Athletic sweatpants and cargo pants are too informal for party styling' };
    }
    if (['flip flops', 'sandals', 'running shoes', 'athletic sneakers'].includes(shoSub) || shoName.includes('running') || shoName.includes('athletic')) {
      return { valid: false, score: 0, reason: 'Footwear is too casual or utilitarian for an evening party look' };
    }
    let score = 75;
    if (['shirt', 'polo', 'jacket', 'leather bomber', 'blazer'].includes(topSub)) score += 12;
    if (['jeans', 'trousers', 'chinos'].includes(botSub)) score += 10;
    if (['loafers', 'boots', 'chelsea boots', 'sneakers', 'derbies'].includes(shoSub)) score += 10;
    return { valid: true, score: Math.min(100, score), note: 'Chic, expressive party aesthetic with elevated styling' };
  }

  // 6. CASUAL
  let score = 80;
  if (topOcc.includes('casual') || topOcc === 'all occasions') score += 7;
  if (botOcc.includes('casual') || botOcc === 'all occasions') score += 7;
  if (shoOcc.includes('casual') || shoOcc === 'all occasions') score += 6;
  return { valid: true, score: Math.min(100, score), note: 'Relaxed, versatile casual pairing' };
}

// =============================================================================
// 5. GENDER HANDLING (Neutralized - All Garments Universally Eligible)
// =============================================================================

export function normalizeGender(val) {
  return 'unisex';
}

export function evaluateGenderPresentation(item, preferredGender = 'Show All') {
  // Gender selection is completely removed; all wardrobe garments are eligible
  return { eligible: true, score: 85 };
}

export function evaluateFitAndSilhouette(top, bottom, preferredFit = 'All') {
  const topSil = (top.silhouette || '').toLowerCase();
  const botSil = (bottom.silhouette || '').toLowerCase();
  const pref = (preferredFit || 'All').toLowerCase();

  let score = 80;
  const notes = [];

  // Match against preferred fit
  if (pref !== 'all') {
    const topMatches = topSil.includes(pref);
    const botMatches = botSil.includes(pref);
    if (topMatches || botMatches) {
      score += 12;
      notes.push(`Harmonizes with your preferred ${preferredFit} fit`);
    }
  }

  // Silhouette proportion synergy
  const isTopRelaxed = topSil.includes('relaxed') || topSil.includes('boxy') || topSil.includes('oversized');
  const isTopFitted = topSil.includes('slim') || topSil.includes('fitted') || topSil.includes('tailored');

  const isBotWide = botSil.includes('wide') || botSil.includes('relaxed') || botSil.includes('loose');
  const isBotSlim = botSil.includes('slim') || botSil.includes('taper') || botSil.includes('tailored');

  if (isTopFitted && isBotWide) {
    score += 8;
    notes.push('Fitted upper drape balances a fluid wide-leg lower silhouette');
  } else if (isTopRelaxed && isBotSlim) {
    score += 8;
    notes.push('Relaxed upper volume is crisply anchored by tapered trousers');
  } else if (topSil.includes('tailored') && botSil.includes('tailored')) {
    score += 10;
    notes.push('Sartorially unified tailored silhouette');
  } else if (topSil.includes('boxy') && botSil.includes('straight')) {
    score += 8;
    notes.push('Modern boxy cut rests cleanly above classic straight-leg lines');
  }

  return { score: Math.min(100, score), notes };
}

// =============================================================================
// 6. PERSONAL STYLE AESTHETIC ALIGNMENT
// =============================================================================

export function evaluatePersonalStyle(top, bottom, shoes, accessory = null, styleTarget = null, preferences = {}) {
  let styles = [];
  if (styleTarget && styleTarget !== 'No Preference' && styleTarget !== 'All') {
    // Current explicit request has priority #3
    styles = [styleTarget.toLowerCase()];
  } else if (!styleTarget || styleTarget === 'All') {
    // Priority #4: Fallback to saved personal preferences ONLY when current request does NOT specify a preference
    styles = (preferences.preferred_styles || []).map(s => s.toLowerCase());
  }
  // When styleTarget === 'No Preference', styles is [] -> treated as completely neutral for current request!

  if (styles.length === 0) {
    return { score: 85, note: 'Contemporary versatile styling' };
  }

  const items = [top, bottom, shoes];
  if (accessory) items.push(accessory);

  let matchPoints = 0;
  const matchedStyles = new Set();

  for (const targetStyle of styles) {
    for (const item of items) {
      const itemStyle = (item.style || '').toLowerCase();
      const itemName = (item.name || '').toLowerCase();
      const itemSil = (item.silhouette || '').toLowerCase();

      if (itemStyle.includes(targetStyle) || itemName.includes(targetStyle)) {
        matchPoints += 8;
        matchedStyles.add(targetStyle);
      }

      // Keyword heuristics
      if (targetStyle === 'minimalist' && COLOR_FAMILIES.cool_neutrals.has(normalizeColor(item.color))) {
        matchPoints += 4;
        matchedStyles.add('minimalist');
      }
      if (targetStyle === 'old money' && (itemName.includes('linen') || itemName.includes('cashmere') || itemName.includes('polo') || itemName.includes('loafer'))) {
        matchPoints += 6;
        matchedStyles.add('old money');
      }
      if (targetStyle === 'streetwear' && (itemSil.includes('boxy') || itemSil.includes('oversized') || itemName.includes('sneaker') || itemName.includes('cargo'))) {
        matchPoints += 6;
        matchedStyles.add('streetwear');
      }
    }
  }

  const score = Math.min(100, 75 + matchPoints);
  const matchedList = Array.from(matchedStyles);
  const note = matchedList.length > 0
    ? `Curated to reflect ${matchedList.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')} aesthetic`
    : 'Versatile style alignment';

  return { score, note, matchedStyles: matchedList };
}

// =============================================================================
// 7. COMPOSITION & ACCESSORY COORDINATION
// =============================================================================

export function findOptimalAccessory(top, bottom, shoes, accessories, weather, occasion, preferences) {
  if (!accessories || accessories.length === 0) return null;

  const occ = (occasion || 'Casual').toLowerCase();
  let bestAccessory = null;
  let bestScore = -1;

  for (const acc of accessories) {
    const accWeather = evaluateWeatherSuitability(acc, weather);
    if (!accWeather.valid) continue;

    const accOcc = (acc.occasion || 'All Occasions').toLowerCase();
    if (accOcc !== 'all occasions' && accOcc !== occ) continue;

    // Evaluate synergy
    let synergy = 70;
    const isFormalOcc = occ === 'formal' || occ === 'business formal';
    const accSub = (acc.sub_category || '').toLowerCase();

    // Ties belong with collared shirts/formal tops
    if (accSub.includes('tie') || accSub.includes('pocket square')) {
      if (!isFormalOcc && occ !== 'smart casual' && occ !== 'work') continue; // Do not put ties on gym or casual beachwear!
      synergy += 15;
    }

    // Beanies and heavy scarves in hot weather should be skipped
    if ((accSub.includes('beanie') || accSub.includes('scarf')) && weather.toLowerCase() === 'hot') {
      continue;
    }

    // Belts coordinate with footwear
    if (accSub.includes('belt')) {
      const colorPair = evaluatePairHarmony(acc.color, shoes.color);
      if (colorPair.harmonious) synergy += 14;
    }

    // Color harmony
    const colorEval = evaluateEnsembleColorCoordination(top, bottom, shoes, acc, preferences);
    if (!colorEval.valid) continue;

    synergy += (colorEval.score * 0.2);

    if (synergy > bestScore) {
      bestScore = synergy;
      bestAccessory = acc;
    }
  }

  // Only attach accessory if synergy is genuinely additive (score >= 82)
  return bestScore >= 82 ? bestAccessory : null;
}

// =============================================================================
// 8. EXPLAINABLE SCORING SYSTEM WITH BREAKDOWN
// =============================================================================

export const SCORING_WEIGHTS = {
  color_harmony: 0.25,
  weather_temperature: 0.22,
  occasion_formality: 0.20,
  color_preferences: 0.12,
  personal_style: 0.10,
  fit_silhouette: 0.06,
  fabric_materials: 0.03,
  season: 0.02
};

export function computeOutfitScore({
  top,
  bottom,
  shoes,
  accessory,
  weather,
  occasion,
  season,
  preferredFit,
  preferredStyle,
  preferredColor,
  preferences = {},
  recentSaved = [],
  topWeather: inTopWeather = null,
  botWeather: inBotWeather = null,
  shoeWeather: inShoeWeather = null,
  occasionRes: inOccasionRes = null
}) {
  // 1. Component evaluations
  const colorRes = evaluateEnsembleColorCoordination(top, bottom, shoes, accessory, preferences);
  const topWeather = inTopWeather || evaluateWeatherSuitability(top, weather);
  const botWeather = inBotWeather || evaluateWeatherSuitability(bottom, weather);
  const shoeWeather = inShoeWeather || evaluateWeatherSuitability(shoes, weather);
  const weatherScore = Math.round((topWeather.score + botWeather.score + shoeWeather.score) / 3);

  const occasionRes = inOccasionRes || evaluateOccasionFormality(top, bottom, shoes, occasion);
  const styleRes = evaluatePersonalStyle(top, bottom, shoes, accessory, preferredStyle, preferences);
  const fitRes = evaluateFitAndSilhouette(top, bottom, preferredFit);

  const topSeason = evaluateSeasonSuitability(top, season);
  const botSeason = evaluateSeasonSuitability(bottom, season);
  const shoeSeason = evaluateSeasonSuitability(shoes, season);
  const seasonScore = Math.round((topSeason.score + botSeason.score + shoeSeason.score) / 3);

  // Fabric synergy score
  const topFab = inspectFabric(top.fabric);
  const botFab = inspectFabric(bottom.fabric);
  const fabricScore = Math.min(100, Math.round(75 + (topFab.breathability + botFab.breathability)));

  // Color preferences component with strict priority:
  // Priority #1: Explicit exclusions (handled via effectivePreferences.disliked_colors)
  // Priority #3: Current request's preferredColor
  // Priority #4: Fallback to saved favorite colors ONLY when request is unspecified (neither chosen nor 'No Preference')
  const isExplicitNoPref = (preferredColor === 'No Preference');
  const isColorSpecified = Boolean(preferredColor && preferredColor !== 'No Preference' && preferredColor !== 'All');
  const targetColor = isColorSpecified ? normalizeColor(preferredColor) : null;

  const favColors = (!isExplicitNoPref && !isColorSpecified)
    ? (preferences.favorite_colors || []).map(c => normalizeColor(c))
    : [];

  // Immunize targetColor so current explicit choice is never penalized by an older saved preference
  const disColors = (preferences.disliked_colors || [])
    .map(c => normalizeColor(c))
    .filter(c => c !== targetColor);

  const allColors = [top.color, bottom.color, shoes.color].map(c => normalizeColor(c));
  if (accessory) allColors.push(normalizeColor(accessory.color));

  let prefColorScore = 75;

  if (targetColor) {
    if (allColors.includes(targetColor)) {
      prefColorScore += 22; // Direct boost for containing the requested color
    }
  } else if (favColors.length > 0 && allColors.some(c => favColors.includes(c))) {
    prefColorScore += 12; // Fallback guidance for saved favorite colors
  }

  if (allColors.some(c => disColors.includes(c))) {
    prefColorScore -= 20; // Penalty for disliked color
  }
  prefColorScore = Math.max(30, Math.min(100, prefColorScore));

  // History penalty
  let historyPenalty = 0;
  if (Array.isArray(recentSaved) && recentSaved.length > 0) {
    const wasRecentlySaved = recentSaved.some(
      s => s.top_id === top.id && s.bottom_id === bottom.id && s.shoes_id === shoes.id
    );
    if (wasRecentlySaved) historyPenalty = 10;
  }

  // Weighted total
  const breakdown = {
    colorHarmony: colorRes.score,
    weatherSuitability: weatherScore,
    occasionSuitability: occasionRes.score,
    personalStyle: styleRes.score,
    fitSilhouette: fitRes.score,
    seasonSuitability: seasonScore,
    fabricMaterial: fabricScore,
    colorPreferences: prefColorScore
  };

  const weightedSum =
    (breakdown.colorHarmony * SCORING_WEIGHTS.color_harmony) +
    (breakdown.weatherSuitability * SCORING_WEIGHTS.weather_temperature) +
    (breakdown.occasionSuitability * SCORING_WEIGHTS.occasion_formality) +
    (breakdown.personalStyle * SCORING_WEIGHTS.personal_style) +
    (breakdown.fitSilhouette * SCORING_WEIGHTS.fit_silhouette) +
    (breakdown.seasonSuitability * SCORING_WEIGHTS.season) +
    (breakdown.fabricMaterial * SCORING_WEIGHTS.fabric_materials) +
    (breakdown.colorPreferences * SCORING_WEIGHTS.color_preferences) -
    historyPenalty;

  // Multi-attribute compatibility index (0 to 100), directly derived from implemented weighted criteria
  // Represents algorithmic harmony across dress code, thermodynamics, color theory, and styling preferences
  const derivedScore = Math.max(0, Math.min(100, Math.round(weightedSum)));

  return {
    score: derivedScore,
    breakdown,
    colorRes,
    topWeather,
    botWeather,
    shoeWeather,
    occasionRes,
    styleRes,
    fitRes
  };
}

// =============================================================================
// 9. DYNAMIC, ITEM-SPECIFIC EXPLANATION GENERATOR
// =============================================================================

export function generateAccurateExplanation({
  top,
  bottom,
  shoes,
  accessory,
  weather,
  occasion,
  season,
  evalResult
}) {
  const sentences = [];

  // 1. Color Palette Rationale
  const { colorRes } = evalResult;
  if (colorRes.reasons && colorRes.reasons.length > 0) {
    sentences.push(colorRes.reasons[0] + '.');
  } else {
    sentences.push(`The ${top.color} and ${bottom.color} palette delivers clean, balanced contrast.`);
  }

  // 2. Weather & Material Thermodynamic Rationale
  const wea = (weather || 'Mild').toLowerCase();
  const topFab = top.fabric || 'cotton';
  const botFab = bottom.fabric || 'twill';

  if (wea === 'hot') {
    sentences.push(`Crafted with breathable ${topFab} and light ${botFab} to ensure cooling airflow in high temperatures.`);
  } else if (wea === 'cold') {
    sentences.push(`Layered with insulating ${topFab} and substantial ${botFab} for dependable cold-weather warmth.`);
  } else if (wea === 'rainy') {
    const shoWeather = evalResult.shoeWeather || evaluateWeatherSuitability(shoes, 'Rainy');
    const topWeather = evalResult.topWeather || evaluateWeatherSuitability(top, 'Rainy');

    if (shoWeather.tier === 'waterproof') {
      sentences.push(`Anchored by verified waterproof ${shoes.name}, providing an impermeable barrier against rainy conditions and puddles; practical footwear suited for wet weather.`);
    } else if (shoWeather.tier === 'water_resistant') {
      sentences.push(`Grounded by durable, water-resistant ${shoes.name} featuring traction lugs suited for wet streets and rainy weather.`);
    } else if (shoWeather.tier === 'canvas') {
      sentences.push(`Paired with ${shoes.name}; note that untreated canvas readily absorbs moisture in rainy weather; practical waterproof footwear is recommended.`);
    } else {
      sentences.push(`Paired with enclosed ${shoes.name}; provides surface splash shielding against rainy conditions, though untreated leather lacks dedicated waterproofing.`);
    }

    if (topWeather.note && topWeather.note.includes('Verified water-repellent')) {
      sentences.push(`Shielded by the ${top.name} with water-repellent fabrication to keep precipitation out.`);
    }
  } else {
    sentences.push(`Well-calibrated for Mild conditions with versatile, all-day transitional comfort.`);
  }

  // 3. Occasion & Dress Code Rationale
  const occ = (occasion || 'Casual').toLowerCase();
  if (occ.includes('formal') || occ.includes('work')) {
    sentences.push(`Tailored lines of the ${top.name} and ${bottom.name} fulfill professional and formal dress standards.`);
  } else if (occ.includes('smart casual')) {
    sentences.push(`The ${top.name} and ${bottom.name} strike an approachable yet polished smart casual balance.`);
  } else if (occ.includes('party')) {
    sentences.push(`Sophisticated textures and styling give this look an elevated, expressive party presence.`);
  } else if (occ.includes('sport')) {
    sentences.push(`Functional athletic construction with ${bottom.name} and supportive ${shoes.name} provides unrestricted mobility for physical activity.`);
  } else if (occ.includes('traditional')) {
    sentences.push(`Heritage styling of the ${top.name} honors traditional occasions with cultural grace.`);
  } else {
    sentences.push(`Effortlessly tuned for Casual everyday wear with relaxed yet intentional proportions.`);
  }

  // 4. Fit & Silhouette Rationale
  if (evalResult.fitRes?.notes && evalResult.fitRes.notes.length > 0) {
    sentences.push(evalResult.fitRes.notes[0] + '.');
  }

  // 5. Accessory Rationale
  if (accessory) {
    sentences.push(`Accented with the ${accessory.name} for an elevated, harmonious finishing touch.`);
  }

  return sentences.join(' ');
}

// =============================================================================
// 10. WARDROBE COMPLETENESS CHECK
// =============================================================================

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
    message = `You need at least 1 Top, 1 Bottom, and 1 pair of Shoes to generate complete outfits. Currently missing: ${missingCategories.join(', ')}.`;
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

// =============================================================================
// 11. CENTRALIZED PIPELINE RECOMMENDATION GENERATOR
// =============================================================================

export function generateOutfitRecommendations({
  items = [],
  weather = 'Mild',
  occasion = 'Casual',
  preferredColor = null,
  preferredStyle = null,
  season = 'All Seasons',
  preferredFit = 'All',
  strictOccasion = false,
  strictWeather = false,
  strictColorExclusion = false,
  excludedColors = [],
  preferences = {},
  recentSaved = [],
  alternativeTo = null,
  maxRecommendations = 5
}) {
  // Validate wardrobe completeness
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

  const normWeather = normalizeWeather(weather);
  const normOccasion = normalizeOccasion(occasion);

  // Resolve Preference Priority:
  // 1. Explicit exclusions for current request (excludedColors, strictColorExclusion).
  // 2. Current weather and occasion requirements (enforced during combinatorial loops).
  // 3. Optional color and style on recommendation page:
  //    - If 'No Preference', treat field as neutral (do NOT fall back to saved preferences).
  //    - If specific value, use it with priority and immunize against old saved disliked colors.
  // 4. Fallback to saved preferences ONLY when current request omitted preference (null / undefined).
  const isExplicitNoColorPref = (preferredColor === 'No Preference');
  const isExplicitColor = Boolean(preferredColor && preferredColor !== 'No Preference' && preferredColor !== 'All');
  const normPrefCol = isExplicitColor ? normalizeColor(preferredColor) : null;

  let effectiveFavColors = [];
  if (isExplicitColor) {
    effectiveFavColors = [normPrefCol];
  } else if (!isExplicitNoColorPref) {
    effectiveFavColors = [...(preferences.favorite_colors || [])].map(c => normalizeColor(c));
  }

  // Immunize user's active color choice from being rejected or penalized by an old saved preference
  const effectiveDislikedColors = [...(preferences.disliked_colors || []), ...excludedColors]
    .map(c => normalizeColor(c))
    .filter(c => c !== normPrefCol);

  const effectivePreferences = {
    ...preferences,
    favorite_colors: effectiveFavColors,
    disliked_colors: effectiveDislikedColors,
    preferred_styles: preferences.preferred_styles || [],
    strict_color_exclusion: strictColorExclusion || preferences.strict_color_exclusion
  };

  // Gender selection is removed; all wardrobe items are directly evaluated
  const tops = items.filter(i => i.category.toLowerCase() === 'top');
  const bottoms = items.filter(i => i.category.toLowerCase() === 'bottom');
  const shoes = items.filter(i => i.category.toLowerCase() === 'shoes');
  const accessories = items.filter(i => i.category.toLowerCase() === 'accessories');

  const candidateOutfits = [];

  // Generate valid combinations
  for (const top of tops) {
    const topWeather = evaluateWeatherSuitability(top, normWeather, strictWeather);
    if (!topWeather.valid) continue;

    for (const bottom of bottoms) {
      const botWeather = evaluateWeatherSuitability(bottom, normWeather, strictWeather);
      if (!botWeather.valid) continue;

      for (const shoe of shoes) {
        const shoeWeather = evaluateWeatherSuitability(shoe, normWeather, strictWeather);
        if (!shoeWeather.valid) continue;

        // Occasion validation
        const occasionEval = evaluateOccasionFormality(top, bottom, shoe, normOccasion, strictOccasion);
        if (!occasionEval.valid) continue;

        // Color coordination validation
        const colorEval = evaluateEnsembleColorCoordination(top, bottom, shoe, null, effectivePreferences);
        if (!colorEval.valid) continue;

        // Base evaluation without accessory for fast combinatorial ranking
        const evalResult = computeOutfitScore({
          top,
          bottom,
          shoes: shoe,
          accessory: null,
          weather: normWeather,
          occasion: normOccasion,
          season,
          preferredFit,
          preferredStyle,
          preferredColor,
          preferences: effectivePreferences,
          recentSaved,
          topWeather,
          botWeather,
          shoeWeather,
          occasionRes: occasionEval
        });

        candidateOutfits.push({
          top,
          bottom,
          shoes: shoe,
          accessory: null,
          weather: normWeather,
          occasion: normOccasion,
          season,
          score: evalResult.score,
          evalResult,
          topWeather,
          botWeather,
          shoeWeather,
          occasionEval
        });
      }
    }
  }

  // Sort candidates by base score descending
  candidateOutfits.sort((a, b) => b.score - a.score);

  // Take top candidates for optimal accessory refinement and explanation generation
  const candidateSlice = candidateOutfits.slice(0, 45);

  for (const candidate of candidateSlice) {
    let optimalAccessory = null;
    if (accessories && accessories.length > 0) {
      optimalAccessory = findOptimalAccessory(
        candidate.top,
        candidate.bottom,
        candidate.shoes,
        accessories,
        normWeather,
        normOccasion,
        effectivePreferences
      );
    }

    if (optimalAccessory) {
      candidate.accessory = optimalAccessory;
      candidate.evalResult = computeOutfitScore({
        top: candidate.top,
        bottom: candidate.bottom,
        shoes: candidate.shoes,
        accessory: optimalAccessory,
        weather: normWeather,
        occasion: normOccasion,
        season,
        preferredFit,
        preferredStyle,
        preferredColor,
        preferences: effectivePreferences,
        recentSaved,
        topWeather: candidate.topWeather,
        botWeather: candidate.botWeather,
        shoeWeather: candidate.shoeWeather,
        occasionRes: candidate.occasionEval
      });
      candidate.score = candidate.evalResult.score;
    }

    // Determine badge
    let harmonyBadge = 'Stylistically Harmonious';
    if (candidate.evalResult.breakdown.colorHarmony >= 90) harmonyBadge = 'Balanced Palette';
    else if (candidate.evalResult.breakdown.weatherSuitability >= 90) harmonyBadge = 'Climate Optimized';
    else if (candidate.evalResult.breakdown.occasionSuitability >= 90) harmonyBadge = 'Formally Refined';
    else if (candidate.evalResult.breakdown.fitSilhouette >= 90) harmonyBadge = 'Proportionally Tuned';

    const explanation = generateAccurateExplanation({
      top: candidate.top,
      bottom: candidate.bottom,
      shoes: candidate.shoes,
      accessory: candidate.accessory,
      weather: normWeather,
      occasion: normOccasion,
      season,
      evalResult: candidate.evalResult
    });

    const outfitId = `outfit-${candidate.top.id}-${candidate.bottom.id}-${candidate.shoes.id}${candidate.accessory ? `-${candidate.accessory.id}` : ''}`;

    candidate.id = outfitId;
    candidate.score_breakdown = candidate.evalResult.breakdown;
    candidate.harmony_badge = harmonyBadge;
    candidate.explanation = explanation;
    candidate.highlights = [
      candidate.topWeather.note,
      candidate.occasionEval.note,
      ...(candidate.evalResult.colorRes.reasons || []),
      ...(candidate.evalResult.fitRes.notes || [])
    ].filter(Boolean);
  }

  // Re-sort candidate slice after accessory scoring
  candidateSlice.sort((a, b) => b.score - a.score);

  // Filter out alternativeTo if specified
  const pool = alternativeTo ? candidateSlice.filter(c => c.id !== alternativeTo) : candidateSlice;

  // Multi-tiered diversity ranking (ensures visual variety across top outfits)
  const selectedOutfits = [];
  const usedTops = new Set();
  const usedBottoms = new Set();
  const usedShoes = new Set();
  const usedCombos = new Set();

  // Tier 1: Distinct Top AND Distinct Bottom
  for (const outfit of pool) {
    if (selectedOutfits.length >= maxRecommendations) break;
    const comboKey = `${outfit.top.id}_${outfit.bottom.id}_${outfit.shoes.id}`;
    if (usedCombos.has(comboKey)) continue;

    if (!usedTops.has(outfit.top.id) && !usedBottoms.has(outfit.bottom.id)) {
      selectedOutfits.push(outfit);
      usedCombos.add(comboKey);
      usedTops.add(outfit.top.id);
      usedBottoms.add(outfit.bottom.id);
      usedShoes.add(outfit.shoes.id);
    }
  }

  // Tier 2: Distinct Top OR Distinct Bottom
  if (selectedOutfits.length < maxRecommendations) {
    for (const outfit of pool) {
      if (selectedOutfits.length >= maxRecommendations) break;
      const comboKey = `${outfit.top.id}_${outfit.bottom.id}_${outfit.shoes.id}`;
      if (usedCombos.has(comboKey)) continue;

      if (!usedTops.has(outfit.top.id) || !usedBottoms.has(outfit.bottom.id)) {
        selectedOutfits.push(outfit);
        usedCombos.add(comboKey);
        usedTops.add(outfit.top.id);
        usedBottoms.add(outfit.bottom.id);
        usedShoes.add(outfit.shoes.id);
      }
    }
  }

  // Tier 3: Fill from top scoring distinct combos
  if (selectedOutfits.length < maxRecommendations) {
    for (const outfit of pool) {
      if (selectedOutfits.length >= maxRecommendations) break;
      const comboKey = `${outfit.top.id}_${outfit.bottom.id}_${outfit.shoes.id}`;
      if (!usedCombos.has(comboKey)) {
        selectedOutfits.push(outfit);
        usedCombos.add(comboKey);
      }
    }
  }

  if (selectedOutfits.length === 0) {
    let fallbackNotice = `No outfit combinations satisfied the requirements for ${normWeather} weather and ${normOccasion} occasion.`;
    if (normOccasion === 'Traditional') {
      fallbackNotice = 'No traditional cultural garments (such as a Kurta or Nehru Jacket) are available in your wardrobe for Traditional occasions. Try adding a traditional piece or selecting Smart Casual.';
    } else if (normOccasion === 'Sports / Active') {
      fallbackNotice = 'No dedicated athletic bottoms (running shorts, track pants, athletic shorts) or athletic trainers were found in your wardrobe for Sports / Active wear. Try adding athletic gear or selecting Casual.';
    } else if (normWeather === 'Rainy') {
      fallbackNotice = 'No rain-appropriate or water-resistant footwear was found in your wardrobe for Rainy weather. Try selecting Mild weather or adding water-resistant enclosed footwear.';
    } else if (normOccasion === 'Work / Formal') {
      fallbackNotice = 'No formal dress shirts, trousers, or dress shoes were found in your closet for Work / Formal occasion. Try adding formal pieces or selecting Smart Casual.';
    }

    return {
      success: true,
      canGenerate: true,
      message: fallbackNotice,
      counts: completeness.counts,
      recommendations: []
    };
  }

  return {
    success: true,
    canGenerate: true,
    message: `Generated ${selectedOutfits.length} tailored outfit recommendations for ${normWeather} climate and ${normOccasion} occasion.`,
    recommendations: selectedOutfits
  };
}
