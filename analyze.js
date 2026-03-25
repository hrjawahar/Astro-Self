const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const BENEFICS = new Set(["Jupiter", "Venus", "Mercury", "Moon"]);
const MALEFICS = new Set(["Saturn", "Mars", "Rahu", "Ketu", "Sun"]);
const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const signLord = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};
const planetOwnSigns = {
  Sun: ["Leo"], Moon: ["Cancer"], Mars: ["Aries", "Scorpio"], Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"], Venus: ["Taurus", "Libra"], Saturn: ["Capricorn", "Aquarius"],
  Rahu: [], Ketu: []
};
const planetExalt = { Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra" };
const planetDebil = { Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries" };

export async function onRequestPost({ request }) {
  try {
    const payload = await request.json();
    validatePayload(payload);
    const d1 = normalizeChart(payload.d1);
    const d9 = normalizeChart(payload.d9);

    const global = deriveGlobal(d1, d9);
    const domains = [
      deriveIdentity(d1, d9, global),
      deriveWealth(d1, d9, global),
      deriveMarriage(d1, d9, global),
      deriveCareer(d1, d9, global),
      deriveEMA(d1, d9, global),
      deriveHealth(d1, d9, global)
    ];

    const summary = summarize(domains, global);
    const triggeredRules = [
      ...global.reasons,
      ...domains.flatMap(domain => domain.reasons.slice(0, 2).map(reason => `${domain.title}: ${reason}`))
    ];

    return json({ generatedAt: new Date().toISOString(), summary, triggeredRules, domains });
  } catch (error) {
    return json({ error: error.message || 'Unknown error' }, 400);
  }
}

function validatePayload(payload) {
  if (!payload?.d1?.lagnaSign || !payload?.d9?.lagnaSign) throw new Error('Both D1 and D9 lagna signs are required.');
  if (!payload?.d1?.houses || !payload?.d9?.houses) throw new Error('Both D1 and D9 houses are required.');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function normalizeChart(chart) {
  const lagnaIndex = SIGNS.indexOf(chart.lagnaSign);
  const houseSigns = {};
  const planetsByHouse = {};
  const planetHouse = {};
  for (let h = 1; h <= 12; h += 1) {
    houseSigns[h] = SIGNS[(lagnaIndex + h - 1) % 12];
    const input = chart.houses[h] || chart.houses[String(h)] || [];
    planetsByHouse[h] = input;
    input.forEach(planet => { planetHouse[planet] = h; });
  }
  const houseLords = {};
  for (let h = 1; h <= 12; h += 1) houseLords[h] = signLord[houseSigns[h]];
  return { lagnaSign: chart.lagnaSign, houseSigns, planetsByHouse, planetHouse, houseLords };
}

function deriveGlobal(d1, d9) {
  const reasons = [];
  const d1LagnaLord = d1.houseLords[1];
  const d9LagnaLord = d9.houseLords[1];
  const d1LagnaStrength = planetStrength(d1, d1LagnaLord);
  const d9LagnaStrength = planetStrength(d9, d9LagnaLord);
  const moonAfflicted = isAfflicted(d1, 'Moon') || isAfflicted(d9, 'Moon');
  const global = {
    lagnaModifier: 0,
    moonAfflicted,
    reasons
  };
  if (d1LagnaStrength <= 0 && d9LagnaStrength <= 0) {
    global.lagnaModifier = -1;
    reasons.push('Global G1: Lagna lord is weak in both D1 and D9, so positive scores are reduced by one level.');
  } else if (d1LagnaStrength <= 0 && d9LagnaStrength > 0) {
    reasons.push('Global G1: Lagna is weak in D1 but supported in D9, so later stabilization is possible.');
  }
  if (moonAfflicted) reasons.push('Global G2: Moon shows affliction, so emotional instability is added to relationships, career, and health.');
  return global;
}

function deriveIdentity(d1, d9, global) {
  const d1LagnaLord = d1.houseLords[1];
  const d9LagnaLord = d9.houseLords[1];
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];

  if (planetStrength(d1, d1LagnaLord) > 0) { d1Score += 2; reasons.push('I1: Lagna lord is strong in D1.'); }
  if (hasBeneficInHouse(d1, 1)) { d1Score += 1; reasons.push('I1: Benefic influence supports the 1st house.'); }
  if (isInDusthana(d1, d1LagnaLord) && isAfflicted(d1, d1LagnaLord)) { d1Score -= 2; reasons.push('I2: Lagna lord is in 6/8/12 and afflicted in D1.'); flags.push('identity instability'); }
  if (planetStrength(d9, d9LagnaLord) > 0) { d9Score += 2; reasons.push('I3: D9 Lagna lord is strong, improving later-life maturity.'); }
  if (global.moonAfflicted) { d1Score -= 1; d9Score -= 1; reasons.push('I4: Moon affliction adds emotional variability.'); flags.push('emotional variability'); }

  return finalizeDomain('Identity & Personality', d1Score, d9Score, reasons, flags, global);
}

function deriveWealth(d1, d9, global) {
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];
  const secondLord = d1.houseLords[2];
  const eleventhLord = d1.houseLords[11];
  if (planetStrength(d1, secondLord) > 0 && planetStrength(d1, eleventhLord) > 0) { d1Score += 2; reasons.push('W1: 2nd and 11th lords are both strong in D1.'); }
  if (linkedToHouses(d1, secondLord, [9,10,11]) || linkedToHouses(d1, eleventhLord, [2,9,10])) { d1Score += 1; reasons.push('W2: Wealth houses are linked to support houses.'); }
  if (isAfflictedHouse(d1, 2)) { d1Score -= 2; reasons.push('W5: 2nd house is afflicted, adding pressure on wealth and family continuity.'); flags.push('family tension'); }
  if (planetStrength(d9, secondLord) > 0 || planetStrength(d9, eleventhLord) > 0) { d9Score += 2; reasons.push('W4: D9 wealth lords support long-term accumulation.'); }
  if (planetStrength(d1, secondLord) > 0 && planetStrength(d1, eleventhLord) > 0 && d9Score <= 0) { reasons.push('W3: D1 wealth promise is stronger than D9, so income may not fully convert into retained savings.'); flags.push('savings leakage'); }
  return finalizeDomain('Wealth & Family', d1Score, d9Score, reasons, flags, global);
}

function deriveMarriage(d1, d9, global) {
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];
  const seventhLord = d1.houseLords[7];
  if (planetStrength(d1, seventhLord) > 0) { d1Score += 1; reasons.push('M1: 7th lord is strong in D1.'); }
  if (planetStrength(d1, 'Venus') > 0) { d1Score += 1; reasons.push('M1: Venus is supportive in D1.'); }
  if (isInDusthana(d1, seventhLord)) { d1Score -= 2; reasons.push('M2: 7th lord is in 6/8/12 in D1.'); flags.push('relationship vulnerability'); }
  if (isAfflicted(d9, 'Venus')) { d9Score -= 2; reasons.push('M4: Venus is weak or afflicted in D9.'); flags.push('emotional dissatisfaction'); }
  const d9SeventhLord = d9.houseLords[7];
  if (planetStrength(d9, d9SeventhLord) > 0) { d9Score += 2; reasons.push('M3: D9 7th lord supports sustainability.'); }
  if (isAfflictedHouse(d1, 8)) { d1Score -= 1; reasons.push('M5: 8th house shows stress, reducing bond durability.'); flags.push('durability weak'); }
  if (global.moonAfflicted) { d1Score -= 1; reasons.push('M-global: Moon affliction adds emotional instability to relationship outcomes.'); }
  return finalizeDomain('Marriage & Relationship', d1Score, d9Score, reasons, flags, global);
}

