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
// --- High-Fidelity, Zero-Latency UI Trials (Iqra University Context) ---
// --- High-Fidelity Generic UI Trials (Universal Context) ---
const TRIALS = [
    {
        domain: 'Data Analytics (System Health)',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size:1.1rem; margin-bottom:4px;">Server CPU Load</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary);">Radial Gauge UI</p>
                </div>
                <div style="position:relative; width:140px; height:140px; margin:0 auto;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <path stroke="var(--bg-surface)" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path stroke="var(--accent-blue)" stroke-width="3" stroke-dasharray="65, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <span style="font-size:2rem; font-weight:800; color:var(--text-primary);">65%</span>
                        <span style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Optimal</span>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 25px;">
                    <div>
                        <h3 style="font-size:1.1rem; margin-bottom:4px;">Server CPU Load</h3>
                        <p style="font-size:0.85rem; color:var(--text-secondary);">Linear Progress UI</p>
                    </div>
                    <div style="width:36px; height:36px; border-radius:18px; background:rgba(41, 151, 255, 0.1); display:flex; align-items:center; justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                </div>
                <div style="margin-bottom:15px; padding-top:20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:600; font-size:0.9rem;">Current Load</span>
                        <span style="font-weight:800; font-size:1.1rem; color:var(--accent-blue);">65%</span>
                    </div>
                    <div style="width:100%; height:12px; background:var(--bg-surface); border-radius:6px; overflow:hidden;">
                        <div style="width:65%; height:100%; background:var(--accent-blue); border-radius:6px;"></div>
                    </div>
                </div>
            </div>`,
        target: 'B' 
    },
    {
        domain: 'E-Commerce (Product Card)',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="height:140px; background:linear-gradient(135deg, #1e293b, #334155); border-radius:12px; margin-bottom:15px; position:relative; overflow:hidden;">
                     <div style="position:absolute; width:100%; height:100%; opacity:0.1; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 10px 10px;"></div>
                </div>
                <h3 style="font-size:1.1rem; margin:0 0 4px 0;">Aura Noise-Canceling Headphones</h3>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin:0 0 12px 0;">40-hour battery life • Matte Black</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.2rem; font-weight:800;">$249.00</span>
                    <button style="padding:8px 16px; background:var(--text-primary); color:var(--bg-main); border:none; border-radius:6px; font-weight:600; font-size:0.85rem;">Add to Cart</button>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; display:flex; gap:15px; align-items:center; height:100%;">
                <div style="width:100px; height:100px; background:linear-gradient(135deg, #1e293b, #334155); border-radius:12px; flex-shrink:0; position:relative;">
                     <span style="position:absolute; top:-5px; left:-5px; background:var(--accent-purple); color:white; font-size:0.65rem; padding:2px 6px; border-radius:4px; font-weight:bold;">SALE</span>
                </div>
                <div style="flex:1;">
                    <h3 style="font-size:1rem; margin:0 0 4px 0; line-height:1.2;">Aura Wireless Headphones</h3>
                    <div style="display:flex; gap:4px; margin-bottom:8px;">
                        <span style="color:#fbbf24; font-size:0.8rem;">★★★★☆</span>
                        <span style="color:var(--text-secondary); font-size:0.75rem;">(1.2k)</span>
                    </div>
                    <div style="font-size:1.1rem; font-weight:800; margin-bottom:8px;">$249.00</div>
                    <button style="width:100%; padding:6px; background:transparent; border:1px solid var(--text-primary); color:var(--text-primary); border-radius:6px; font-weight:600; font-size:0.8rem;">Add</button>
                </div>
            </div>`,
        target: 'A' 
    },
    {
        domain: 'Settings (Notification Toggles)',
        renderA: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1.1rem; margin:0 0 15px 0; border-bottom:1px solid var(--border); padding-bottom:10px;">Preferences</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0;">
                    <div>
                        <strong style="display:block; font-size:0.95rem;">Email Summaries</strong>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Receive weekly digest</span>
                    </div>
                    <div style="width:44px; height:24px; background:var(--accent-blue); border-radius:12px; position:relative;">
                        <div style="width:20px; height:20px; background:white; border-radius:10px; position:absolute; right:2px; top:2px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0;">
                    <div>
                        <strong style="display:block; font-size:0.95rem;">Push Notifications</strong>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Real-time alerts on mobile</span>
                    </div>
                    <div style="width:44px; height:24px; background:var(--bg-surface); border:1px solid var(--border); border-radius:12px; position:relative;">
                        <div style="width:20px; height:20px; background:var(--text-secondary); border-radius:10px; position:absolute; left:2px; top:1px;"></div>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1.1rem; margin:0 0 15px 0;">Notification Routing</h3>
                <div style="background:var(--bg-surface); border-radius:8px; border:1px solid var(--border); overflow:hidden;">
                    <div style="padding:12px 15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.95rem; font-weight:600;">Email Summaries</span>
                        <div style="display:flex; background:var(--bg-main); border-radius:6px; overflow:hidden; border:1px solid var(--border);">
                            <span style="padding:4px 10px; font-size:0.75rem; background:var(--accent-blue); color:white; font-weight:bold;">ON</span>
                            <span style="padding:4px 10px; font-size:0.75rem; color:var(--text-secondary);">OFF</span>
                        </div>
                    </div>
                    <div style="padding:12px 15px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.95rem; font-weight:600;">Push Alerts</span>
                        <div style="display:flex; background:var(--bg-main); border-radius:6px; overflow:hidden; border:1px solid var(--border);">
                            <span style="padding:4px 10px; font-size:0.75rem; color:var(--text-secondary);">ON</span>
                            <span style="padding:4px 10px; font-size:0.75rem; background:var(--bg-surface); color:var(--text-primary); font-weight:bold;">OFF</span>
                        </div>
                    </div>
                </div>
            </div>`,
        target: 'A'
    },
    {
        domain: 'SaaS Pricing (Subscription Tiers)',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <span style="display:inline-block; padding:3px 10px; background:rgba(142,68,255,0.1); color:var(--accent-purple); font-size:0.75rem; font-weight:bold; border-radius:12px; margin-bottom:10px;">PRO PLAN</span>
                <h3 style="font-size:2rem; margin:0 0 5px 0;">$29<span style="font-size:1rem; color:var(--text-secondary); font-weight:normal;">/mo</span></h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 20px 0;">Billed annually</p>
                
                <ul style="list-style:none; padding:0; margin:0 0 20px 0; text-align:left; font-size:0.85rem;">
                    <li style="margin-bottom:8px;">✓ Unlimited Projects</li>
                    <li style="margin-bottom:8px;">✓ 500GB Cloud Storage</li>
                    <li style="margin-bottom:8px;">✓ Priority Support</li>
                </ul>
                <button style="width:100%; padding:12px; background:var(--accent-purple); color:white; border:none; border-radius:8px; font-weight:bold;">Upgrade Now</button>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; display:flex; flex-direction:column; height:100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid var(--border);">
                    <div>
                        <h3 style="font-size:1.2rem; margin:0 0 2px 0;">Pro Tier</h3>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Unlimited Access</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="display:block; font-size:1.4rem; font-weight:800;">$29</span>
                        <span style="font-size:0.7rem; color:var(--text-secondary);">per month</span>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:var(--bg-surface); padding:10px; border-radius:6px; text-align:center; border:1px solid var(--border);">
                        <span style="display:block; font-size:1.2rem; margin-bottom:4px;">∞</span>
                        <span style="font-size:0.7rem; color:var(--text-secondary);">Projects</span>
                    </div>
                    <div style="background:var(--bg-surface); padding:10px; border-radius:6px; text-align:center; border:1px solid var(--border);">
                        <span style="display:block; font-size:0.9rem; font-weight:bold; margin-bottom:4px;">500GB</span>
                        <span style="font-size:0.7rem; color:var(--text-secondary);">Storage</span>
                    </div>
                </div>
                <button style="width:100%; padding:12px; border:2px solid var(--text-primary); background:transparent; color:var(--text-primary); border-radius:8px; font-weight:bold; margin-top:auto;">Select Plan</button>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Navigation (App Menu)',
        renderA: () => `
            <div style="padding: 0; height:100%; display:flex; flex-direction:column; background:var(--bg-surface);">
                <div style="padding: 15px; background:var(--bg-main); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="font-size:1.1rem; margin:0;">Dashboard</h3>
                    <div style="width:32px; height:32px; border-radius:16px; background:linear-gradient(45deg, #ff453a, #ff9f0a);"></div>
                </div>
                <div style="display:flex; justify-content:space-around; padding:15px; border-bottom:1px solid var(--border); background:var(--bg-main);">
                    <span style="font-size:0.85rem; font-weight:bold; color:var(--accent-blue); border-bottom:2px solid var(--accent-blue); padding-bottom:4px;">Home</span>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Activity</span>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Files</span>
                </div>
                <div style="padding:20px; text-align:center; color:var(--text-secondary); font-size:0.9rem; flex:1;">
                    Content Viewport
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 0; height:100%; display:flex; background:var(--bg-surface);">
                <div style="width:100px; background:var(--bg-main); border-right:1px solid var(--border); display:flex; flex-direction:column; align-items:center; padding:20px 0; gap:25px;">
                    <div style="width:36px; height:36px; border-radius:8px; background:rgba(41,151,255,0.1); color:var(--accent-blue); display:flex; align-items:center; justify-content:center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                    </div>
                    <div style="width:36px; height:36px; color:var(--text-secondary); display:flex; align-items:center; justify-content:center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div style="width:36px; height:36px; color:var(--text-secondary); display:flex; align-items:center; justify-content:center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    </div>
                </div>
                <div style="flex:1; padding:20px; display:flex; flex-direction:column;">
                    <h3 style="font-size:1.1rem; margin:0 0 20px 0;">Home</h3>
                    <div style="text-align:center; color:var(--text-secondary); font-size:0.9rem; margin-top:20px;">
                        Content Viewport
                    </div>
                </div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Account Security (Authentication)',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="text-align:center; margin-bottom:20px;">
                    <div style="width:50px; height:50px; border-radius:25px; background:rgba(48, 209, 88, 0.1); margin:0 auto 10px; display:flex; align-items:center; justify-content:center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h3 style="font-size:1.1rem; margin:0 0 4px 0;">Two-Factor Auth</h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">Protect your account.</p>
                </div>
                <input type="text" placeholder="Enter 6-digit code" style="width:100%; padding:12px; background:var(--bg-surface); border:1px solid var(--border); color:var(--text-primary); border-radius:8px; margin-bottom:15px; font-size:1rem; text-align:center; letter-spacing:4px;">
                <button style="width:100%; padding:12px; background:var(--text-primary); color:var(--bg-main); border:none; border-radius:8px; font-weight:bold;">Verify</button>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <h3 style="font-size:1.1rem; margin:0 0 8px 0;">Security Verification</h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 20px 0; line-height:1.4;">We sent a code to your registered device. Enter it below to continue.</p>
                
                <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:20px;">
                    <div style="flex:1; height:45px; background:var(--bg-surface); border:1px solid var(--accent-blue); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:bold;">4</div>
                    <div style="flex:1; height:45px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px;"></div>
                    <div style="flex:1; height:45px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px;"></div>
                    <div style="flex:1; height:45px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px;"></div>
                </div>
                
                <button style="width:100%; padding:12px; background:var(--bg-surface); color:var(--text-primary); border:1px solid var(--border); border-radius:8px; font-weight:bold;">Resend Code</button>
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
    DOM.textareaJustification.addEventListener('input', (e) => {
        DOM.btnFinalize.disabled = e.target.value.trim().length < 5;
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

    const handlePointerDown = (e) => {
        if (!STATE.isTrialActive) return;

        e.preventDefault();
        STATE.isTrialActive = false;

        card.removeEventListener('pointerdown', handlePointerDown);
        card.classList.add('selected');

        handleUserSelection(type, trial);
    };

    card.addEventListener('pointerdown', handlePointerDown);

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
