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
 * MindFlow: Personal Productivity Assistant Stimuli
 * These trials represent high-stakes digital life scenarios where AI 
 * assistance is contextually credible, ensuring higher engagement.
 */
const TRIALS = [
    {
        domain: 'Financial Health (Savings Optimization)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:12px; color:var(--text-primary);">Monthly Savings Breakdown</h3>
                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
                        <span>Emergency Fund</span><span style="font-weight:bold;">$450.00</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
                        <span>Retirement (401k)</span><span style="font-weight:bold;">$800.00</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                        <span>Travel Goal</span><span style="font-weight:bold;">$200.00</span>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; text-align:center;">
                <h3 style="font-size:1rem; margin-bottom:15px;">Target Progress</h3>
                <div style="position:relative; width:100px; height:100px; margin:0 auto;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <path stroke="var(--bg-surface)" stroke-width="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path stroke="#10b981" stroke-width="4" stroke-dasharray="72, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-weight:800; font-size:1.1rem;">72%</div>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:10px;">Dynamic Savings Velocity</p>
            </div>`,
        target: 'B' 
    },
    {
        domain: 'Time Management (Focus Scheduling)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:10px;">Daily Agenda</h3>
                <div style="border-left:3px solid var(--accent-blue); padding-left:10px; margin-bottom:12px;">
                    <div style="font-size:0.85rem; font-weight:bold;">Deep Work: Project X</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">09:00 AM - 11:30 AM</div>
                </div>
                <div style="border-left:3px solid var(--accent-purple); padding-left:10px;">
                    <div style="font-size:0.85rem; font-weight:bold;">Team Synchronization</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">01:00 PM - 02:00 PM</div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:12px;">Energy Density Map</h3>
                <div style="display:flex; height:60px; gap:4px; align-items:flex-end;">
                    <div style="flex:1; height:80%; background:rgba(41, 151, 255, 0.2); border-radius:4px;"></div>
                    <div style="flex:1; height:100%; background:var(--accent-blue); border-radius:4px;"></div>
                    <div style="flex:1; height:40%; background:rgba(41, 151, 255, 0.4); border-radius:4px;"></div>
                    <div style="flex:1; height:20%; background:rgba(41, 151, 255, 0.1); border-radius:4px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.7rem; color:var(--text-secondary);">
                    <span>Morning</span><span>Peak</span><span>Afternoon</span>
                </div>
            </div>`,
        target: 'A' 
    },
    {
        domain: 'Safety & Security (Privacy Shield)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:12px;">App Permissions</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:0.85rem;">Location Access</span>
                    <div style="width:34px; height:18px; background:var(--accent-blue); border-radius:9px; position:relative;">
                        <div style="width:14px; height:14px; background:white; border-radius:7px; position:absolute; right:2px; top:2px;"></div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.85rem;">Biometric Login</span>
                    <div style="width:34px; height:18px; background:var(--bg-surface); border:1px solid var(--border); border-radius:9px;"></div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; text-align:center;">
                <div style="width:48px; height:48px; background:rgba(48, 209, 88, 0.1); border-radius:24px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 style="font-size:0.9rem; margin-bottom:4px;">Privacy Integrity</h3>
                <div style="font-size:1.2rem; font-weight:800; color:#30d158;">SECURE</div>
                <p style="font-size:0.7rem; color:var(--text-secondary); margin-top:5px;">Real-time Threat Neutralization</p>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Email Filtering (Inbox Management)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:10px;">Primary Inbox</h3>
                <div style="font-size:0.85rem; padding:8px 0; border-bottom:1px solid var(--border);">
                    <div style="font-weight:bold;">Stripe Billing</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">Your subscription was renewed...</div>
                </div>
                <div style="font-size:0.85rem; padding:8px 0;">
                    <div style="font-weight:bold;">Design Weekly</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">Top 10 AI trends for 2026...</div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:12px;">Priority Highlights</h3>
                <div style="background:rgba(255, 159, 10, 0.1); padding:10px; border-radius:8px; border-left:4px solid #ff9f0a;">
                    <div style="font-size:0.8rem; font-weight:bold;">Urgent: Contract Update</div>
                    <p style="font-size:0.7rem; margin-top:4px;">Legal requires your digital signature by EOD.</p>
                </div>
                <p style="text-align:center; font-size:0.7rem; color:var(--text-secondary); margin-top:10px;">Filtered by MindFlow AI</p>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Learning Pathway (Skill Acquisition)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:10px;">Course Curriculum</h3>
                <ul style="padding:0; list-style:none; font-size:0.8rem;">
                    <li style="margin-bottom:8px;">1. Fundamentals of Python</li>
                    <li style="margin-bottom:8px;">2. Data Visualization Basics</li>
                    <li style="margin-bottom:8px; color:var(--text-secondary);">3. Neural Network Design</li>
                </ul>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1rem; margin-bottom:12px;">Adaptive Skill-Gap</h3>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    <span style="background:var(--accent-blue); color:white; padding:4px 8px; border-radius:4px; font-size:0.7rem;">Logic Core</span>
                    <span style="background:var(--bg-surface); border:1px solid var(--border); padding:4px 8px; border-radius:4px; font-size:0.7rem;">Syntax</span>
                    <span style="background:var(--accent-purple); color:white; padding:4px 8px; border-radius:4px; font-size:0.7rem;">ML Theory</span>
                </div>
                <p style="font-size:0.7rem; color:var(--text-secondary); margin-top:12px;">Path optimized for your career goal.</p>
            </div>`,
        target: 'A'
    },
    {
        domain: 'Digital Wellbeing (Emotional Balance)',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <h3 style="font-size:1rem; margin-bottom:15px;">Usage Statistics</h3>
                <div style="font-size:2.2rem; font-weight:800;">4h 12m</div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">Daily Screen Exposure</p>
                <div style="width:100%; height:4px; background:var(--bg-surface); margin-top:12px;">
                    <div style="width:60%; height:100%; background:var(--accent-blue);"></div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; text-align:center;">
                <h3 style="font-size:1rem; margin-bottom:12px;">Cognitive Vibe</h3>
                <div style="font-size:2.5rem;">🧘</div>
                <div style="font-size:1rem; font-weight:bold; color:var(--accent-blue); margin-top:8px;">Focused & Calm</div>
                <p style="font-size:0.7rem; color:var(--text-secondary); margin-top:5px;">Based on app-usage sentiment analysis.</p>
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
