const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const REFERENCE_SECTIONS = [
  {
    titleKey: "refCorePrinciples",
    lines: {
      en: [
        "D1 shows external life events and promise.",
        "D9 shows maturity, durability, and later-life consolidation.",
        "Strong D1 + Strong D9 = Stable result.",
        "Strong D1 + Weak D9 = Temporary or unstable result.",
        "Weak D1 + Strong D9 = Delayed or late-blooming result.",
        "Weak D1 + Weak D9 = Chronic challenge or vulnerability."
      ],
      ta: [
        "D1 வெளிப்புற வாழ்க்கை நிகழ்வுகள் மற்றும் அடிப்படை வாக்குறுதியைக் காட்டுகிறது.",
        "D9 முதிர்ச்சி, நீடிப்பு, மற்றும் பிற்கால வாழ்க்கை நிலைத்தன்மையைக் காட்டுகிறது.",
        "வலுவான D1 + வலுவான D9 = நிலையான பலன்.",
        "வலுவான D1 + பலவீனமான D9 = தற்காலிக அல்லது நிலைகுலையும் பலன்.",
        "பலவீனமான D1 + வலுவான D9 = தாமதமான அல்லது பின்னர் மலரும் பலன்.",
        "பலவீனமான D1 + பலவீனமான D9 = நீடித்த சவால் அல்லது பலவீனம்."
      ]
    }
  },
  {
    titleKey: "refFoundationalChecks",
    lines: {
      en: [
        "Always start with Lagna and Lagna lord in D1 and D9.",
        "Check Moon before domain judgments because emotional resilience modifies outcomes.",
        "House lord carries more weight than occupant.",
        "D9 has final say on sustainability in marriage, long-term identity, and durability of outcomes."
      ],
      ta: [
        "எப்போதும் D1 மற்றும் D9 இல் லக்னம் மற்றும் லக்னாதிபதியிலிருந்து தொடங்கவும்.",
        "துறை முடிவுகளுக்கு முன் சந்திரனைப் பார்க்கவும்; உணர்ச்சி நிலைத்தன்மை முடிவுகளை மாற்றும்.",
        "பாவ அதிபதிக்கு, அந்த பாவத்தில் அமர்ந்திருப்பதைக் காட்டிலும் அதிக முக்கியத்துவம் உண்டு.",
        "திருமணம், நீண்டகால அடையாளம், மற்றும் பலன்களின் நீடிப்பில் D9 இறுதி தீர்மானத்தைக் கொடுக்கும்."
      ]
    }
  },
  {
    titleKey: "refHouseQuickReference",
    lines: {
      en: [
        "1 self and identity",
        "2 wealth and family",
        "5 romance, intelligence, children",
        "6 disease, service, conflict",
        "7 marriage and partnerships",
        "8 secrets, transformation, longevity of bond",
        "10 career and reputation",
        "11 gains and networks",
        "12 loss, bed life, withdrawal"
      ],
      ta: [
        "1 சுயம் மற்றும் அடையாளம்",
        "2 செல்வம் மற்றும் குடும்பம்",
        "5 காதல், புத்திசாலித்தனம், பிள்ளைகள்",
        "6 நோய், சேவை, மோதல்",
        "7 திருமணம் மற்றும் கூட்டாண்மை",
        "8 ரகசியம், மாற்றம், உறவு நீடிப்பு",
        "10 தொழில் மற்றும் புகழ்",
        "11 லாபம் மற்றும் வலையமைப்பு",
        "12 இழப்பு, படுக்கை வாழ்க்கை, விலகல்"
      ]
    }
  },
  {
    titleKey: "refPlanetKarakas",
    lines: {
      en: [
        "Sun = identity, authority, recognition",
        "Moon = emotions, mind, habits",
        "Mars = drive, conflict, courage",
        "Mercury = analysis, speech, trade",
        "Jupiter = wisdom, prosperity, expansion",
        "Venus = love, harmony, pleasure",
        "Saturn = delay, karma, responsibility",
        "Rahu = obsession, experimentation, material hunger",
        "Ketu = detachment, withdrawal, insight"
      ],
      ta: [
        "சூரியன் = அடையாளம், அதிகாரம், அங்கீகாரம்",
        "சந்திரன் = உணர்வுகள், மனம், பழக்கங்கள்",
        "செவ்வாய் = இயக்கம், மோதல், தைரியம்",
        "புதன் = பகுப்பாய்வு, பேச்சு, வாணிபம்",
        "குரு = ஞானம், வளம், விரிவு",
        "சுக்கிரன் = அன்பு, ஒற்றுமை, இன்பம்",
        "சனி = தாமதம், கர்மா, பொறுப்பு",
        "ராகு = பற்றுதல், சோதனை, பொருள் ஆசை",
        "கேது = விலகல், பின்வாங்கல், உள்ளுணர்வு"
      ]
    }
  },
  {
    titleKey: "refInterpretationWorkflow",
    lines: {
      en: [
        "1. Validate D1 and D9 input.",
        "2. Read Lagna and Moon.",
        "3. Read domain house lord, occupants, and aspects.",
        "4. Compare D1 promise with D9 sustainability.",
        "5. Apply conflict-resolution logic.",
        "6. Generate verdict and show triggered rules."
      ],
      ta: [
        "1. D1 மற்றும் D9 உள்ளீட்டைச் சரிபார்க்கவும்.",
        "2. லக்னம் மற்றும் சந்திரனைப் படிக்கவும்.",
        "3. துறை சார்ந்த பாவ அதிபதி, அமர்ந்த கிரகங்கள், பார்வைகளைப் படிக்கவும்.",
        "4. D1 வாக்குறுதியை D9 நீடிப்புடன் ஒப்பிடவும்.",
        "5. முரண்பாடு தீர்வு விதிகளைப் பயன்படுத்தவும்.",
        "6. முடிவை உருவாக்கி, தூண்டப்பட்ட விதிகளை காட்டவும்."
      ]
    }
  }
];

