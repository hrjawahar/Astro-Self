const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const REFERENCE_SECTIONS = [
  {
    title: "Core principles",
    lines: [
      "D1 shows external life events and promise.",
      "D9 shows maturity, durability, and later-life consolidation.",
      "Strong D1 + Strong D9 = Stable result.",
      "Strong D1 + Weak D9 = Temporary or unstable result.",
      "Weak D1 + Strong D9 = Delayed or late-blooming result.",
      "Weak D1 + Weak D9 = Chronic challenge or vulnerability."
    ]
  },
  {
    title: "Foundational checks",
    lines: [
      "Always start with Lagna and Lagna lord in D1 and D9.",
      "Check Moon before domain judgments because emotional resilience modifies outcomes.",
      "House lord carries more weight than occupant.",
      "D9 has final say on sustainability in marriage, long-term identity, and durability of outcomes."
    ]
  },
  {
    title: "House quick reference",
    lines: [
      "1 self and identity",
      "2 wealth and family",
      "5 romance, intelligence, children",
      "6 disease, service, conflict",
      "7 marriage and partnerships",
      "8 secrets, transformation, longevity of bond",
      "10 career and reputation",
      "11 gains and networks",
      "12 loss, bed life, withdrawal"
    ]
  },
  {
    title: "Planet karakas",
    lines: [
      "Sun = identity, authority, recognition",
      "Moon = emotions, mind, habits",
      "Mars = drive, conflict, courage",
      "Mercury = analysis, speech, trade",
      "Jupiter = wisdom, prosperity, expansion",
      "Venus = love, harmony, pleasure",
      "Saturn = delay, karma, responsibility",
      "Rahu = obsession, experimentation, material hunger",
      "Ketu = detachment, withdrawal, insight"
    ]
  },
  {
    title: "Interpretation workflow",
    lines: [
      "1. Validate D1 and D9 input.",
      "2. Read Lagna and Moon.",
      "3. Read domain house lord, occupants, and aspects.",
      "4. Compare D1 promise with D9 sustainability.",
      "5. Apply conflict-resolution logic.",
      "6. Generate verdict and show triggered rules."
    ]
  }
];

const signLord = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
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
  REFERENCE_SECTIONS.forEach(section => {
    const node = template.content.cloneNode(true);
    node.querySelector('summary').textContent = section.title;
    node.querySelector('.accordion-content').innerHTML = `<ul>${section.lines.map(line => `<li>${line}</li>`).join('')}</ul>`;
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
    const data = await res.json();
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

  summaryBox.innerHTML = `
    <p><strong>Overall pattern:</strong> ${summary.overallPattern}</p>
    <p><strong>Early-life leaning:</strong> ${summary.earlyLife}</p>
    <p><strong>Later-life leaning:</strong> ${summary.laterLife}</p>
    <p><strong>Generated:</strong> ${new Date(generatedAt).toLocaleString()}</p>
  `;

  whyBox.innerHTML = `<ul class="bullet-list">${
    triggeredRules
      .filter(rule => showEMA || !rule.includes('EMA'))
      .map(rule => `<li>${rule}</li>`)
      .join('')
  }</ul>`;

  domainCards.innerHTML = domains
    .filter(domain => showEMA || domain.title !== "EMA Risk")
    .map(domain => `
      <article class="domain-card">
        <div class="section-head compact">
          <h3>${domain.title}</h3>
          <span class="status-badge ${statusClass(domain.verdict)}">${domain.verdict}</span>
        </div>
        <div class="score-row"><strong>D1:</strong> ${domain.d1Strength}</div>
        <div class="score-row"><strong>D9:</strong> ${domain.d9Strength}</div>
        <div class="score-row"><strong>Flags:</strong> ${domain.flags.length ? domain.flags.join(', ') : 'None'}</div>
        <div class="score-row"><strong>Why:</strong></div>
        <ul class="status-list">${domain.reasons.map(r => `<li>${r}</li>`).join('')}</ul>
      </article>
    `).join('');

  window.__lastReport = data;
  downloadBtn.disabled = false;
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
  lines.push(`Native: ${nativeName}`);
  lines.push('D1-D9 LIFE PATTERN ANALYZER REPORT');
  lines.push('');
  lines.push(`Generated At: ${new Date(data.generatedAt).toLocaleString()}`);
  lines.push(`Overall Pattern: ${data.summary.overallPattern}`);
  lines.push(`Early-Life Leaning: ${data.summary.earlyLife}`);
  lines.push(`Later-Life Leaning: ${data.summary.laterLife}`);
  lines.push('');
  lines.push('TRIGGERED RULES');
  data.triggeredRules.forEach((rule, idx) => lines.push(`${idx + 1}. ${rule}`));
  lines.push('');
  lines.push('DOMAIN INSIGHTS');

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