function deriveCareer(d1, d9, global) {
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];
  const tenthLord = d1.houseLords[10];
  const tenthLordHouse = d1.planetHouse[tenthLord];
  if ([6,10,11].includes(tenthLordHouse)) { d1Score += 2; reasons.push('C1: 10th lord is in 6, 10, or 11, supporting career direction.'); }
  if ([8,12].includes(tenthLordHouse) && isAfflicted(d1, tenthLord)) { d1Score -= 2; reasons.push('C2: 10th lord is in 8 or 12 and afflicted.'); flags.push('career instability'); }
  if (planetStrength(d1, 'Sun') > 0 && [10,1,9].includes(d1.planetHouse['Sun'])) { d1Score += 1; reasons.push('C3: Sun supports authority or public positioning.'); }
  if (planetStrength(d1, 'Saturn') > 0) { d1Score += 1; reasons.push('C4: Saturn is strong enough to support disciplined growth.'); }
  const d9TenthLord = d9.houseLords[10];
  if (planetStrength(d9, d9TenthLord) > 0) { d9Score += 2; reasons.push('C6: D9 supports long-term professional consolidation.'); }
  if (global.moonAfflicted) { d1Score -= 1; reasons.push('C-global: Moon affliction adds emotional fluctuation to work and role consistency.'); flags.push('career mood swings'); }
  return finalizeDomain('Career & Earning', d1Score, d9Score, reasons, flags, global);
}

