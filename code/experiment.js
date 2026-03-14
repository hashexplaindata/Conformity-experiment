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

// --- Participant ID Generation ---
function generatePID() {
    try {
        return self.crypto.randomUUID();
    } catch (e) {
        return Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15);
    }
}

// --- State Machine ---
const STATE = {
    pid: localStorage.getItem('experiment_pid') || generatePID(),
    condition: CFG.CONDITION,
    covariate: 0,
    currentTrial: 0,
    results: [],
    trialStartTime: 0,
    isTrialActive: false,
    justification: "",
    activeScreen: null,
    pendingTransitionTimer: null,
    manipulation_noticed: null
};

// Persist PID to localStorage
try {
    localStorage.setItem('experiment_pid', STATE.pid);
} catch (e) {
    // Silent fallback
}

// --- Trial Definitions (Pixel-Perfect Components) ---
/**
 * OptiUX VALIDATION SUITE
 * The narrative: These are universal UI patterns where AI is actively used 
 * to predict human cognitive load, trust, and retention.
 */
const TRIALS = [
    {
        domain: 'Fintech (Security Verification)',
        ai_label: 'AI Prediction: Highest User Trust',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <div style="width:40px; height:40px; border-radius:20px; background:rgba(48, 209, 88, 0.1); margin:0 auto 15px; display:flex; align-items:center; justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 style="font-size:1rem; margin-bottom:12px;">Secure Entry</h3>
                <div style="display:flex; justify-content:center; gap:8px; margin-bottom:15px;">
                    ${[1,2,3,4].map(() => `<div style="width:12px; height:12px; border-radius:6px; background:var(--text-primary);"></div>`).join('')}
                </div>
                <button style="width:100%; padding:10px; background:var(--text-primary); color:var(--bg-main); border:none; border-radius:6px; font-weight:bold; font-size:0.8rem;">Authorize</button>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:0.9rem; margin-bottom:8px; color:var(--text-secondary);">Identity Check</h3>
                <p style="font-size:0.75rem; margin-bottom:15px; line-height:1.4;">Enter the unique 4-digit code sent to your primary device.</p>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:15px;">
                    ${[1,2,3,4].map(() => `<div style="height:35px; background:var(--bg-surface); border:1px solid var(--border); border-radius:4px;"></div>`).join('')}
                </div>
                <button style="width:100%; padding:8px; background:transparent; border:1px solid var(--text-primary); color:var(--text-primary); border-radius:6px; font-size:0.8rem;">Verify Identity</button>
            </div>`,
        target: 'A'
    },
    {
        domain: 'HealthTech (Goal Tracking)',
        ai_label: 'AI Recommended: High Engagement',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <h3 style="font-size:0.95rem; margin-bottom:15px;">Daily Activity</h3>
                <div style="position:relative; width:100px; height:100px; margin:0 auto;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <path stroke="var(--bg-surface)" stroke-width="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path stroke="var(--accent-blue)" stroke-width="3.5" stroke-dasharray="75, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
                        <span style="font-size:1.2rem; font-weight:800;">75%</span>
                    </div>
                </div>
                <p style="font-size:0.7rem; color:var(--text-secondary); margin-top:10px;">Steps: 7,500 / 10,000</p>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:0.95rem; margin-bottom:12px;">Metrics</h3>
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                        <span>Steps</span><span style="font-weight:bold;">7,500</span>
                    </div>
                    <div style="width:100%; height:6px; background:var(--bg-surface); border-radius:3px;"><div style="width:75%; height:100%; background:var(--accent-blue); border-radius:3px;"></div></div>
                </div>
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                        <span>Sleep</span><span style="font-weight:bold;">6.2h</span>
                    </div>
                    <div style="width:100%; height:6px; background:var(--bg-surface); border-radius:3px;"><div style="width:60%; height:100%; background:var(--accent-purple); border-radius:3px;"></div></div>
                </div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'News & Media (Readability)',
        ai_label: 'AI Prediction: 20% Faster Scan Rate',
        renderA: () => `
            <div style="padding: 0;">
                <div style="height:80px; background:linear-gradient(to right, #2c3e50, #3498db);"></div>
                <div style="padding:12px;">
                    <h3 style="font-size:0.9rem; line-height:1.2; margin-bottom:6px;">Global Tech Summit: Future of Quantum Computing</h3>
                    <p style="font-size:0.7rem; color:var(--text-secondary);">The annual conference kicks off with a focus on stable hardware...</p>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 12px; display:flex; gap:12px; align-items:center; height:100%;">
                <div style="flex:1;">
                    <span style="font-size:0.6rem; text-transform:uppercase; color:var(--accent-blue); font-weight:bold;">Breaking</span>
                    <h3 style="font-size:0.9rem; line-height:1.2; margin:4px 0;">Quantum Computing Summit Begins</h3>
                    <span style="font-size:0.65rem; color:var(--text-secondary);">4 min read • Tech</span>
                </div>
                <div style="width:60px; height:60px; background:var(--bg-surface); border-radius:8px; flex-shrink:0;"></div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Navigation (Route Optimization)',
        ai_label: 'AI Recommended: Optimal Safety',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <span style="font-weight:bold; font-size:0.9rem;">Fastest Path</span>
                    <span style="color:#ff453a; font-size:0.8rem; font-weight:bold;">12 min</span>
                </div>
                <div style="height:60px; background:var(--bg-surface); border-radius:6px; border-left:4px solid #ff453a; display:flex; align-items:center; padding:0 10px;">
                    <span style="font-size:0.75rem; color:var(--text-secondary);">Heavier traffic detected on Main St.</span>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <span style="font-weight:bold; font-size:0.9rem;">Balanced Path</span>
                    <span style="color:var(--accent-blue); font-size:0.8rem; font-weight:bold;">15 min</span>
                </div>
                <div style="height:60px; background:var(--bg-surface); border-radius:6px; border-left:4px solid var(--accent-blue); display:flex; align-items:center; padding:0 10px;">
                    <span style="font-size:0.75rem; color:var(--text-secondary);">Residential roads • Well-lit route</span>
                </div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'E-Learning (Course Architecture)',
        ai_label: 'AI Prediction: Max Retention',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:0.9rem; margin-bottom:15px;">Mastering Python</h3>
                ${[1,2,3].map(i => `
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <div style="width:20px; height:20px; border-radius:10px; background:var(--accent-purple); display:flex; align-items:center; justify-content:center; font-size:0.6rem; color:white;">${i}</div>
                        <div style="flex:1; height:8px; background:var(--bg-surface); border-radius:4px;"></div>
                    </div>
                `).join('')}
            </div>`,
        renderB: () => `
            <div style="padding: 15px; text-align:center;">
                <h3 style="font-size:0.9rem; margin-bottom:12px;">Course Modules</h3>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
                    ${[1,2,3,4,5,6].map(i => `<div style="aspect-ratio:1; background:var(--bg-surface); border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:0.7rem;">${i}</div>`).join('')}
                </div>
            </div>`,
        target: 'A'
    },
    {
        domain: 'Shopping (Personalization)',
        ai_label: 'AI Recommended: Match for Your Profile',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="height:100px; background:var(--bg-surface); border-radius:8px; margin-bottom:10px;"></div>
                <h3 style="font-size:0.85rem; margin-bottom:4px;">Eco-Tech Smart Watch</h3>
                <span style="font-weight:bold; font-size:1.1rem;">$199.00</span>
                <p style="font-size:0.65rem; color:var(--text-secondary); margin-top:8px;">Priority Shipping: 2 Days</p>
            </div>`,
        renderB: () => `
            <div style="padding: 12px; display:flex; gap:12px;">
                <div style="width:80px; height:80px; background:var(--bg-surface); border-radius:8px; flex-shrink:0;"></div>
                <div style="flex:1;">
                    <h3 style="font-size:0.85rem; margin-bottom:4px;">Smart Watch</h3>
                    <div style="color:#fbbf24; font-size:0.75rem; margin-bottom:4px;">★★★★☆ (820)</div>
                    <span style="font-weight:bold; font-size:1rem;">$199.00</span>
                </div>
            </div>`,
        target: 'A'
    }
];

