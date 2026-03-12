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
// --- High-Fidelity, Zero-Latency UI Trials (Iqra University Context) ---
const TRIALS = [
    {
        domain: 'Information Density (Course Schedule)',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0;">Today's Classes</h3>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin:4px 0 0 0;">Thursday, March 5, 2026</p>
                    </div>
                    <span style="background:rgba(41, 151, 255, 0.1); color:var(--accent-blue); padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">ISLAMABAD CAMPUS</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div style="display:flex; gap:15px; padding: 12px; background:var(--bg-surface); border-radius:12px; border-left: 4px solid var(--accent-blue);">
                        <div style="min-width:70px;"><span style="display:block; font-weight:700; font-size:1rem;">09:00</span><span style="font-size:0.75rem; color:var(--text-secondary);">AM</span></div>
                        <div>
                            <strong style="display:block; font-size:0.95rem; margin-bottom:2px;">Research Methods 2 (RM-2)</strong>
                            <span style="display:block; font-size:0.8rem; color:var(--text-secondary);">Room 402, Block B • Dr. Farhan</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:15px; padding: 12px; background:var(--bg-surface); border-radius:12px; border-left: 4px solid var(--accent-purple);">
                        <div style="min-width:70px;"><span style="display:block; font-weight:700; font-size:1rem;">11:30</span><span style="font-size:0.75rem; color:var(--text-secondary);">AM</span></div>
                        <div>
                            <strong style="display:block; font-size:0.95rem; margin-bottom:2px;">Cognitive Psychology</strong>
                            <span style="display:block; font-size:0.8rem; color:var(--text-secondary);">Auditorium 1 • Ms. Ayesha</span>
                        </div>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <div style="margin-bottom: 20px;">
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0;">Today's Schedule</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin:4px 0 0 0;">Thursday, March 5, 2026 • Islamabad</p>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div style="background:linear-gradient(135deg, rgba(41,151,255,0.1) 0%, rgba(41,151,255,0.02) 100%); padding:16px; border-radius:16px; border:1px solid rgba(41,151,255,0.2);">
                        <span style="display:inline-block; padding:4px 8px; background:var(--accent-blue); color:white; border-radius:6px; font-size:0.7rem; font-weight:700; margin-bottom:12px;">09:00 AM</span>
                        <strong style="display:block; font-size:0.95rem; margin-bottom:6px; line-height:1.3;">Research Methods 2</strong>
                        <span style="font-size:0.75rem; color:var(--text-secondary);">Room 402 • Dr. Farhan</span>
                    </div>
                    <div style="background:linear-gradient(135deg, rgba(142,68,255,0.1) 0%, rgba(142,68,255,0.02) 100%); padding:16px; border-radius:16px; border:1px solid rgba(142,68,255,0.2);">
                        <span style="display:inline-block; padding:4px 8px; background:var(--accent-purple); color:white; border-radius:6px; font-size:0.7rem; font-weight:700; margin-bottom:12px;">11:30 AM</span>
                        <strong style="display:block; font-size:0.95rem; margin-bottom:6px; line-height:1.3;">Cognitive Psychology</strong>
                        <span style="font-size:0.75rem; color:var(--text-secondary);">Auditorium 1 • Ms. Ayesha</span>
                    </div>
                </div>
            </div>`,
        target: 'B' // Hypothesized preference for modern Bento grid layouts
    },
    {
        domain: 'Data Visualization (HEC Attendance Warning)',
        renderA: () => `
            <div style="padding: 15px; text-align:center;">
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size:1.1rem; margin-bottom:4px;">Cumulative Attendance</h3>
                    <p style="font-size:0.85rem; color:#ff453a; font-weight:600;">Approaching HEC 75% Minimum</p>
                </div>
                <div style="position:relative; width:160px; height:160px; margin:0 auto;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <path stroke="var(--bg-surface)" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path stroke="#ff9f0a" stroke-width="3" stroke-dasharray="78, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <span style="font-size:2.2rem; font-weight:800; color:var(--text-primary);">78%</span>
                        <span style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Present</span>
                    </div>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:20px;">You can only miss 2 more classes in RM-2.</p>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 25px;">
                    <div>
                        <h3 style="font-size:1.1rem; margin-bottom:4px;">Cumulative Attendance</h3>
                        <p style="font-size:0.85rem; color:#ff453a; font-weight:600;">Approaching HEC 75% Minimum</p>
                    </div>
                    <div style="width:40px; height:40px; border-radius:20px; background:rgba(255, 159, 10, 0.1); display:flex; align-items:center; justify-content:center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                </div>
                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:600; font-size:0.9rem;">Present: 31/40 Classes</span>
                        <span style="font-weight:800; font-size:1.1rem; color:#ff9f0a;">78%</span>
                    </div>
                    <div style="width:100%; height:14px; background:var(--bg-surface); border-radius:7px; overflow:hidden;">
                        <div style="width:78%; height:100%; background:linear-gradient(90deg, #ff9f0a 0%, #ff453a 100%); border-radius:7px;"></div>
                    </div>
                </div>
                <div style="padding:12px; background:rgba(255, 69, 58, 0.05); border-left:3px solid #ff453a; border-radius:6px; font-size:0.8rem; color:var(--text-secondary); line-height:1.4;">
                    <strong>Alert:</strong> You can only miss 2 more classes in RM-2 before facing HEC examination block.
                </div>
            </div>`,
        target: 'A' 
    },
    {
        domain: 'Financial Overview (Fee Voucher)',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                    <div style="width:50px; height:50px; border-radius:14px; background:rgba(48, 209, 88, 0.1); display:flex; align-items:center; justify-content:center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <div>
                        <h3 style="font-size:1.1rem; margin:0 0 4px 0;">Spring 2026 Fee Voucher</h3>
                        <p style="font-size:0.8rem; color:#ff453a; margin:0; font-weight:600;">Due Date: March 10, 2026</p>
                    </div>
                </div>
                <div style="background:var(--bg-surface); padding:20px; border-radius:16px; border:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <span style="font-size:0.9rem; color:var(--text-secondary);">Challan No.</span>
                        <span style="font-size:0.9rem; font-family:monospace; font-weight:600;">IU-9938-26</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-top:15px; border-top:1px dashed var(--border);">
                        <span style="font-size:1rem; font-weight:600;">Net Payable</span>
                        <span style="font-size:1.4rem; font-weight:800; color:var(--text-primary);">Rs. 95,500</span>
                    </div>
                </div>
                <button style="width:100%; margin-top:15px; padding:14px; background:var(--text-primary); color:var(--bg-main); border:none; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer;">Pay via Kuickpay</button>
            </div>`,
        renderB: () => `
            <div style="padding: 15px; text-align:center;">
                <div style="width:64px; height:64px; border-radius:32px; background:rgba(48, 209, 88, 0.1); margin:0 auto 15px; display:flex; align-items:center; justify-content:center;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <h3 style="font-size:1.2rem; margin:0 0 5px 0;">Spring 2026 Invoice</h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 25px 0;">Challan: IU-9938-26</p>
                
                <div style="background:var(--bg-surface); padding:20px; border-radius:16px; margin-bottom:20px;">
                    <span style="display:block; font-size:0.85rem; color:#ff453a; font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Due March 10</span>
                    <span style="display:block; font-size:2rem; font-weight:800; letter-spacing:-1px;">Rs. 95,500</span>
                    <p style="font-size:0.75rem; color:var(--text-secondary); margin:8px 0 0 0;">Includes Rs. 2,000 late fee if paid after deadline.</p>
                </div>
                <button style="width:100%; padding:14px; border:2px solid var(--text-primary); background:transparent; color:var(--text-primary); border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer;">View PDF Breakdown</button>
            </div>`,
        target: 'A'
    },
    {
        domain: 'Campus Event (Visual Dominance)',
        renderA: () => `
            <div style="padding: 0; overflow:hidden; border-radius:16px; position:relative;">
                <div style="height: 180px; width: 100%; background: linear-gradient(45deg, #0f2027, #203a43, #2c5364); position:relative; display:flex; align-items:center; justify-content:center;">
                    <div style="position:absolute; width:100%; height:100%; opacity:0.1; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 15px 15px;"></div>
                    <h2 style="color:white; font-size:1.8rem; font-weight:900; text-align:center; line-height:1.1; z-index:2; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">AI in<br>Psychology<br><span style="color:var(--accent-blue);">2026</span></h2>
                </div>
                <div style="padding: 20px; background:var(--bg-surface);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                        <div>
                            <h3 style="font-size:1.1rem; margin:0 0 4px 0;">Guest Speaker Seminar</h3>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Iqra University Main Auditorium</p>
                        </div>
                        <div style="background:var(--bg-main); padding:6px 10px; border-radius:8px; text-align:center; border:1px solid var(--border);">
                            <span style="display:block; font-size:0.7rem; font-weight:700; color:#ff453a; text-transform:uppercase;">Mar</span>
                            <span style="display:block; font-size:1.1rem; font-weight:800;">12</span>
                        </div>
                    </div>
                    <button style="width:100%; padding:12px; background:rgba(255,255,255,0.05); color:var(--text-primary); border:1px solid var(--border); border-radius:8px; font-weight:600; font-size:0.9rem;">RSVP Now</button>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 20px;">
                <div style="display:flex; gap:15px; margin-bottom:20px;">
                    <div style="min-width:60px; height:60px; background:linear-gradient(135deg, #ff453a, #ff9f0a); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white;">
                        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Mar</span>
                        <span style="font-size:1.4rem; font-weight:900; line-height:1;">12</span>
                    </div>
                    <div>
                        <span style="display:inline-block; padding:2px 6px; background:rgba(142,68,255,0.1); color:var(--accent-purple); border-radius:4px; font-size:0.65rem; font-weight:700; margin-bottom:6px;">CAMPUS EVENT</span>
                        <h3 style="font-size:1.2rem; font-weight:800; line-height:1.2; margin:0 0 6px 0;">AI in Psychology: The 2026 Paradigm</h3>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Main Auditorium • 2:00 PM</p>
                    </div>
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5; margin-bottom:20px; border-left:3px solid var(--border); padding-left:12px;">Join industry experts to discuss how generative models are rewriting cognitive behavioral therapy and diagnostic processes.</p>
                <div style="display:flex; gap:10px;">
                    <button style="flex:1; padding:12px; background:var(--text-primary); color:var(--bg-main); border:none; border-radius:8px; font-weight:600; font-size:0.9rem;">RSVP</button>
                    <button style="padding:12px 15px; background:var(--bg-surface); color:var(--text-primary); border:1px solid var(--border); border-radius:8px; font-weight:600; font-size:0.9rem;">Share</button>
                </div>
            </div>`,
        target: 'B'
    },
    {
        domain: 'Interaction (QEC Faculty Evaluation)',
        renderA: () => `
            <div style="padding: 15px;">
                <div style="margin-bottom: 25px;">
                    <span style="display:inline-block; padding:3px 8px; background:rgba(255, 69, 58, 0.1); color:#ff453a; font-size:0.7rem; border-radius:4px; font-weight:700; margin-bottom:8px;">MANDATORY QEC FORM</span>
                    <h3 style="font-size:1.1rem; margin:0 0 6px 0;">RM-2 Instructor Evaluation</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin:0; line-height:1.4;">"The instructor provided clear grading rubrics and feedback."</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="padding:12px 15px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.9rem;">Strongly Agree</span>
                        <div style="width:20px; height:20px; border-radius:10px; border:2px solid var(--border);"></div>
                    </div>
                    <div style="padding:12px 15px; background:rgba(41, 151, 255, 0.1); border:1px solid var(--accent-blue); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.9rem; color:var(--accent-blue); font-weight:600;">Agree</span>
                        <div style="width:20px; height:20px; border-radius:10px; background:var(--accent-blue); display:flex; align-items:center; justify-content:center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    </div>
                    <div style="padding:12px 15px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.9rem;">Neutral</span>
                        <div style="width:20px; height:20px; border-radius:10px; border:2px solid var(--border);"></div>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 15px;">
                <div style="margin-bottom: 30px;">
                    <span style="display:inline-block; padding:3px 8px; background:rgba(255, 69, 58, 0.1); color:#ff453a; font-size:0.7rem; border-radius:4px; font-weight:700; margin-bottom:8px;">MANDATORY QEC FORM</span>
                    <h3 style="font-size:1.1rem; margin:0 0 6px 0;">RM-2 Instructor Evaluation</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin:0; line-height:1.4;">"The instructor provided clear grading rubrics and feedback."</p>
                </div>
                
                <div style="padding: 20px 10px;">
                    <div style="position:relative; width:100%; height:6px; background:var(--bg-surface); border-radius:3px;">
                        <div style="position:absolute; top:0; left:0; height:100%; width:75%; background:var(--accent-blue); border-radius:3px;"></div>
                        <div style="position:absolute; top:-8px; left:75%; width:22px; height:22px; background:white; border-radius:11px; box-shadow:0 2px 6px rgba(0,0,0,0.3); transform:translateX(-50%);"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:0.75rem; color:var(--text-secondary); font-weight:600;">
                        <span>Disagree</span>
                        <span style="color:var(--accent-blue);">Agree</span>
                    </div>
                </div>
            </div>`,
        target: 'A'
    },
    {
        domain: 'Navigation Hierarchy (Digital Library)',
        renderA: () => `
            <div style="padding: 15px; height:100%; display:flex; flex-direction:column;">
                <div style="flex:1;">
                    <h3 style="font-size:1.1rem; margin:0 0 15px 0;">HEC Digital Library</h3>
                    <div style="background:var(--bg-surface); padding:12px 15px; border-radius:12px; display:flex; align-items:center; gap:12px; border:1px solid var(--border);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span style="color:var(--text-secondary); font-size:0.9rem;">Search APA PsycArticles...</span>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:15px;">
                        <span style="padding:4px 10px; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:16px; font-size:0.75rem; color:var(--text-secondary);">JSTOR</span>
                        <span style="padding:4px 10px; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:16px; font-size:0.75rem; color:var(--text-secondary);">PubMed</span>
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding: 0; height:100%; display:flex; flex-direction:column; background:var(--bg-surface); border-radius:16px; overflow:hidden;">
                <div style="padding: 15px; background:var(--bg-main); border-bottom:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="font-size:1.1rem; margin:0;">HEC Digital Library</h3>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </div>
                </div>
                <div style="padding:20px 15px; flex:1;">
                    <div style="display:flex; align-items:center; gap:12px; border-bottom:2px solid var(--accent-blue); padding-bottom:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span style="color:var(--text-secondary); font-size:1rem;">Search APA PsycArticles...</span>
                    </div>
                </div>
            </div>`,
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
    let covariateSelected = false; 
    DOM.btnsFamiliarity.forEach(btn => { 
        btn.addEventListener('click', () => { 
            if (covariateSelected) return; // Prevent double-tap 
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
        // Find which card is the "target" layout (A or B)
        const targetType = trial.target;
        
        // Find the DOM element for that specific layout type
        const targetCard = (leftIsA && targetType === 'A') || (!leftIsA && targetType === 'B') 
            ? cardL 
            : cardR;
        
        const badge = document.createElement('div');
        badge.className = 'ai-recommendation-badge';
        badge.innerHTML = '<span>✨</span> AI Recommended';
        targetCard.appendChild(badge);
    }

    // Start millisecond-accurate timer
    requestAnimationFrame(() => { 
        requestAnimationFrame(() => { 
            STATE.trialStartTime = performance.now(); 
            STATE.isTrialActive = true; 
        }); 
    });
}

function createChoiceCard(type, trial) {
    const card = document.createElement('div');
    card.className = 'bento-choice-card';
    card.innerHTML = type === 'A' ? trial.renderA() : trial.renderB();
    
    // Add mouse move listener for the radial glow effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });

    card.addEventListener('pointerdown', () => {
        if (!STATE.isTrialActive) return;
        
        // Visual feedback
        card.classList.add('selected');
        
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
        // Fallback: Save to localStorage for later recovery
        localStorage.setItem(`telemetry_backup_${STATE.pid}`, JSON.stringify(STATE.results));

        DOM.syncStatus.style.color = "#ff453a";
        DOM.syncStatus.textContent = "Diagnostic Complete. A network timeout occurred. You may safely close this tab.";
    }
}

function onSyncSuccess() {
    DOM.syncStatus.style.display = 'none';
    DOM.finalActions.style.display = 'block';
    DOM.displayPid.innerText = STATE.pid;
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', init);
