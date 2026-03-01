// ============================================================
// BEHAVIORAL DIAGNOSTIC TOOL — EXPERIMENT ENGINE
// Zero-dependency, edge-computed telemetry.
// Uses performance.now() for sub-millisecond reaction times.
// ============================================================

'use strict';

// ---- Configuration ----
const CFG = Object.freeze({
    NUM_TRIALS: 6,
    CONDITIONS: ['Control', 'AI_Labeled'],
});

// ---- Participant ID (RFC4122 v4 UUID) ----
function generatePID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// ---- Fisher-Yates Shuffle ----
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============================================================
// TRIAL DEFINITIONS (6 Geometric-Mirror Pairs)
// Each pair differs only in internal content/color, not layout.
// ============================================================
const TRIALS = [
    // Trial 1: Dashboard — Bar chart colors differ
    {
        id: 'T1_Dashboard',
        renderA: () => renderDashboard('#3B82F6', [45, 70, 55, 80, 62, 75]),
        renderB: () => renderDashboard('#8B5CF6', [75, 62, 80, 55, 70, 45]),
    },
    // Trial 2: Pricing — Featured tier position differs
    {
        id: 'T2_Pricing',
        renderA: () => renderPricing('basic'),
        renderB: () => renderPricing('pro'),
    },
    // Trial 3: Signup Form — CTA text/color differs
    {
        id: 'T3_Signup',
        renderA: () => renderForm('Create Account', '#3B82F6'),
        renderB: () => renderForm('Get Started Free', '#8B5CF6'),
    },
    // Trial 4: Settings Panel — Toggle states differ
    {
        id: 'T4_Settings',
        renderA: () => renderSettings([true, false, true, false]),
        renderB: () => renderSettings([false, true, false, true]),
    },
    // Trial 5: Navigation Sidebar — Active item position differs
    {
        id: 'T5_Navigation',
        renderA: () => renderNav(0, '#EEF2FF', '#6366F1'),
        renderB: () => renderNav(2, '#FEF3C7', '#D97706'),
    },
    // Trial 6: Notification Page — Banner placement differs
    {
        id: 'T6_Notification',
        renderA: () => renderNotification('top'),
        renderB: () => renderNotification('bottom'),
    },
];

// ============================================================
// MOCKUP RENDERERS — Geometric Mirrors
// Identical DOM structure, only data/colors change.
// ============================================================

function renderDashboard(barColor, heights) {
    const bars = heights.map(h =>
        `<div class="mock-bar" style="height:${h}px;background:${barColor};"></div>`
    ).join('');
    return `
    <div class="mockup">
      <div class="mock-header">Revenue Overview</div>
      <div class="mock-kpi-row">
        <div class="mock-kpi"><div class="mock-kpi-val">$42.8k</div><div class="mock-kpi-label">Revenue</div></div>
        <div class="mock-kpi"><div class="mock-kpi-val">+12.5%</div><div class="mock-kpi-label">Growth</div></div>
      </div>
      <div class="mock-chart-area">${bars}</div>
    </div>`;
}

function renderPricing(featured) {
    const plans = [
        { name: 'Basic', price: '$9', features: ['5 Projects', '10 GB', 'Email Support'], color: '#3B82F6' },
        { name: 'Pro', price: '$29', features: ['Unlimited', '100 GB', 'Priority', 'Analytics'], color: '#6366F1' },
        { name: 'Team', price: '$79', features: ['Everything', '1 TB', 'Dedicated Mgr', 'API', 'SLA'], color: '#8B5CF6' },
    ];
    const cards = plans.map(p => {
        const isFeat = p.name.toLowerCase() === featured;
        return `<div class="mock-plan ${isFeat ? 'featured' : ''}">
      <div class="mock-plan-name">${p.name}</div>
      <div class="mock-plan-price">${p.price}<span>/mo</span></div>
      <ul class="mock-plan-features">${p.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul>
      <div class="mock-plan-btn" style="background:${p.color}">Select</div>
    </div>`;
    }).join('');
    return `<div class="mockup"><div class="mock-header">Choose Your Plan</div><div class="mock-pricing-grid">${cards}</div></div>`;
}

function renderForm(cta, color) {
    return `
    <div class="mockup">
      <div class="mock-header">Join Us</div>
      <div class="mock-form-field">Full Name</div>
      <div class="mock-form-field">Email Address</div>
      <div class="mock-form-field">Password</div>
      <div class="mock-form-btn" style="background:${color}">${cta}</div>
    </div>`;
}