function deriveEMA(d1, d9, global) {
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];
  const attractionHouses = [5,7,8,12];
  const triggerPlanets = ['Venus','Mars'];
  const d1Triggers = triggerPlanets.reduce((count, planet) => count + (attractionHouses.includes(d1.planetHouse[planet]) ? 1 : 0), 0)
    + ((hasInfluenceOnPlanet(d1, 'Rahu', 'Venus') || influencesHouse(d1, 'Rahu', 7)) ? 1 : 0)
    + ((hasLink(d1, 'Moon', 'Venus')) ? 1 : 0);
  if (attractionHouses.includes(d1.planetHouse['Venus']) || attractionHouses.includes(d1.planetHouse['Mars'])) {
    d1Score += 1; reasons.push('E1: Venus or Mars sits in a romance/secret/intimacy house.');
  }
  if (hasInfluenceOnPlanet(d1, 'Rahu', 'Venus') || influencesHouse(d1, 'Rahu', 7)) {
    d1Score += 1; reasons.push('E2: Rahu influences Venus or the 7th house, creating unconventional pull.');
  }
  if (hasLink(d1, 'Moon', 'Venus')) {
    d1Score += 1; reasons.push('E3: Moon and Venus are linked, increasing emotional bonding risk.');
  }
  if (isAfflicted(d9, 'Venus') || isAfflictedHouse(d9, 7)) {
    d9Score -= 2; reasons.push('E4: D9 restraint is weak due to Venus or 7th house stress.');
    flags.push('restraint weak');
  } else if (planetStrength(d9, 'Venus') > 0) {
    d9Score += 1; reasons.push('E4: D9 Venus shows better control and restraint.');
  }
  let verdict = 'Low';
  if (d1Triggers >= 2 && d9Score <= 0) verdict = 'High Risk';
  else if (d1Triggers >= 2) verdict = 'Medium';
  else if (d1Triggers === 1) verdict = 'Mixed';
  else verdict = 'Low';
  if (d1Triggers < 2) reasons.push('EMA threshold safeguard: less than two D1 triggers, so risk is not escalated.');
  return {
    title: 'EMA Risk',
    d1Strength: describeScore(d1Score),
    d9Strength: describeScore(d9Score),
    flags,
    verdict,
    reasons: applyGlobalReasons(reasons, global, 'ema')
  };
}

function deriveHealth(d1, d9, global) {
  let d1Score = 0, d9Score = 0;
  const reasons = [], flags = [];
  const lagnaLord = d1.houseLords[1];
  if (planetStrength(d1, lagnaLord) > 0) { d1Score += 2; reasons.push('H1: Lagna lord supports baseline vitality.'); }
  if (isAfflictedHouse(d1, 6)) { d1Score -= 2; reasons.push('H2: 6th house is afflicted, indicating disease vulnerability.'); flags.push('disease vulnerability'); }
  if (isAfflictedHouse(d1, 8)) { d1Score -= 1; reasons.push('H3: 8th house is pressured, increasing chronic tendency.'); flags.push('chronic tendency'); }
  if (planetStrength(d9, d9.houseLords[1]) > 0) { d9Score += 2; reasons.push('H4: D9 Lagna support improves recovery capacity.'); }
  if (global.moonAfflicted) { d1Score -= 1; reasons.push('H5: Moon affliction increases stress-related health patterns.'); flags.push('stress-linked issues'); }
  return finalizeDomain('Health', d1Score, d9Score, reasons, flags, global);
}

function finalizeDomain(title, d1Score, d9Score, reasons, flags, global) {
  const adjustedD1 = d1Score + global.lagnaModifier;
  const verdict = classify(adjustedD1, d9Score);
  return {
    title,
    d1Strength: describeScore(adjustedD1),
    d9Strength: describeScore(d9Score),
    flags,
    verdict,
    reasons: applyGlobalReasons(reasons, global, title.toLowerCase())
  };
}

function applyGlobalReasons(reasons, global, domainKey) {
  const arr = [...reasons];
  if (global.moonAfflicted && ['marriage & relationship','career & earning','health'].includes(domainKey)) {
    arr.push('Global Moon modifier has been applied to this domain.');
  }
  return arr;
}