const signLord = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};
const I18N = {
  en: {
    eyebrow: "Rule-based browser app for manual D1/D9 interpretation",
    appTitle: "D1–D9 Life Pattern Analyzer",
    languageLabel: "Language",
    downloadReportBtn: "Download Report",
    resetBtn: "Reset",
    tabInput: "Input",
    tabInsights: "Insights",
    tabReference: "Reference Guide",
    howItWorks: "How this version works",
    d1ManualEntry: "D1 Manual Entry",
    d9ManualEntry: "D9 Manual Entry",
    lagnaSign: "Lagna Sign",
    validation: "Validation",
    generateInsights: "Generate Insights",
    nativeName: "Native Name",
    emaSensitive: "EMA (Sensitive)",
    quickVerdict: "Quick Verdict",
    summary: "Summary",
    confidenceScore: "Confidence Score",
    comparisonTitle: "D1–D9 Comparison",
    domainInsights: "Domain Insights",
    whyThisConclusion: "Why this conclusion",
    referenceGuide: "Reference Guide",
    summaryOverallPattern: "Overall pattern",
    summaryEarlyLife: "Early-life leaning",
    summaryLaterLife: "Later-life leaning",
    summaryGenerated: "Generated",
    confidenceHigh: "High confidence",
    confidenceModerate: "Moderate confidence",
    confidenceGuarded: "Guarded confidence",
    confidenceBasis: "Based on domain alignment, conflicting signals, and global modifiers.",
    comparisonDomain: "Domain",
    comparisonD1: "D1",
    comparisonD9: "D9",
    comparisonTrend: "Trend",
    comparisonFinalVerdict: "Final Verdict",
    quickRunPrompt: "Run analysis to view quick verdict.",
    summaryPrompt: "Run analysis to view summary.",
    confidencePrompt: "Confidence score will appear here.",
    comparisonPrompt: "Comparison table will appear here.",
    whyPrompt: "Triggered rules will appear here.",
    trendStable: "Stable",
    trendEarlyStrengthLaterFluctuation: "Early strength, later fluctuation",
    trendImprovesLater: "Improves later",
    trendPersistentChallenge: "Persistent challenge",
    trendMixedProgression: "Mixed progression",
    refCorePrinciples: "Core principles",
    refFoundationalChecks: "Foundational checks",
    refHouseQuickReference: "House quick reference",
    refPlanetKarakas: "Planet karakas",
    refInterpretationWorkflow: "Interpretation workflow",
    verdictIdentity: "Identity & Personality",
    verdictWealth: "Wealth & Family",
    verdictMarriage: "Marriage & Relationship",
    verdictCareer: "Career & Earning",
    verdictEMA: "EMA Risk",
    verdictHealth: "Health",
    strengthStrong: "Strong",
  strengthMixed: "Mixed",
  strengthWeak: "Weak",

verdictStable: "Strong & Stable",
verdictMixed: "Mixed",
verdictDelayed: "Delayed / Improves later",
verdictTemporary: "Temporary / Unstable",
verdictChallenging: "Challenging",

reportTitle: "D1-D9 LIFE PATTERN ANALYZER REPORT",
reportNative: "Native",
reportGenerated: "Generated At",
reportRules: "TRIGGERED RULES",
reportDomains: "DOMAIN INSIGHTS"
  },

  ta: {
    eyebrow: "கையேடு அடிப்படையிலான D1/D9 கைமுறை விளக்க பயன்பாடு",
    appTitle: "D1–D9 வாழ்க்கை வடிவியல் பகுப்பாய்வி",
    languageLabel: "மொழி",
    downloadReportBtn: "அறிக்கையை பதிவிறக்கு",
    resetBtn: "மீட்டமை",
    tabInput: "உள்ளீடு",
    tabInsights: "பார்வைகள்",
    tabReference: "குறிப்புக் கையேடு",
    howItWorks: "இந்த பதிப்பு எப்படி செயல்படுகிறது",
    d1ManualEntry: "D1 கைமுறை பதிவு",
    d9ManualEntry: "D9 கைமுறை பதிவு",
    lagnaSign: "லக்ன ராசி",
    validation: "சரிபார்ப்பு",
    generateInsights: "பார்வைகளை உருவாக்கு",
    nativeName: "பெயர்",
    emaSensitive: "EMA (உணர்வுசார்)",
    quickVerdict: "விரைவு முடிவு",
    summary: "சுருக்கம்",
    confidenceScore: "நம்பகத்தன்மை மதிப்பெண்",
    comparisonTitle: "D1–D9 ஒப்பீடு",
    domainInsights: "வாழ்க்கை துறை பார்வைகள்",
    whyThisConclusion: "இந்த முடிவிற்கான காரணம்",
    referenceGuide: "குறிப்புக் கையேடு",
    summaryOverallPattern: "மொத்த வடிவம்",
    summaryEarlyLife: "ஆரம்ப வாழ்க்கை போக்கு",
    summaryLaterLife: "பிற்கால வாழ்க்கை போக்கு",
    summaryGenerated: "உருவாக்கப்பட்ட நேரம்",
    confidenceHigh: "உயர் நம்பகத்தன்மை",
    confidenceModerate: "மிதமான நம்பகத்தன்மை",
    confidenceGuarded: "எச்சரிக்கையுடன் பயன்படுத்தவும்",
    confidenceBasis: "துறை ஒத்திசைவு, முரண்பட்ட சைகைகள், மற்றும் global modifiers அடிப்படையில்.",
    comparisonDomain: "துறை",
    comparisonD1: "D1",
    comparisonD9: "D9",
    comparisonTrend: "போக்கு",
    comparisonFinalVerdict: "இறுதி முடிவு",
    quickRunPrompt: "விரைவு முடிவைப் பார்க்க பகுப்பாய்வு இயக்கவும்.",
    summaryPrompt: "சுருக்கத்தைப் பார்க்க பகுப்பாய்வு இயக்கவும்.",
    confidencePrompt: "நம்பகத்தன்மை மதிப்பெண் இங்கே தோன்றும்.",
    comparisonPrompt: "ஒப்பீட்டு அட்டவணை இங்கே தோன்றும்.",
    whyPrompt: "தூண்டப்பட்ட விதிகள் இங்கே தோன்றும்.",
    trendStable: "நிலையானது",
    trendEarlyStrengthLaterFluctuation: "ஆரம்ப வலிமை, பின்னர் மாற்றம்",
    trendImprovesLater: "பிற்காலத்தில் மேம்படும்",
    trendPersistentChallenge: "தொடர்ச்சியான சவால்",
    trendMixedProgression: "கலப்பு முன்னேற்றம்",
    refCorePrinciples: "முக்கிய கொள்கைகள்",
    refFoundationalChecks: "அடிப்படை சரிபார்ப்புகள்",
    refHouseQuickReference: "பாவ விரைவு குறிப்பு",
    refPlanetKarakas: "கிரக காரகங்கள்",
    refInterpretationWorkflow: "விளக்க வேலைச்சுற்று",
    verdictIdentity: "அடையாளம் & தன்மை",
    verdictWealth: "செல்வம் & குடும்பம்",
    verdictMarriage: "திருமணம் & உறவு",
    verdictCareer: "தொழில் & வருமானம்",
    verdictEMA: "EMA அபாயம்",
    verdictHealth: "ஆரோக்கியம்",
    strengthStrong: "வலுவான",
strengthMixed: "கலப்பு",
strengthWeak: "பலவீனமான",

verdictStable: "வலுவான மற்றும் நிலையான",
verdictMixed: "கலப்பு",
verdictDelayed: "தாமதமாக மேம்படும்",
verdictTemporary: "தற்காலிக / நிலைகுலையும்",
verdictChallenging: "சவாலான",

reportTitle: "D1-D9 வாழ்க்கை வடிவியல் பகுப்பாய்வு அறிக்கை",
reportNative: "ஜாதகர்",
reportGenerated: "உருவாக்கப்பட்ட நேரம்",
reportRules: "தூண்டப்பட்ட விதிகள்",
reportDomains: "வாழ்க்கை துறை பார்வைகள்"
  }
};
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const validationBox = document.getElementById('validationBox');
const summaryBox = document.getElementById('summaryBox');
const whyBox = document.getElementById('whyBox');
const domainCards = document.getElementById('domainCards');
const quickVerdictGrid = document.getElementById('quickVerdictGrid');
const confidenceBox = document.getElementById('confidenceBox');
const comparisonTableWrap = document.getElementById('comparisonTableWrap');
const analyzeBtn = document.getElementById('analyzeBtn');
const downloadBtn = document.getElementById('downloadReportBtn');
const resetBtn = document.getElementById('resetBtn');
const languageToggle = document.getElementById('languageToggle');
function initSelect(id) {
  const select = document.getElementById(id);
  SIGNS.forEach(sign => {
    const opt = document.createElement('option');
    opt.value = sign;
    opt.textContent = sign;
    select.appendChild(opt);
  });
  select.value = 'Aries';
}