// --- DOM Elements ---
const DOM = {
    btnConsent: document.getElementById('btn-consent'),
    btnsFamiliarity: document.querySelectorAll('.btn-familiarity'),
    trialGrid: document.getElementById('trial-grid'),
    trialCounter: document.getElementById('trial-counter'),
    progressFill: document.getElementById('progress-fill'),
    textareaJustification: document.getElementById('semantic-justification'),
    justificationHint:     document.getElementById('justification-hint'),
    btnFinalize: document.getElementById('btn-finalize'),
    syncStatus: document.getElementById('sync-status'),
    finalActions: document.getElementById('final-actions'),
    displayPid: document.getElementById('display-pid')
};

// --- Navigation Logic ---
function showScreen(id) {
    const target = document.getElementById('screen-' + id);
    if (!target || target === STATE.activeScreen) return;

    const outgoing = STATE.activeScreen;
    STATE.activeScreen = target;

    if (outgoing) {
        outgoing.classList.remove('active');
        setTimeout(() => { outgoing.style.display = 'none'; }, 400);
    }

    target.style.display = 'flex';
    if (STATE.pendingTransitionTimer) clearTimeout(STATE.pendingTransitionTimer);
    STATE.pendingTransitionTimer = setTimeout(() => {
        target.classList.add('active');
        STATE.pendingTransitionTimer = null;
    }, 50);
}