function summarize(domains, global) {
  const stableCount = domains.filter(d => String(d.verdict).includes('Stable') || String(d.verdict).includes('Strong')).length;
  const vulnerableCount = domains.filter(d => String(d.verdict).includes('Vulnerable') || String(d.verdict).includes('Weak') || String(d.verdict).includes('High')).length;
  let overallPattern = 'Mixed profile with domain-level variation.';
  if (stableCount >= 4) overallPattern = 'Broadly supportive profile with multiple stable domains.';
  if (vulnerableCount >= 3) overallPattern = 'Pressure-heavy profile with multiple vulnerable domains.';
  return {
    overallPattern,
    earlyLife: global.lagnaModifier < 0 ? 'Early life may feel uneven or effort-heavy.' : 'Early life shows moderate to strong directional promise.',
    laterLife: domains.filter(d => d.d9Strength === 'Strong').length >= 3 ? 'Later life shows stronger consolidation and maturity.' : 'Later life remains mixed and needs conscious handling.'
  };
}

function describeScore(score) {
  if (score >= 2) return 'Strong';
  if (score === 1) return 'Moderate';
  if (score === 0) return 'Mixed';
  return 'Weak';
}

function classify(d1Score, d9Score) {
  if (d1Score >= 2 && d9Score >= 2) return 'Strong & Stable';
  if (d1Score >= 2 && d9Score <= 0) return 'Strong but Temporary';
  if (d1Score <= 0 && d9Score >= 2) return 'Delayed but Improving';
  if (d1Score <= 0 && d9Score <= 0) return 'Vulnerable';
  return 'Mixed';
}

function planetStrength(chart, planet) {
  const house = chart.planetHouse[planet];
  if (!house) return -1;
  const sign = chart.houseSigns[house];
  let score = 0;
  if (planetOwnSigns[planet]?.includes(sign)) score += 2;
  if (planetExalt[planet] === sign) score += 2;
  if (planetDebil[planet] === sign) score -= 2;
  if ([1,5,9,10,11].includes(house)) score += 1;
  if ([6,8,12].includes(house)) score -= 1;
  if (isAfflicted(chart, planet)) score -= 1;
  return score;
}

function isInDusthana(chart, planet) {
  return [6,8,12].includes(chart.planetHouse[planet]);
}

function isAfflicted(chart, planet) {
  const house = chart.planetHouse[planet];
  if (!house) return false;
  const coTenants = chart.planetsByHouse[house].filter(p => p !== planet);
  return coTenants.some(p => MALEFICS.has(p));
}

function isAfflictedHouse(chart, house) {
  return (chart.planetsByHouse[house] || []).some(p => MALEFICS.has(p));
}

function hasBeneficInHouse(chart, house) {
  return (chart.planetsByHouse[house] || []).some(p => BENEFICS.has(p));
}

function linkedToHouses(chart, planet, houses) {
  const h = chart.planetHouse[planet];
  if (!h) return false;
  if (houses.includes(h)) return true;
  return houses.some(target => chart.houseLords[target] === planet);
}

function hasLink(chart, p1, p2) {
  return chart.planetHouse[p1] && chart.planetHouse[p1] === chart.planetHouse[p2];
}

function hasInfluenceOnPlanet(chart, influencer, target) {
  if (!chart.planetHouse[influencer] || !chart.planetHouse[target]) return false;
  if (chart.planetHouse[influencer] === chart.planetHouse[target]) return true;
  return influencesHouse(chart, influencer, chart.planetHouse[target]);
}

function influencesHouse(chart, planet, targetHouse) {
  const from = chart.planetHouse[planet];
  if (!from) return false;
  const aspects = aspectHouses(from, planet);
  return aspects.includes(targetHouse);
}

function aspectHouses(fromHouse, planet) {
  const wrap = (n) => ((n - 1) % 12) + 1;
  const base = [wrap(fromHouse + 6)];
  if (planet === 'Mars') return [...base, wrap(fromHouse + 3), wrap(fromHouse + 7)];
  if (planet === 'Jupiter' || planet === 'Rahu' || planet === 'Ketu') return [...base, wrap(fromHouse + 4), wrap(fromHouse + 8)];
  if (planet === 'Saturn') return [...base, wrap(fromHouse + 2), wrap(fromHouse + 9)];
  return base;
}
