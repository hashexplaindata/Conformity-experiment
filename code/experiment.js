// ============================================================
// BEHAVIORAL DIAGNOSTIC TOOL — EXPERIMENT ENGINE
// Zero-dependency, edge-computed telemetry.
// Uses performance.now() for sub-millisecond reaction times.
// ============================================================

'use strict';

// ---- Configuration & Condition ----
const params = new URLSearchParams(window.location.search);
const CFG = Object.freeze({
    NUM_TRIALS: 6,
    CONDITION: params.get('condition') === 'ai' ? 'AI_Labeled' : 'Control',
    // --- FIREBASE CONFIGURATION ---
    FIREBASE: {
        apiKey: "AIzaSyASh34UQq-gOOgEkmGMZcnybxRrSDuF6yU",
        authDomain: "conformity-experiment.firebaseapp.com",
        projectId: "conformity-experiment",
        storageBucket: "conformity-experiment.firebasestorage.app",
        messagingSenderId: "197222848320",
        appId: "1:197222848320:web:0afaeb8953330c11cbcca5"
    }
});

// Initialize Firebase (if config is provided)
let db = null;
if (CFG.FIREBASE.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(CFG.FIREBASE);
    db = firebase.firestore();
}

// ---- Participant & State ----
function generatePID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const STATE = {
    pid: generatePID(),
    condition: CFG.CONDITION,
    baselineFamiliarity: 0,
    currentTrial: 0,
    results: [],
    startTime: 0,
    trialStartTime: 0
};