function createGrid(containerId, prefix) {
  const container = document.getElementById(containerId);
  for (let house = 1; house <= 12; house += 1) {
    const box = document.createElement('div');
    box.className = 'house-box';
    box.innerHTML = `
      <div><strong>House ${house}</strong></div>
      <label for="${prefix}-house-${house}">Planets (comma separated)</label>
      <textarea id="${prefix}-house-${house}" placeholder="e.g. Venus, Mars"></textarea>
    `;
    container.appendChild(box);
  }
}

function initReferenceGuide() {
  const wrap = document.getElementById('referenceGuide');
  const template = document.getElementById('accordionTemplate');
  const lang = getCurrentLang();

  wrap.innerHTML = '';

  REFERENCE_SECTIONS.forEach(section => {
    const node = template.content.cloneNode(true);
    node.querySelector('summary').textContent = t(section.titleKey);
    node.querySelector('.accordion-content').innerHTML = `<ul>${
      section.lines[lang].map(line => `<li>${line}</li>`).join('')
    }</ul>`;
    wrap.appendChild(node);
  });
}

function getHouseInput(prefix) {
  const houses = {};
  for (let house = 1; house <= 12; house += 1) {
    const raw = document.getElementById(`${prefix}-house-${house}`).value.trim();
    const planets = raw
      ? raw.split(',').map(item => capitalize(item.trim())).filter(Boolean)
      : [];
    houses[house] = planets;
  }
  return houses;
}