function renderSettings(toggleStates) {
    const labels = ['Notifications', 'Dark Mode', 'Location Access', 'Auto-Update'];
    const rows = labels.map((l, i) => {
        const on = toggleStates[i];
        return `<div class="mock-setting-row">
      <span class="mock-setting-label">${l}</span>
      <div class="mock-toggle ${on ? 'on' : ''}" style="background:${on ? '#6366F1' : '#d1d5db'}"></div>
    </div>`;
    }).join('');
    return `<div class="mockup"><div class="mock-header">Settings</div>${rows}</div>`;
}

function renderNav(activeIdx, activeBg, activeColor) {
    const items = [
        { icon: '⌂', label: 'Home' },
        { icon: '▦', label: 'Dashboard' },
        { icon: '◎', label: 'Projects' },
        { icon: '✉', label: 'Messages' },
        { icon: '⚙', label: 'Settings' },
    ];
    const navHtml = items.map((it, i) => {
        const isActive = i === activeIdx;
        return `<div class="mock-nav-item ${isActive ? 'active' : ''}" style="${isActive ? `background:${activeBg};color:${activeColor}` : ''}">
      <span class="mock-nav-icon">${it.icon}</span><span>${it.label}</span>
    </div>`;
    }).join('');
    return `<div class="mockup" style="padding:1rem"><div class="mock-header" style="color:#6366F1;font-size:0.9rem;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:1px solid #f3f4f6">AppName</div>${navHtml}</div>`;
}

function renderNotification(bannerPos) {
    const banner = `<div class="mock-banner">🚀 New feature available! <span class="mock-banner-link">Learn More</span></div>`;
    const content = `<div style="padding:0.75rem 1rem"><div class="mock-header">Welcome Back</div><div class="mock-content-block"></div><div class="mock-content-block"></div><div class="mock-content-block short"></div></div>`;
    const inner = bannerPos === 'top' ? banner + content : content + banner;
    return `<div class="mockup" style="padding:0;overflow:hidden">${inner}</div>`;
}

// ============================================================
// EXPERIMENT STATE MACHINE
// ============================================================
const state = {
    pid: generatePID(),
    condition: null,              // 'Control' or 'AI_Labeled'
    trialOrder: [],               // shuffled indices
    currentTrial: 0,
    renderTimestamp: 0,           // performance.now() at render
    responses: [],                // telemetry array
};