// ============================================================
// TRIAL DEFINITIONS (6 Specified Pairs)
// ============================================================
const TRIALS = [
    {
        id: 'T1_Schedule',
        domain: 'Information Density',
        renderA: () => `
            <div class="mockup">
                <div class="mock-header">Weekly Schedule</div>
                <div class="mock-schedule-list">
                    <div class="mock-schedule-item">CS101: 9:00 AM - 10:30 AM</div>
                    <div class="mock-schedule-item">MATH202: 11:00 AM - 12:30 PM</div>
                    <div class="mock-schedule-item">PHYS301: 2:00 PM - 3:30 PM</div>
                </div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-header">Weekly Schedule</div>
                <div class="mock-schedule-grid">
                    <div class="mock-schedule-card">CS101<br>9:00</div>
                    <div class="mock-schedule-card">MATH202<br>11:00</div>
                    <div class="mock-schedule-card">PHYS301<br>2:00</div>
                </div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    },
    {
        id: 'T2_Attendance',
        domain: 'Data Visualization',
        renderA: () => `
            <div class="mockup">
                <div class="mock-header">Attendance</div>
                <div class="mock-chart-donut">85%</div>
                <div style="text-align:center;margin-top:0.5rem;font-size:0.8rem;">Present</div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-header">Attendance</div>
                <div class="mock-progress-bar"><div class="mock-progress-fill"></div></div>
                <div style="text-align:center;margin-top:0.5rem;font-size:0.8rem;">85% Present</div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    },
    {
        id: 'T3_Library',
        domain: 'Navigation Hierarchy',
        renderA: () => `
            <div class="mockup" style="padding-bottom:60px;">
                <div class="mock-header">Library Portal</div>
                <div class="mock-nav-bottom">
                    <span>🏠</span><span>🔍</span><span>🔖</span>
                </div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-nav-hamburger"><span></span><span></span><span></span></div>
                <div class="mock-header" style="margin-left:3rem;">Library Portal</div>
                <div style="margin-top:2rem;opacity:0.3;">Main Content Area...</div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    },
    {
        id: 'T4_News',
        domain: 'Typographical Dominance',
        renderA: () => `
            <div class="mockup">
                <div class="mock-news-serif">Campus News: New Research Grant Announced</div>
                <div style="margin-top:1rem;font-size:0.8rem;color:var(--text-secondary);">The university has received a $2M grant for AI research...</div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-news-sans">Campus News: New Research Grant Announced</div>
                <div style="margin-top:1rem;font-size:0.8rem;color:var(--text-secondary);">The university has received a $2M grant for AI research...</div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    },
    {
        id: 'T5_Enrollment',
        domain: 'Interaction Design',
        renderA: () => `
            <div class="mockup">
                <div class="mock-header">Course Registration</div>
                <div class="mock-btn-wide">Enroll Now</div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-header">Course Registration</div>
                <div class="mock-fab">✨</div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    },
    {
        id: 'T6_Professor',
        domain: 'Qualitative Feedback',
        renderA: () => `
            <div class="mockup">
                <div class="mock-header">Rate Professor</div>
                <div class="mock-stars">★★★★★</div>
            </div>`,
        renderB: () => `
            <div class="mockup">
                <div class="mock-header">Rate Professor</div>
                <input type="range" class="mock-slider" value="8" min="1" max="10">
                <div style="display:flex;justify-content:space-between;font-size:0.6rem;margin-top:0.5rem;"><span>1</span><span>10</span></div>
            </div>`,
        targetPos: Math.random() > 0.5 ? 'A' : 'B'
    }
];

// ---- DOM Elements ----
const EL = {
    screenWelcome: document.getElementById('screen-welcome'),
    screenTrial: document.getElementById('screen-trial'),
    screenComplete: document.getElementById('screen-complete'),
    trialGrid: document.getElementById('trial-grid'),
    trialCounter: document.getElementById('trial-counter'),
    progressFill: document.getElementById('progress-fill'),
    btnStart: document.getElementById('btn-start'),
    baselineBtns: document.querySelectorAll('.btn-option'),
    rationaleText: document.getElementById('rationale-text'),
    btnSubmitData: document.getElementById('btn-submit-data'),
    finalSuccess: document.getElementById('final-success'),
    btnDownload: document.getElementById('btn-download')
};

// ---- Initialization ----
function init() {
    EL.baselineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            EL.baselineBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            STATE.baselineFamiliarity = parseInt(btn.dataset.val);
            EL.btnStart.disabled = false;
        });
    });

    EL.btnStart.addEventListener('click', startExperiment);
    EL.btnSubmitData.addEventListener('click', submitFinalTelemetry);
    EL.btnDownload.addEventListener('click', downloadCSV);

    console.log(`Initialized in ${STATE.condition} condition. PID: ${STATE.pid}`);
}

function startExperiment() {
    EL.screenWelcome.classList.remove('active');
    EL.screenTrial.classList.add('active');
    STATE.startTime = performance.now();
    loadTrial();
}

function loadTrial() {
    const trial = TRIALS[STATE.currentTrial];
    EL.trialCounter.innerText = `TRIAL ${STATE.currentTrial + 1} OF ${CFG.NUM_TRIALS}`;
    EL.progressFill.style.width = `${((STATE.currentTrial) / CFG.NUM_TRIALS) * 100}%`;

    const leftIsA = Math.random() > 0.5;
    const htmlA = trial.renderA();
    const htmlB = trial.renderB();

    EL.trialGrid.innerHTML = leftIsA ? htmlA + htmlB : htmlB + htmlA;

    if (STATE.condition === 'AI_Labeled') {
        const targetSide = (leftIsA && trial.targetPos === 'A') || (!leftIsA && trial.targetPos === 'B') ? 0 : 1;
        const targetEl = EL.trialGrid.children[targetSide];
        const badge = document.createElement('div');
        badge.className = 'ai-badge';
        badge.innerHTML = '<span>✨</span> AI Suggested';
        targetEl.appendChild(badge);
    }

    STATE.trialStartTime = performance.now();

    Array.from(EL.trialGrid.children).forEach((el, idx) => {
        el.addEventListener('click', () => handleChoice(idx, leftIsA));
    });
}

function handleChoice(selectedIdx, leftIsA) {
    const rt = performance.now() - STATE.trialStartTime;
    const trial = TRIALS[STATE.currentTrial];
    
    const selection = (selectedIdx === 0 && leftIsA) || (selectedIdx === 1 && !leftIsA) ? 'A' : 'B';
    const choseTarget = selection === trial.targetPos;

    STATE.results.push({
        participant_id: STATE.pid,
        experimental_condition: STATE.condition === 'AI_Labeled' ? 1 : 0,
        ai_familiarity: STATE.baselineFamiliarity,
        trial_sequence: STATE.currentTrial + 1,
        ui_domain: trial.domain,
        trial_id: trial.id,
        reaction_time_ms: rt.toFixed(2),
        user_selection: selection,
        ai_badge_position: trial.targetPos,
        chose_target: choseTarget ? 1 : 0
    });

    STATE.currentTrial++;

    if (STATE.currentTrial < CFG.NUM_TRIALS) {
        loadTrial();
    } else {
        completeExperiment();
    }
}

function completeExperiment() {
    EL.screenTrial.classList.remove('active');
    EL.screenComplete.classList.add('active');
    
    const totalTrials = STATE.results.length;
    const conformityCount = STATE.results.filter(r => r.chose_target === 1).length;
    const conformityScore = Math.round((conformityCount / totalTrials) * 100);
    
    document.getElementById('ring-val').innerText = `${conformityScore}%`;
    document.getElementById('ring-fg').style.strokeDashoffset = 251.2 - (251.2 * conformityScore / 100);
    
    const avgSpeed = (STATE.results.reduce((acc, r) => acc + parseFloat(r.reaction_time_ms), 0) / totalTrials / 1000).toFixed(2);
    document.getElementById('speed-value').innerText = avgSpeed;
    
    document.getElementById('result-condition').innerText = STATE.condition;
    document.getElementById('result-pid').innerText = STATE.pid;
}

async function submitFinalTelemetry() {
    const rationale = EL.rationaleText.value.trim();
    if (!rationale) {
        alert("Please provide a brief rationale before submitting.");
        return;
    }

    STATE.results.forEach(r => r.semantic_justification = rationale);

    EL.btnSubmitData.disabled = true;
    EL.btnSubmitData.innerText = "Synchronizing to Firebase...";

    try {
        if (db) {
            // Write each trial as a separate document in the 'telemetry' collection
            const batch = db.batch();
            STATE.results.forEach(r => {
                const docRef = db.collection('telemetry').doc();
                batch.set(docRef, {
                    ...r,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            await batch.commit();
            console.log("Payload synchronized to Firebase Firestore.");
        } else {
            console.log("Firebase not initialized. Payload (Tidy Data Long Format):", STATE.results);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        document.getElementById('rationale-container').style.display = 'none';
        EL.finalSuccess.style.display = 'block';
    } catch (err) {
        console.error("Firebase sync failed:", err);
        alert("Cloud sync failed. Error: " + err.message + "\nPlease download the CSV backup.");
        EL.btnSubmitData.disabled = false;
        EL.btnSubmitData.innerText = "Retry Submission";
    }
}

function downloadCSV() {
    const headers = Object.keys(STATE.results[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of STATE.results) {
        const values = headers.map(header => {
            const val = row[header];
            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        });
        csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_${STATE.pid}.csv`;
    a.click();
}

window.addEventListener('DOMContentLoaded', init);