function capitalize(text) {
  if (!text) return '';
  const clean = text.toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function validateChart(chartName, lagna, houses) {
  const errors = [];
  const planetCounts = Object.fromEntries(PLANETS.map(p => [p, 0]));
  Object.entries(houses).forEach(([house, planets]) => {
    planets.forEach(p => {
      if (!PLANETS.includes(p)) {
        errors.push(`${chartName}: ${p} in house ${house} is not a supported planet name.`);
      } else {
        planetCounts[p] += 1;
      }
    });
  });
  PLANETS.forEach(p => {
    if (planetCounts[p] === 0) errors.push(`${chartName}: ${p} is missing.`);
    if (planetCounts[p] > 1) errors.push(`${chartName}: ${p} appears ${planetCounts[p]} times.`);
  });
  if (!lagna) errors.push(`${chartName}: Lagna sign missing.`);
  return { errors, planetCounts };
}

function renderValidation(errors) {
  if (!errors.length) {
    validationBox.innerHTML = `<span class="good">Validation passed.</span> D1 and D9 look structurally complete.`;
    return;
  }
  validationBox.innerHTML = `<div class="bad"><strong>Validation failed:</strong></div><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
}
function applyLanguage(lang = 'en') {
  const dict = I18N[lang] || I18N.en;

  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });

  localStorage.setItem('astroAppLang', lang);
}

function initLanguage() {
  const savedLang = localStorage.getItem('astroAppLang') || 'en';
  if (languageToggle) languageToggle.value = savedLang;
  applyLanguage(savedLang);

  languageToggle?.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
    initReferenceGuide();

    if (window.__lastReport) {
      renderResult(window.__lastReport);
    }
  });
}
function getCurrentLang() {
  return localStorage.getItem('astroAppLang') || 'en';
}

function t(key) {
  const lang = getCurrentLang();
  return I18N[lang]?.[key] || I18N.en[key] || key;
}

function translateDomainTitle(title) {
  const map = {
    "Identity & Personality": t('verdictIdentity'),
    "Wealth & Family": t('verdictWealth'),
    "Marriage & Relationship": t('verdictMarriage'),
    "Career & Earning": t('verdictCareer'),
    "EMA Risk": t('verdictEMA'),
    "Health": t('verdictHealth')
  };
  return map[title] || title;
}
function buildPayload() {
  const d1Lagna = document.getElementById('d1Lagna').value;
  const d9Lagna = document.getElementById('d9Lagna').value;
  const d1Houses = getHouseInput('d1');
  const d9Houses = getHouseInput('d9');
  return {
    d1: { lagnaSign: d1Lagna, houses: d1Houses },
    d9: { lagnaSign: d9Lagna, houses: d9Houses },
    meta: { source: 'manual-entry-browser-app', version: 'v1' }
  };
}

async function analyze() {
  const payload = buildPayload();
  const d1Validation = validateChart('D1', payload.d1.lagnaSign, payload.d1.houses);
  const d9Validation = validateChart('D9', payload.d9.lagnaSign, payload.d9.houses);
  const errors = [...d1Validation.errors, ...d9Validation.errors];
  renderValidation(errors);
  if (errors.length) return;

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';
  try {
   const res = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

const text = await res.text();
let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error('Backend is not returning JSON. Check /api/analyze deployment.');
}

if (!res.ok) throw new Error(data.error || 'Analysis failed');   
    renderResult(data);
    switchTab('insightsTab');
  } catch (error) {
    validationBox.innerHTML = `<span class="bad">${error.message}</span>`;
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Generate Insights';
  }
}

function renderResult(data) {
  const { summary, domains, triggeredRules, generatedAt } = data;
  const showEMA = document.getElementById("showEmaToggle")?.checked;

  const visibleDomains = domains.filter(domain => showEMA || domain.title !== "EMA Risk");

  summaryBox.innerHTML = `
    <p><strong>${t('summaryOverallPattern')}:</strong> ${summary.overallPattern}</p>
    <p><strong>${t('summaryEarlyLife')}:</strong> ${summary.earlyLife}</p>
    <p><strong>${t('summaryLaterLife')}:</strong> ${summary.laterLife}</p>
    <p><strong>${t('summaryGenerated')}:</strong> ${new Date(generatedAt).toLocaleString()}</p>
  `;

  renderQuickVerdict(visibleDomains);
  renderConfidence(visibleDomains, triggeredRules);
  renderComparisonTable(visibleDomains);

  whyBox.innerHTML = `<ul class="bullet-list">${
    triggeredRules
      .filter(rule => showEMA || !rule.includes('EMA'))
      .map(rule => `<li>${rule}</li>`)
      .join('')
  }</ul>`;

  domainCards.innerHTML = visibleDomains
    .map(domain => `
      <article class="domain-card">
        <div class="domain-group-tag">${deriveTrend(domain)}</div>
        <div class="section-head compact">
          <h3>${domain.title}</h3>
         <span class="status-badge ${statusClass(domain.verdict)}">${translateVerdict(domain.verdict)}</span>
        </div>
        <div class="score-row"><strong>D1:</strong> ${translateStrength(domain.d1Strength)}</div>
<div class="score-row"><strong>D9:</strong> ${translateStrength(domain.d9Strength)}</div>
        <div class="score-row"><strong>Flags:</strong> ${domain.flags.length ? domain.flags.join(', ') : 'None'}</div>
        <div class="score-row"><strong>Why:</strong></div>
        <ul class="status-list">${domain.reasons.map(r => `<li>${r}</li>`).join('')}</ul>
      </article>
    `).join('');

  window.__lastReport = data;
  downloadBtn.disabled = false;
}
function translateVerdict(val){
  if(val.includes("Stable")) return t('verdictStable');
  if(val.includes("Mixed")) return t('verdictMixed');
  if(val.includes("Delayed")) return t('verdictDelayed');
  if(val.includes("Temporary")) return t('verdictTemporary');
  if(val.includes("Challenge")) return t('verdictChallenging');
  return val;
}
function translateStrength(val){
  if(val === "Strong") return t('strengthStrong');
  if(val === "Mixed") return t('strengthMixed');
  if(val === "Weak") return t('strengthWeak');
  return val;
}
function renderQuickVerdict(domains) {
  quickVerdictGrid.innerHTML = domains.map(domain => `
    <div class="verdict-card">
      <h3>${translateDomainTitle(domain.title)}</h3>
      <div class="verdict-value">${domain.verdict}</div>
    </div>
  `).join('');
}

function renderConfidence(domains, triggeredRules) {
  const strongCount = domains.filter(d => d.d1Strength === 'Strong' || d.d9Strength === 'Strong').length;
  const weakCount = domains.filter(d => d.d1Strength === 'Weak' || d.d9Strength === 'Weak').length;
  const mixedCount = domains.filter(d => d.verdict === 'Mixed').length;
  const modifierPenalty = triggeredRules.filter(rule => rule.includes('Global')).length * 4;

  let score = 72 + (strongCount * 4) - (weakCount * 5) - (mixedCount * 2) - modifierPenalty;
  if (score > 95) score = 95;
  if (score < 40) score = 40;

 let label = t('confidenceModerate');
if (score >= 85) label = t('confidenceHigh');
else if (score <= 55) label = t('confidenceGuarded');
  confidenceBox.innerHTML = `
    <div class="confidence-box">
      <div class="confidence-score">${score}%</div>
      <div class="confidence-label">${label}</div>
    <div class="score-row">${t('confidenceBasis')}</div>
    </div>
  `;
}

function renderComparisonTable(domains) {
  comparisonTableWrap.className = 'comparison-table-wrap';
  comparisonTableWrap.innerHTML = `
    <table class="comparison-table">
      <thead>
        <tr>
          <th>${t('comparisonDomain')}</th>
          <th>${t('comparisonD1')}</th>
          <th>${t('comparisonD9')}</th>
          <th>${t('comparisonTrend')}</th>
          <th>${t('comparisonFinalVerdict')}</th>
        </tr>
      </thead>
      <tbody>
        ${domains.map(domain => `
          <tr>
            <td>${translateDomainTitle(domain.title)}</td>
            <td>${domain.d1Strength}</td>
            <td>${domain.d9Strength}</td>
            <td>${deriveTrend(domain)}</td>
            <td>${domain.verdict}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function deriveTrend(domain) {
  if (domain.d1Strength === 'Strong' && domain.d9Strength === 'Strong') return t('trendStable');
  if (domain.d1Strength === 'Strong' && (domain.d9Strength === 'Mixed' || domain.d9Strength === 'Weak')) return t('trendEarlyStrengthLaterFluctuation');
  if ((domain.d1Strength === 'Mixed' || domain.d1Strength === 'Weak') && domain.d9Strength === 'Strong') return t('trendImprovesLater');
  if (domain.d1Strength === 'Weak' && domain.d9Strength === 'Weak') return t('trendPersistentChallenge');
  return t('trendMixedProgression');
}
function statusClass(verdict) {
  const key = verdict.toLowerCase();
  if (key.includes('stable') || key.includes('strong')) return 'status-stable';
  if (key.includes('temporary') || key.includes('mixed') || key.includes('moderate')) return 'status-moderate';
  if (key.includes('delayed')) return 'status-delayed';
  return 'status-vulnerable';
}

function switchTab(tabId) {
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === tabId));
}

tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
analyzeBtn.addEventListener('click', analyze);
resetBtn.addEventListener('click', () => window.location.reload());
downloadBtn.addEventListener('click', () => {
  if (!window.__lastReport) return;
  const report = buildDownloadText(window.__lastReport);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'd1-d9-analysis-report.txt';
  a.click();
  URL.revokeObjectURL(url);
});

function buildDownloadText(data) {

  const nativeName = document.getElementById("nativeName")?.value || "Unnamed Native";
  const showEMA = document.getElementById("showEmaToggle")?.checked;

  const lines = [];
lines.push(`${t('reportNative')}: ${nativeName}`);
 lines.push(t('reportTitle'));
  lines.push('');
  lines.push(`${t('reportGenerated')}: ${new Date(data.generatedAt).toLocaleString()}`);
  lines.push(`Overall Pattern: ${data.summary.overallPattern}`);
  lines.push(`Early-Life Leaning: ${data.summary.earlyLife}`);
  lines.push(`Later-Life Leaning: ${data.summary.laterLife}`);
  lines.push('');
  lines.push(t('reportRules'));
  data.triggeredRules.forEach((rule, idx) => lines.push(`${idx + 1}. ${rule}`));
  lines.push('');
  lines.push(t('reportDomains'));

  data.domains.forEach(domain => {
    if (!showEMA && domain.title === "EMA Risk") return;

    lines.push('');
    lines.push(domain.title.toUpperCase());
    lines.push(`Verdict: ${domain.verdict}`);
    lines.push(`D1 Strength: ${domain.d1Strength}`);
    lines.push(`D9 Strength: ${domain.d9Strength}`);
    lines.push(`Flags: ${domain.flags.join(', ') || 'None'}`);
    domain.reasons.forEach(reason => lines.push(`- ${reason}`));
  });

  return lines.join('\n');
}
initSelect('d1Lagna');
initSelect('d9Lagna');

createGrid('d1Grid', 'd1');
createGrid('d9Grid', 'd9');

initReferenceGuide();
initLanguage();