// ---- DOM Shortcuts ----
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${id}`).classList.add('active');
}

// ---- Start ----
function startExperiment() {
    // Between-subjects condition assignment via URL parameter
    const params = new URLSearchParams(window.location.search);
    const urlCondition = params.get('condition');

    if (urlCondition === 'ai') {
        state.condition = CFG.CONDITIONS[1]; // 'AI_Labeled'
    } else if (urlCondition === 'control') {
        state.condition = CFG.CONDITIONS[0]; // 'Control'
    } else {
        // Fallback: if no valid parameter, randomly assign (preserves backward compatibility)
        state.condition = CFG.CONDITIONS[Math.random() < 0.5 ? 0 : 1];
    }
    state.trialOrder = shuffle([...Array(CFG.NUM_TRIALS).keys()]);
    state.currentTrial = 0;
    showScreen('screen-trial');
    renderTrial();
}

// ---- Render a Trial ----
function renderTrial() {
    const idx = state.trialOrder[state.currentTrial];
    const trial = TRIALS[idx];
    const trialNum = state.currentTrial + 1;

    // Update progress
    $('#trial-counter').textContent = `TRIAL ${trialNum} OF ${CFG.NUM_TRIALS}`;
    $('#progress-fill').style.width = `${(trialNum / CFG.NUM_TRIALS) * 100}%`;

    // Randomize left/right placement
    const swapSides = Math.random() > 0.5;
    const leftLabel = swapSides ? 'B' : 'A';
    const rightLabel = swapSides ? 'A' : 'B';
    const leftHtml = swapSides ? trial.renderB() : trial.renderA();
    const rightHtml = swapSides ? trial.renderA() : trial.renderB();

    // Determine which side gets the AI badge (if AI_Labeled)
    // "Target" = the side that receives the badge
    const targetSide = Math.random() > 0.5 ? 'left' : 'right';
    const targetOption = targetSide === 'left' ? leftLabel : rightLabel;

    // Build badge HTML
    const badgeHtml = state.condition === 'AI_Labeled'
        ? '<div class="ai-badge">AI Recommended</div>'
        : '';

    // Inject into grid
    $('#trial-grid').innerHTML = `
    <div class="option-wrapper" data-choice="${leftLabel}" id="opt-left">
      ${targetSide === 'left' ? badgeHtml : ''}
      <div class="option-label">Option ${leftLabel}</div>
      ${leftHtml}
    </div>
    <div class="option-wrapper" data-choice="${rightLabel}" id="opt-right">
      ${targetSide === 'right' ? badgeHtml : ''}
      <div class="option-label">Option ${rightLabel}</div>
      ${rightHtml}
    </div>
  `;

    // Store target option position for telemetry
    state._targetOption = targetOption;

    // HIGH-FIDELITY TIMESTAMP: mark render completion
    state.renderTimestamp = performance.now();

    // Bind click handlers
    $$('.option-wrapper').forEach(el => {
        el.addEventListener('click', () => handleChoice(el));
    });
}

// ---- Handle User Choice ----
function handleChoice(el) {
    // HIGH-FIDELITY TIMESTAMP: capture reaction time
    const clickTime = performance.now();
    const rt = Math.round((clickTime - state.renderTimestamp) * 100) / 100; // 2 decimal places

    const idx = state.trialOrder[state.currentTrial];
    const trial = TRIALS[idx];
    const choice = el.dataset.choice;

    // Visual feedback
    $$('.option-wrapper').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');

    // Push telemetry row
    state.responses.push({
        Participant_ID: state.pid,
        Condition: state.condition,
        Trial_Number: state.currentTrial + 1,
        Trial_ID: trial.id,
        Target_Option_Position: state._targetOption,
        User_Choice: choice,
        Chose_Target: choice === state._targetOption ? 1 : 0,
        Reaction_Time_ms: rt,
    });

    // Advance after brief visual feedback delay
    setTimeout(() => {
        state.currentTrial++;
        if (state.currentTrial < CFG.NUM_TRIALS) {
            renderTrial();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showComplete();
        }
    }, 350);
}

// ---- Completion Screen ----
function showComplete() {
    // Compute personal metrics
    let matchCount = 0;
    let totalRt = 0;
    state.responses.forEach(r => {
        totalRt += r.Reaction_Time_ms;
        if (r.Chose_Target === 1) matchCount++;
    });

    const avgRt = (totalRt / CFG.NUM_TRIALS / 1000).toFixed(1);
    const matchPct = Math.round((matchCount / CFG.NUM_TRIALS) * 100);

    // Populate
    $('#result-condition').textContent = state.condition === 'AI_Labeled' ? 'AI Label (Treatment)' : 'Control (No Label)';
    $('#result-pid').textContent = state.pid;
    $('#speed-value').textContent = avgRt;

    if (state.condition === 'AI_Labeled') {
        $('#ring-label').textContent = 'CONFORMITY SCORE';
        $('#ring-sub').textContent = 'Matched AI recommendations';
    } else {
        $('#ring-label').textContent = 'PATTERN BIAS';
        $('#ring-sub').textContent = 'Selected target option';
    }

    showScreen('screen-complete');

    // Animate ring
    const circumference = 2 * Math.PI * 40;
    const ring = $('#ring-fg');
    ring.setAttribute('stroke-dasharray', `${circumference}`);
    ring.setAttribute('stroke-dashoffset', `${circumference}`);

    requestAnimationFrame(() => {
        setTimeout(() => {
            const offset = circumference - (matchPct / 100) * circumference;
            ring.style.strokeDashoffset = offset;
            // Counter animation
            let count = 0;
            const interval = setInterval(() => {
                count += 2;
                if (count > matchPct) count = matchPct;
                $('#ring-val').textContent = count + '%';
                if (count >= matchPct) clearInterval(interval);
            }, 25);
        }, 100);
    });
}

// ---- CSV Export (Edge-Computed, No Server) ----
function exportCSV() {
    const headers = ['Participant_ID', 'Condition', 'Trial_Number', 'Trial_ID', 'Target_Option_Position', 'User_Choice', 'Chose_Target', 'Reaction_Time_ms'];
    const rows = state.responses.map(r => headers.map(h => r[h]).join(','));
    const csvString = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = $('#csv-anchor');
    anchor.href = url;
    anchor.download = 'behavioral_telemetry.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

// ============================================================
// EVENT BINDINGS
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    $('#btn-start').addEventListener('click', startExperiment);
    $('#btn-download').addEventListener('click', exportCSV);
});