// --- Experiment Logic ---
function init() {
    STATE.activeScreen = document.querySelector('.screen.active');

    // Navigation Lock
    window.history.replaceState(null, document.title, window.location.href);
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', () => {
        window.history.go(1);
    });

    // Screen 1 Event
    DOM.btnConsent.addEventListener('click', () => showScreen(2));

    // Screen 2 Event
    let covariateSelected = false;
    DOM.btnsFamiliarity.forEach(btn => {
        btn.addEventListener('click', () => {
            if (covariateSelected) return;
            covariateSelected = true;
            STATE.covariate = parseInt(btn.dataset.val);
            showScreen('trial');
            loadNextTrial();
        });
    });

    // Screen 9 Events
    // NOTE: The threshold (12 chars + at least one space) is intentional and must NOT be raised further.
    // A higher threshold increases study abandonment at the final screen, immediately
    // before the Firebase payload fires. Low-effort responses are expected and will be
    // filtered analytically via cosine-similarity scoring during NLP post-processing.
    DOM.textareaJustification.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const valid = val.length >= 12 && val.includes(' ');
        DOM.btnFinalize.disabled = !valid;
        DOM.justificationHint.textContent = val.length > 0 && !valid
            ? 'Please provide a brief, complete sentence.'
            : '';
    });

    DOM.btnFinalize.addEventListener('click', () => {
        DOM.btnFinalize.disabled = true;
        STATE.justification = DOM.textareaJustification.value.trim();
        showScreen('manipulation');
    });

    // Route: Manipulation Check -> Debrief
    document.querySelectorAll('.btn-manipulation').forEach(btn => {
        btn.addEventListener('click', (e) => {
            STATE.manipulation_noticed = parseInt(e.target.dataset.val);

            // Append this crucial metric to every trial row before sending
            STATE.results.forEach(row => {
                row.manipulation_noticed = STATE.manipulation_noticed;
            });

            showScreen('debrief');
        });
    });

    // Route: Debrief -> Outro & Payload Execution
    document.getElementById('btn-submit-final').addEventListener('click', () => {
        showScreen(10);
        executeBatchPayload(); // The data is securely transmitted ONLY after full informed consent is achieved
    });
}

function loadNextTrial() {
    if (STATE.currentTrial >= CFG.NUM_TRIALS) {
        showScreen(9);
        return;
    }

    const trial = TRIALS[STATE.currentTrial];
    DOM.trialCounter.textContent = `Diagnostic ${STATE.currentTrial + 1}/${CFG.NUM_TRIALS}`;
    DOM.progressFill.style.width = `${(STATE.currentTrial / CFG.NUM_TRIALS) * 100}%`;

    const leftIsA = Math.random() > 0.5;

    DOM.trialGrid.innerHTML = '';

    const cardL = createChoiceCard(leftIsA ? 'A' : 'B', trial);
    const cardR = createChoiceCard(leftIsA ? 'B' : 'A', trial);

    DOM.trialGrid.appendChild(cardL);
    DOM.trialGrid.appendChild(cardR);

    if (STATE.condition === 'ai_labeled') {
        const targetType = trial.target;
        const targetCard = (leftIsA && targetType === 'A') || (!leftIsA && targetType === 'B')
            ? cardL
            : cardR;

        const badge = document.createElement('div');
        badge.className = 'ai-recommendation-badge';
        const badgeSpan = document.createElement('span');
        badgeSpan.textContent = '✨';
        badge.appendChild(badgeSpan);
        badge.appendChild(document.createTextNode(' AI Recommended'));
        targetCard.appendChild(badge);
    }

    requestAnimationFrame(() => {
        setTimeout(() => {
            STATE.trialStartTime = performance.now();
            STATE.isTrialActive = true;
        }, 0);
    });
}

