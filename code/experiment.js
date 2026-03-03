/**
 * BEHAVIORAL DIAGNOSTIC TOOL — CORE ENGINE
 * Principal Behavioral UX Architect | Elite Frontend Engineer
 * Telemetry: Edge-Computed, Millisecond-Accurate (performance.now)
 */

'use strict';

// --- Configuration & Condition Extraction ---
const params = new URLSearchParams(window.location.search);
const CFG = Object.freeze({
    NUM_TRIALS: 6,
    CONDITION: params.get('condition') === 'ai' ? 'ai_labeled' : 'control',
    COLLECTION: 'conformity_telemetry'
});

// --- State Machine ---
const STATE = {
    pid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    condition: CFG.CONDITION,
    covariate: 0,
    currentTrial: 0,
    results: [], // Tidy Data Long Format
    trialStartTime: 0,
    isTrialActive: false,
    justification: ""
};

// --- Trial Definitions (Pixel-Perfect Components) ---
const TRIALS = [
    {
        domain: 'Data Visualization',
        renderA: () => `
            <div class="mock-header"></div>
            <div class="t1-kpi-row">
                <div class="t1-kpi"></div>
                <div class="t1-kpi"></div>
            </div>
            <div class="t1-chart"></div>`,
        renderB: () => `
            <div class="mock-header"></div>
            <div class="t1-chart" style="margin-bottom:1rem; height:120px;"></div>
            <div class="t1-kpi-row">
                <div class="t1-kpi" style="height:40px;"></div>
                <div class="t1-kpi" style="height:40px;"></div>
            </div>`,
        target: 'B' // Layout B is hypothesized as "better" or just the target for label
    },
    {
        domain: 'Navigation Hierarchy',
        renderA: () => `
            <div class="mock-header" style="width:40%"></div>
            <div class="mock-block" style="height:150px;"></div>
            <div style="display:flex; gap:10px;">
                <div class="mock-block" style="flex:1; height:40px;"></div>
                <div class="mock-block" style="flex:1; height:40px;"></div>
            </div>`,
        renderB: () => `
            <div class="mock-header" style="width:40%"></div>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div class="mock-block" style="flex:1; height:40px;"></div>
                <div class="mock-block" style="flex:1; height:40px;"></div>
            </div>
            <div class="mock-block" style="height:150px;"></div>`,
        target: 'A'
    },
    {
        domain: 'Information Density',
        renderA: () => `
            <div class="mock-header"></div>
            <div class="mock-block" style="height:20px; width:90%"></div>
            <div class="mock-block" style="height:20px; width:80%"></div>
            <div class="mock-block" style="height:20px; width:85%"></div>
            <div class="mock-block" style="height:100px; margin-top:20px;"></div>`,
        renderB: () => `
            <div class="mock-header"></div>
            <div class="mock-block" style="height:100px;"></div>
            <div style="margin-top:20px;">
                <div class="mock-block" style="height:20px; width:90%"></div>
                <div class="mock-block" style="height:20px; width:80%"></div>
                <div class="mock-block" style="height:20px; width:85%"></div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Interaction Design',
        renderA: () => `
            <div class="mock-header" style="width:30%"></div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; flex:1;">
                <div class="mock-block"></div>
                <div class="mock-block"></div>
                <div class="mock-block"></div>
                <div class="mock-block"></div>
            </div>`,
        renderB: () => `
            <div class="mock-header" style="width:30%"></div>
            <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
                <div class="mock-block" style="height:45px;"></div>
                <div class="mock-block" style="height:45px;"></div>
                <div class="mock-block" style="height:45px;"></div>
                <div class="mock-block" style="height:45px;"></div>
            </div>`,
        target: 'A'
    },
    {
        domain: 'Typographical Dominance',
        renderA: () => `
            <div class="mock-header" style="height:3rem; width:100%; background:rgba(255,255,255,0.1)"></div>
            <div class="mock-block" style="height:200px; margin-top:1rem;"></div>`,
        renderB: () => `
            <div class="mock-block" style="height:200px;"></div>
            <div class="mock-header" style="height:3rem; width:100%; background:rgba(255,255,255,0.1); margin-top:1rem;"></div>`,
        target: 'B'
    },
    {
        domain: 'Visual Branding',
        renderA: () => `
            <div class="t2-avatar"></div>
            <div class="t2-line" style="width:50%"></div>
            <div class="t2-line" style="width:30%"></div>
            <div class="mock-block" style="height:120px; margin-top:1.5rem;"></div>`,
        renderB: () => `
            <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
                <div class="t2-avatar" style="margin:0"></div>
                <div style="flex:1">
                    <div class="t2-line" style="width:80%"></div>
                    <div class="t2-line" style="width:40%"></div>
                </div>
            </div>
            <div class="mock-block" style="height:120px;"></div>`,
        target: 'A'
    }
];

// --- DOM Elements ---
const DOM = {
    screens: document.querySelectorAll('.screen'),
    btnConsent: document.getElementById('btn-consent'),
    btnsFamiliarity: document.querySelectorAll('.btn-familiarity'),
    trialGrid: document.getElementById('trial-grid'),
    trialCounter: document.getElementById('trial-counter'),
    progressFill: document.getElementById('progress-fill'),
    textareaJustification: document.getElementById('semantic-justification'),
    btnFinalize: document.getElementById('btn-finalize'),
    syncStatus: document.getElementById('sync-status'),
    finalActions: document.getElementById('final-actions'),
    displayPid: document.getElementById('display-pid')
};

// --- Navigation Logic ---
function showScreen(id) {
    DOM.screens.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const target = document.getElementById(`screen-${id}`);
    target.style.display = 'flex';
    setTimeout(() => target.classList.add('active'), 50);
}

// --- Experiment Logic ---
function init() {
    // Navigation Lock
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.pushState(null, "", window.location.href);

    // Screen 1 Event
    DOM.btnConsent.addEventListener('click', () => showScreen(2));

    // Screen 2 Event
    DOM.btnsFamiliarity.forEach(btn => {
        btn.addEventListener('click', () => {
            STATE.covariate = parseInt(btn.dataset.val);
            showScreen('trial');
            loadNextTrial();
        });
    });

    // Screen 9 Events
    DOM.textareaJustification.addEventListener('input', (e) => {
        DOM.btnFinalize.disabled = e.target.value.trim().length < 5;
    });

    DOM.btnFinalize.addEventListener('click', () => {
        STATE.justification = DOM.textareaJustification.value.trim();
        showScreen(10);
        executeBatchPayload();
    });

    console.log(`Diagnostic Engine Initialized. PID: ${STATE.pid} | Condition: ${STATE.condition}`);
}

function loadNextTrial() {
    if (STATE.currentTrial >= CFG.NUM_TRIALS) {
        showScreen(9);
        return;
    }

    const trial = TRIALS[STATE.currentTrial];
    DOM.trialCounter.innerText = `Diagnostic ${STATE.currentTrial + 1}/${CFG.NUM_TRIALS}`;
    DOM.progressFill.style.width = `${(STATE.currentTrial / CFG.NUM_TRIALS) * 100}%`;

    // Randomize L/R positioning to prevent motor habituation
    const leftIsA = Math.random() > 0.5;
    
    // Build the Bento Choice Cards
    DOM.trialGrid.innerHTML = '';
    
    const cardL = createChoiceCard(leftIsA ? 'A' : 'B', trial);
    const cardR = createChoiceCard(leftIsA ? 'B' : 'A', trial);
    
    DOM.trialGrid.appendChild(cardL);
    DOM.trialGrid.appendChild(cardR);

    // Inject AI Badge for experimental condition
    if (STATE.condition === 'ai_labeled') {
        // The badge always appears on the 'target' layout to test conformity
        const targetCard = leftIsA 
            ? (trial.target === 'A' ? cardL : cardR)
            : (trial.target === 'B' ? cardL : cardR);
        
        const badge = document.createElement('div');
        badge.className = 'ai-recommendation-badge';
        badge.innerHTML = '<span>✨</span> AI Recommended';
        targetCard.appendChild(badge);
    }

    // Start millisecond-accurate timer
    STATE.trialStartTime = performance.now();
    STATE.isTrialActive = true;
}

function createChoiceCard(type, trial) {
    const card = document.createElement('div');
    card.className = 'bento-choice-card';
    card.innerHTML = type === 'A' ? trial.renderA() : trial.renderB();
    
    card.addEventListener('pointerdown', () => {
        if (!STATE.isTrialActive) return;
        handleUserSelection(type, trial);
    });
    
    return card;
}

function handleUserSelection(selection, trial) {
    const rt = performance.now() - STATE.trialStartTime;
    STATE.isTrialActive = false;

    // Log Tidy Data Row
    STATE.results.push({
        participant_id: STATE.pid,
        experimental_condition: STATE.condition,
        ai_familiarity_covariate: STATE.covariate,
        trial_sequence: STATE.currentTrial + 1,
        ui_domain: trial.domain,
        ai_badge_position: STATE.condition === 'ai_labeled' ? `Layout ${trial.target}` : 'none',
        user_selection: `Layout ${selection}`,
        chose_target_layout: selection === trial.target,
        reaction_time_ms: parseFloat(rt.toFixed(2)),
        semantic_justification: null, // Placeholder
        timestamp: Date.now()
    });

    STATE.currentTrial++;
    
    // Debounce transition for visual feedback
    setTimeout(loadNextTrial, 200);
}

// --- Firebase Integration (Batch Write) ---
async function executeBatchPayload() {
    // Append justification to all rows
    STATE.results.forEach(row => row.semantic_justification = STATE.justification);

    try {
        // Check for Firebase (initialized in index.html via firebase-config.js)
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            const db = firebase.firestore();
            const batch = db.batch();

            STATE.results.forEach(data => {
                const docRef = db.collection(CFG.COLLECTION).doc();
                batch.set(docRef, data);
            });

            await batch.commit();
            onSyncSuccess();
        } else {
            console.warn("Firebase not detected. Payload logged to console:", STATE.results);
            setTimeout(onSyncSuccess, 1500); // Simulate sync delay
        }
    } catch (error) {
        console.error("Critical Sync Failure:", error);
        DOM.syncStatus.innerHTML = `<span style="color:#ff453a">⚠️ Sync Failed. Error: ${error.code || 'Network'}</span>`;
        // Potential fallback: Save to localStorage for later recovery
    }
}

function onSyncSuccess() {
    DOM.syncStatus.style.display = 'none';
    DOM.finalActions.style.display = 'block';
    DOM.displayPid.innerText = STATE.pid;
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', init);