function createChoiceCard(type, trial) {
    const card = document.createElement('div');
    card.className = 'bento-choice-card';
    card.innerHTML = type === 'A' ? trial.renderA() : trial.renderB();

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });

    // Migrate from pointerdown → click so that mobile scroll gestures are not
    // misread as deliberate selections. The browser natively cancels click if a
    // drag/scroll is detected between pointerdown and pointerup, eliminating the
    // scroll-vs-select confound. Expected trade-off: ~50-100ms additional touch-
    // release latency added to response_latency_ms across the dataset (acceptable).
    const handleClick = () => {
        if (!STATE.isTrialActive) return;

        STATE.isTrialActive = false;
        card.removeEventListener('click', handleClick);
        card.classList.add('selected');

        handleUserSelection(type, trial);
    };

    card.addEventListener('click', handleClick);

    return card;
}

function handleUserSelection(selection, trial) {
    const latency = performance.now() - STATE.trialStartTime;

    STATE.results.push({
        participant_id: STATE.pid,
        experimental_condition: STATE.condition,
        ai_familiarity_covariate: STATE.covariate,
        trial_sequence: STATE.currentTrial + 1,
        ui_domain: trial.domain,
        ai_badge_position: STATE.condition === 'ai_labeled' ? `Layout ${trial.target}` : 'none',
        user_selection: `Layout ${selection}`,
        chose_target_layout: selection === trial.target,
        response_latency_ms: parseFloat(latency.toFixed(2)),
        timestamp: Date.now()
    });

    STATE.currentTrial++;

    setTimeout(loadNextTrial, 200);
}

// --- Firebase Integration (Batch Write) ---
async function executeBatchPayload() {
    STATE.results.forEach(row => row.semantic_justification = STATE.justification);

    let localBackupSucceeded = false;
    try {
        localStorage.setItem('telemetry_backup_' + STATE.pid, JSON.stringify(STATE.results));
        localBackupSucceeded = true;
    } catch (storageError) {
        // Silent fallback
    }

    try {
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
            const db = firebase.firestore();

            try {
                await db.enablePersistence({ synchronizeTabs: true });
            } catch (persistErr) {
                // Silent fallback
            }

            const batch = db.batch();

            STATE.results.forEach(data => {
                const docRef = db.collection(CFG.COLLECTION).doc();
                batch.set(docRef, data);
            });

            await batch.commit();
            await db.waitForPendingWrites();

            try { localStorage.removeItem('telemetry_backup_' + STATE.pid); } catch(e) {}
            try { localStorage.removeItem('experiment_pid'); } catch(e) {}

            onSyncSuccess();
        } else {
            if (!localBackupSucceeded) {
                try {
                    localStorage.setItem('telemetry_backup_' + STATE.pid, JSON.stringify(STATE.results));
                } catch (storageError) {
                    // Silent fallback
                }
            }
            setTimeout(onSyncSuccess, 0);
        }
    } catch (error) {
        if (!localBackupSucceeded) {
            try {
                localStorage.setItem('telemetry_backup_' + STATE.pid, JSON.stringify(STATE.results));
                localBackupSucceeded = true;
            } catch (storageError) {
                // Silent fallback
            }
        }

        DOM.syncStatus.textContent = localBackupSucceeded
            ? '⚠️ Network Timeout — your responses are saved locally'
            : '⚠️ Network Timeout';
        DOM.syncStatus.style.color = '#ff453a';
        DOM.finalActions.style.display = 'block';
        DOM.displayPid.textContent = STATE.pid;
    }
}

function onSyncSuccess() {
    DOM.syncStatus.style.display = 'none';
    DOM.finalActions.style.display = 'block';
    DOM.displayPid.textContent = STATE.pid;
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', init);
