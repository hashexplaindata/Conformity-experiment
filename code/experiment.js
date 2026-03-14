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
// ============================================================
// TRIALS ARRAY — Drop-in replacement for experiment.js
// Replace the entire const TRIALS = [...] block with this.
// 6 domains: Streaming, Music, Email, Jobs, Shopping, News
// All from apps actively being "AI-fied" in 2026
// target 'A'/'B' distribution: 3A / 3B (balanced)
// ============================================================

const TRIALS = [

    // ── TRIAL 1 ── Streaming / Netflix-style ─────────────────
    {
        domain: 'Content Discovery (Streaming)',
        renderA: () => `
            <div style="padding:0; height:100%; display:flex; flex-direction:column; overflow:hidden;">
                <div style="height:155px; background:linear-gradient(155deg, #0f0c29 0%, #302b63 50%, #24243e 100%); position:relative; flex-shrink:0; display:flex; align-items:flex-end; padding:14px;">
                    <div style="position:absolute;inset:0;background-image:radial-gradient(ellipse at 25% 40%, rgba(229,9,20,0.18) 0%, transparent 65%), radial-gradient(ellipse at 80% 60%, rgba(168,85,247,0.12) 0%, transparent 55%);"></div>
                    <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);padding:2px 7px;border-radius:3px;font-size:0.65rem;color:white;font-weight:700;border:1px solid rgba(255,255,255,0.2);">16+</div>
                    <div style="z-index:1;">
                        <span style="display:inline-block;padding:2px 7px;background:rgba(229,9,20,0.85);color:white;font-size:0.6rem;font-weight:800;border-radius:3px;margin-bottom:6px;letter-spacing:0.08em;text-transform:uppercase;">Series</span>
                        <h3 style="color:white;font-size:1.25rem;font-weight:800;margin:0;text-shadow:0 2px 10px rgba(0,0,0,0.9);line-height:1.1;">Echoes of Tomorrow</h3>
                    </div>
                </div>
                <div style="padding:14px; flex:1;">
                    <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
                        <span style="padding:2px 7px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:3px;font-size:0.68rem;color:var(--text-secondary);">Sci-Fi</span>
                        <span style="padding:2px 7px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:3px;font-size:0.68rem;color:var(--text-secondary);">Thriller</span>
                        <span style="padding:2px 7px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:3px;font-size:0.68rem;color:var(--text-secondary);">Drama</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="color:#e5b80b;font-size:0.82rem;font-weight:600;">★ 8.4</span>
                            <span style="color:var(--text-secondary);font-size:0.75rem;">S2 · 8 Episodes</span>
                        </div>
                        <span style="font-size:0.75rem;color:var(--text-secondary);">~48 min</span>
                    </div>
                    <p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.5;margin:0 0 12px 0;">A physicist discovers her past decisions are rewriting the present — one memory at a time.</p>
                    <button style="width:100%;padding:9px;background:var(--text-primary);color:var(--bg-main);border:none;border-radius:7px;font-weight:700;font-size:0.85rem;cursor:default;">▶ Play</button>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.1em;margin:0;">Recommended For You</h3>
                    <span style="font-size:0.7rem;color:var(--accent-blue);">See all</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:11px;flex:1;">
                    ${[
                        {title:'Echoes of Tomorrow', meta:'Sci-Fi · Thriller · 48 min', rating:'8.4', match:'97', grad:'#0f0c29, #302b63'},
                        {title:'The Quiet Frequency', meta:'Mystery · Drama · 52 min', rating:'7.9', match:'91', grad:'#1a0533, #4a1a7a'},
                        {title:'Meridian', meta:'Action · Sci-Fi · 44 min', rating:'8.1', match:'88', grad:'#0d1f30, #1a4060'},
                        {title:'Cold Signal', meta:'Crime · Drama · 55 min', rating:'7.6', match:'85', grad:'#1a1a0d, #3d3d1a'}
                    ].map(item => `
                        <div style="display:flex;gap:11px;align-items:center;">
                            <div style="width:58px;height:58px;border-radius:7px;background:linear-gradient(155deg,${item.grad});flex-shrink:0;"></div>
                            <div style="flex:1;min-width:0;">
                                <strong style="display:block;font-size:0.88rem;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.title}</strong>
                                <span style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:3px;">${item.meta}</span>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="color:#e5b80b;font-size:0.72rem;">★ ${item.rating}</span>
                                    <span style="font-size:0.68rem;color:rgba(48,209,88,0.9);font-weight:700;">${item.match}% Match</span>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        target: 'A'
    },

    // ── TRIAL 2 ── Music / Spotify-style ─────────────────────
    {
        domain: 'Music Discovery (Audio Streaming)',
        renderA: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <div style="margin-bottom:14px;">
                    <h3 style="font-size:1rem;font-weight:700;margin:0 0 2px 0;">Daily Mix 3</h3>
                    <p style="font-size:0.78rem;color:var(--text-secondary);margin:0;">Based on your recent listening</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1;">
                    ${[
                        {title:'Neon Static', artist:'HVME', grad:'#1a0a3e,#5a1a8a', dur:'3:42'},
                        {title:'Late Drive', artist:'Jungle', grad:'#0a1f0a,#1a5a1a', dur:'4:11'},
                        {title:'Glass Walls', artist:'FKJ', grad:'#3e1a0a,#8a4a1a', dur:'3:28'},
                        {title:'Sundowner', artist:'Polo & Pan', grad:'#0a2a3e,#1a6a8a', dur:'5:03'}
                    ].map((t,i) => `
                        <div style="background:linear-gradient(145deg,${t.grad});border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;min-height:90px;">
                            <div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,0.06) 0%,transparent 60%);"></div>
                            <div style="font-size:0.65rem;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">#${i+1}</div>
                            <div>
                                <div style="font-size:0.85rem;font-weight:700;color:white;margin-bottom:2px;">${t.title}</div>
                                <div style="font-size:0.72rem;color:rgba(255,255,255,0.65);">${t.artist}</div>
                            </div>
                        </div>`).join('')}
                </div>
                <div style="margin-top:12px;display:flex;justify-content:center;gap:20px;align-items:center;">
                    <span style="font-size:1.2rem;color:var(--text-secondary);">⏮</span>
                    <div style="width:40px;height:40px;background:var(--text-primary);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--bg-main);">▶</div>
                    <span style="font-size:1.2rem;color:var(--text-secondary);">⏭</span>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <div style="margin-bottom:12px;display:flex;gap:12px;align-items:center;">
                    <div style="width:52px;height:52px;border-radius:8px;background:linear-gradient(145deg,#1a0a3e,#5a1a8a);flex-shrink:0;"></div>
                    <div>
                        <h3 style="font-size:0.95rem;font-weight:700;margin:0 0 2px 0;">Daily Mix 3</h3>
                        <p style="font-size:0.75rem;color:var(--text-secondary);margin:0;">Spotify · 12 songs</p>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:1px;flex:1;">
                    ${[
                        {n:1,title:'Neon Static',artist:'HVME',dur:'3:42',active:true},
                        {n:2,title:'Late Drive',artist:'Jungle',dur:'4:11',active:false},
                        {n:3,title:'Glass Walls',artist:'FKJ',dur:'3:28',active:false},
                        {n:4,title:'Sundowner',artist:'Polo & Pan',dur:'5:03',active:false},
                        {n:5,title:'Chromakey',artist:'Bonobo',dur:'4:55',active:false}
                    ].map(t => `
                        <div style="display:flex;align-items:center;gap:12px;padding:8px;border-radius:7px;background:${t.active?'rgba(29,185,84,0.08)':'transparent'};">
                            <span style="width:20px;text-align:center;font-size:0.8rem;color:${t.active?'#1db954':'var(--text-secondary)'};font-weight:${t.active?'700':'400'};">${t.active?'▶':t.n}</span>
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:0.88rem;font-weight:${t.active?'700':'500'};color:${t.active?'#1db954':'var(--text-primary)'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.title}</div>
                                <div style="font-size:0.72rem;color:var(--text-secondary);">${t.artist}</div>
                            </div>
                            <span style="font-size:0.72rem;color:var(--text-secondary);">${t.dur}</span>
                        </div>`).join('')}
                </div>
            </div>`,
        target: 'B'
    },

    // ── TRIAL 3 ── Email / Gmail-style ───────────────────────
    {
        domain: 'Inbox Triage (Email Client)',
        renderA: () => `
            <div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:0.8rem;font-weight:700;">Priority Inbox</span>
                        <span style="background:rgba(234,67,53,0.15);color:#ea4335;font-size:0.65rem;font-weight:700;padding:1px 6px;border-radius:10px;">4 new</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div style="display:flex;flex-direction:column;overflow:hidden;flex:1;">
                    ${[
                        {from:'Sarah Chen',sub:'Re: Q1 Strategy Doc',prev:'Looks great — I\'ve added my comments on slide 4...',time:'9:41 AM',unread:true,dot:'#4285f4'},
                        {from:'GitHub',sub:'[Action Required] New sign-in detected',prev:'Someone signed in to your account from a new device.',time:'8:15 AM',unread:true,dot:'#ea4335'},
                        {from:'Notion',sub:'Weekly digest: 3 updates in your workspace',prev:'Your team added 3 new pages this week. Here\'s a summary...',time:'7:00 AM',unread:true,dot:'#fbbc04'},
                        {from:'Marcus Webb',sub:'Lunch tomorrow?',prev:'Hey, are you free around 1pm? Wanted to catch up.',time:'Yesterday',unread:false,dot:''}
                    ].map(e => `
                        <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);background:${e.unread?'rgba(255,255,255,0.02)':'transparent'};">
                            <div style="width:34px;height:34px;border-radius:17px;background:${e.dot?e.dot:'var(--bg-surface)'};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:white;">${e.from[0]}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                                    <span style="font-size:0.82rem;font-weight:${e.unread?'700':'500'};color:${e.unread?'var(--text-primary)':'var(--text-secondary)'};">${e.from}</span>
                                    <span style="font-size:0.7rem;color:var(--text-secondary);">${e.time}</span>
                                </div>
                                <div style="font-size:0.8rem;font-weight:${e.unread?'600':'400'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:1px;">${e.sub}</div>
                                <div style="font-size:0.72rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.prev}</div>
                            </div>
                            ${e.unread?'<div style="width:7px;height:7px;border-radius:50%;background:#4285f4;flex-shrink:0;margin-top:6px;"></div>':''}
                        </div>`).join('')}
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="display:flex;border-bottom:1px solid var(--border);">
                    ${[
                        {label:'Primary',count:4,active:true},
                        {label:'Social',count:12,active:false},
                        {label:'Promos',count:37,active:false}
                    ].map(tab => `
                        <div style="flex:1;padding:10px 5px;text-align:center;border-bottom:${tab.active?'2px solid #4285f4':'2px solid transparent'};cursor:pointer;">
                            <span style="font-size:0.78rem;font-weight:${tab.active?'700':'500'};color:${tab.active?'#4285f4':'var(--text-secondary)'};">${tab.label}</span>
                            ${tab.count?`<span style="margin-left:5px;background:${tab.active?'rgba(66,133,244,0.15)':'rgba(255,255,255,0.08)'};color:${tab.active?'#4285f4':'var(--text-secondary)'};font-size:0.62rem;font-weight:700;padding:1px 5px;border-radius:8px;">${tab.count}</span>`:''}
                        </div>`).join('')}
                </div>
                <div style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
                    ${[
                        {from:'Sarah Chen',sub:'Re: Q1 Strategy Doc',prev:'I\'ve added comments on slide 4...',time:'9:41 AM',unread:true},
                        {from:'GitHub',sub:'[Action Required] New sign-in',prev:'New sign-in detected on your account.',time:'8:15 AM',unread:true},
                        {from:'Notion',sub:'Weekly digest: 3 updates',prev:'Your team added 3 new pages this week.',time:'7:00 AM',unread:true},
                        {from:'Marcus Webb',sub:'Lunch tomorrow?',prev:'Are you free around 1pm?',time:'Yesterday',unread:false}
                    ].map(e => `
                        <div style="display:flex;align-items:flex-start;gap:10px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,0.04);">
                            <div style="width:32px;height:32px;border-radius:16px;background:var(--bg-surface);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;border:1px solid var(--border);">${e.from[0]}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;justify-content:space-between;margin-bottom:1px;">
                                    <span style="font-size:0.8rem;font-weight:${e.unread?'700':'400'};">${e.from}</span>
                                    <span style="font-size:0.68rem;color:var(--text-secondary);">${e.time}</span>
                                </div>
                                <div style="font-size:0.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary);">${e.sub} — <span style="color:rgba(255,255,255,0.35)">${e.prev}</span></div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        target: 'A'
    },

    // ── TRIAL 4 ── Jobs / LinkedIn-style ─────────────────────
    {
        domain: 'Job Discovery (Career Platform)',
        renderA: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <h3 style="font-size:0.82rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Jobs for You</h3>
                <div style="display:flex;flex-direction:column;gap:9px;flex:1;">
                    ${[
                        {title:'Senior Data Analyst',co:'Stripe',loc:'Remote',sal:'$120k–$160k',tag:'Easy Apply',match:96,new:true},
                        {title:'Product Analyst',co:'Notion',loc:'SF · Hybrid',sal:'$105k–$140k',tag:'',match:91,new:false},
                        {title:'BI Engineer',co:'Shopify',loc:'Remote',sal:'$115k–$155k',tag:'Easy Apply',match:89,new:true},
                        {title:'Analytics Lead',co:'Linear',loc:'NYC · On-site',sal:'$130k–$175k',tag:'',match:84,new:false}
                    ].map(j => `
                        <div style="display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--bg-surface);border:1px solid var(--border);border-radius:9px;">
                            <div style="width:36px;height:36px;border-radius:8px;background:var(--bg-main);border:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:var(--text-primary);">${j.co[0]}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;align-items:center;gap:5px;margin-bottom:1px;">
                                    <span style="font-size:0.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${j.title}</span>
                                    ${j.new?'<span style="background:rgba(0,122,255,0.12);color:var(--accent-blue);font-size:0.6rem;padding:1px 5px;border-radius:3px;font-weight:700;flex-shrink:0;">NEW</span>':''}
                                </div>
                                <div style="font-size:0.72rem;color:var(--text-secondary);">${j.co} · ${j.loc} · ${j.sal}</div>
                            </div>
                            <div style="text-align:right;flex-shrink:0;">
                                <div style="font-size:0.7rem;color:rgba(48,209,88,0.9);font-weight:700;">${j.match}%</div>
                                ${j.tag?`<span style="font-size:0.62rem;color:var(--accent-blue);font-weight:600;">${j.tag}</span>`:''}
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="background:linear-gradient(135deg, #0a2038, #0f3a60);height:80px;position:relative;flex-shrink:0;">
                    <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%, rgba(41,151,255,0.15) 0%, transparent 60%);"></div>
                </div>
                <div style="padding:0 14px;transform:translateY(-20px);">
                    <div style="width:44px;height:44px;border-radius:10px;background:var(--bg-card);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:900;margin-bottom:8px;">S</div>
                    <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 2px 0;">Senior Data Analyst</h3>
                    <p style="font-size:0.82rem;color:var(--text-secondary);margin:0 0 10px 0;">Stripe · Remote · Full-time</p>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                        <div style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:26px;border:3px solid rgba(48,209,88,0.4);position:relative;">
                            <svg style="position:absolute;inset:0;transform:rotate(-90deg);" width="52" height="52" viewBox="0 0 52 52">
                                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(48,209,88,0.7)" stroke-width="3" stroke-dasharray="138 138" stroke-dashoffset="${138 - (138 * 0.96)}" stroke-linecap="round"/>
                            </svg>
                            <span style="font-size:0.72rem;font-weight:800;color:rgba(48,209,88,0.95);">96%</span>
                        </div>
                        <div>
                            <div style="font-size:0.82rem;font-weight:700;color:rgba(48,209,88,0.95);">Excellent Match</div>
                            <div style="font-size:0.72rem;color:var(--text-secondary);">$120,000 – $160,000/yr</div>
                        </div>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
                        ${['SQL','Python','dbt','Looker','Startup'].map(s=>`<span style="padding:3px 9px;background:rgba(41,151,255,0.08);border:1px solid rgba(41,151,255,0.2);border-radius:4px;font-size:0.7rem;color:var(--accent-blue);">${s}</span>`).join('')}
                    </div>
                    <button style="width:100%;padding:11px;background:var(--accent-blue);color:white;border:none;border-radius:8px;font-weight:700;font-size:0.9rem;cursor:default;">Easy Apply</button>
                </div>
            </div>`,
        target: 'B'
    },

    // ── TRIAL 5 ── Shopping / Amazon-style ───────────────────
    {
        domain: 'Product Discovery (E-Commerce)',
        renderA: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <div style="margin-bottom:12px;">
                    <h3 style="font-size:0.82rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">Picked For You</h3>
                    <p style="font-size:0.72rem;color:var(--text-secondary);margin:0;">Based on your browsing history</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1;">
                    ${[
                        {name:'Sony WH-1000XM6',price:'$349',orig:'$399',stars:'4.8',reviews:'12k',grad:'#0d1520,#1a2d40'},
                        {name:'Anker MagGo Charger',price:'$45',orig:'$59',stars:'4.6',reviews:'8.4k',grad:'#1a1a0a,#3a3a1a'},
                        {name:'Kindle Paperwhite',price:'$139',orig:'$159',stars:'4.7',reviews:'22k',grad:'#0f1a0f,#1f3f1f'},
                        {name:'Peak Design Clip',price:'$79',orig:'$89',stars:'4.9',reviews:'3.1k',grad:'#1f0a0a,#4a1a1a'}
                    ].map(p => `
                        <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:9px;overflow:hidden;display:flex;flex-direction:column;">
                            <div style="height:80px;background:linear-gradient(135deg,${p.grad});"></div>
                            <div style="padding:8px;">
                                <div style="font-size:0.78rem;font-weight:600;line-height:1.25;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.name}</div>
                                <div style="display:flex;align-items:baseline;gap:5px;margin-bottom:3px;">
                                    <span style="font-size:0.88rem;font-weight:800;">${p.price}</span>
                                    <span style="font-size:0.7rem;color:var(--text-secondary);text-decoration:line-through;">${p.orig}</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:3px;">
                                    <span style="color:#f90;font-size:0.7rem;">★</span>
                                    <span style="font-size:0.7rem;font-weight:600;">${p.stars}</span>
                                    <span style="font-size:0.68rem;color:var(--text-secondary);">(${p.reviews})</span>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:14px;height:100%;display:flex;flex-direction:column;">
                <div style="margin-bottom:12px;">
                    <h3 style="font-size:0.82rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">Picked For You</h3>
                    <p style="font-size:0.72rem;color:var(--text-secondary);margin:0;">Based on your browsing history</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;flex:1;">
                    ${[
                        {name:'Sony WH-1000XM6',desc:'Industry-leading ANC, 30hr battery, multipoint',price:'$349',orig:'$399',stars:'4.8',reviews:'12k',badge:'Best Seller',grad:'#0d1520,#1a2d40'},
                        {name:'Anker MagGo 3-in-1 Charger',desc:'15W MagSafe, Apple Watch, AirPods simultaneous',price:'$45',orig:'$59',stars:'4.6',reviews:'8.4k',badge:'Deal',grad:'#1a1a0a,#3a3a1a'},
                        {name:'Kindle Paperwhite 12th Gen',desc:'6.8" glare-free, waterproof, 3-month battery',price:'$139',orig:'$159',stars:'4.7',reviews:'22k',badge:'',grad:'#0f1a0f,#1f3f1f'}
                    ].map(p => `
                        <div style="display:flex;gap:10px;padding:9px;background:var(--bg-surface);border:1px solid var(--border);border-radius:9px;">
                            <div style="width:64px;height:64px;border-radius:7px;background:linear-gradient(135deg,${p.grad});flex-shrink:0;position:relative;">
                                ${p.badge?`<span style="position:absolute;top:-4px;left:-4px;background:#c45500;color:white;font-size:0.55rem;font-weight:800;padding:1px 4px;border-radius:2px;">${p.badge}</span>`:''}
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:0.82rem;font-weight:600;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</div>
                                <div style="font-size:0.7rem;color:var(--text-secondary);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.desc}</div>
                                <div style="display:flex;align-items:center;justify-content:space-between;">
                                    <div>
                                        <span style="font-size:0.88rem;font-weight:800;">${p.price}</span>
                                        <span style="font-size:0.68rem;color:var(--text-secondary);text-decoration:line-through;margin-left:4px;">${p.orig}</span>
                                    </div>
                                    <div style="display:flex;align-items:center;gap:2px;">
                                        <span style="color:#f90;font-size:0.7rem;">★</span>
                                        <span style="font-size:0.7rem;font-weight:600;">${p.stars}</span>
                                        <span style="font-size:0.68rem;color:var(--text-secondary);">(${p.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        target: 'A'
    },

    // ── TRIAL 6 ── News / Apple News-style ───────────────────
    {
        domain: 'News Feed (Content Aggregator)',
        renderA: () => `
            <div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="font-size:0.82rem;font-weight:700;margin:0;">Today's Top Stories</h3>
                    <span style="font-size:0.7rem;color:var(--text-secondary);">Curated for you</span>
                </div>
                <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
                    <div style="margin:10px 14px;border-radius:10px;overflow:hidden;background:linear-gradient(160deg,#0a1a2e,#0f2d4a);position:relative;flex-shrink:0;">
                        <div style="padding:14px 12px 12px;">
                            <span style="display:inline-block;padding:2px 7px;background:rgba(41,151,255,0.2);color:var(--accent-blue);font-size:0.62rem;font-weight:700;border-radius:3px;margin-bottom:8px;text-transform:uppercase;">Technology</span>
                            <h4 style="font-size:1rem;font-weight:800;line-height:1.3;margin:0 0 6px 0;color:white;">OpenAI Releases o4 With Real-Time Reasoning Transparency</h4>
                            <p style="font-size:0.76rem;color:rgba(255,255,255,0.55);margin:0 0 8px 0;line-height:1.4;">The new model shows its chain of thought live, letting users audit every step of complex reasoning in production.</p>
                            <div style="display:flex;justify-content:space-between;">
                                <span style="font-size:0.68rem;color:rgba(255,255,255,0.4);font-weight:600;">The Verge</span>
                                <span style="font-size:0.68rem;color:rgba(255,255,255,0.4);">2 hr ago · 4 min read</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;padding:0 14px;gap:1px;overflow:hidden;">
                        ${[
                            {cat:'Business',title:'Nvidia\'s Market Cap Crosses $4T Milestone',src:'Reuters',time:'5 hr ago'},
                            {cat:'Science',title:'Webb Telescope Captures First Direct Image of Exoplanet Atmosphere',src:'NASA / Nature',time:'8 hr ago'}
                        ].map(a => `
                            <div style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                                <span style="font-size:0.62rem;font-weight:700;color:var(--accent-blue);text-transform:uppercase;letter-spacing:0.06em;">${a.cat}</span>
                                <p style="font-size:0.82rem;font-weight:600;line-height:1.3;margin:3px 0 4px 0;">${a.title}</p>
                                <div style="display:flex;gap:8px;">
                                    <span style="font-size:0.68rem;color:var(--text-secondary);font-weight:600;">${a.src}</span>
                                    <span style="font-size:0.68rem;color:var(--text-secondary);">${a.time}</span>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`,
        renderB: () => `
            <div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="font-size:0.82rem;font-weight:700;margin:0;">Today's Top Stories</h3>
                    <span style="font-size:0.7rem;color:var(--text-secondary);">Curated for you</span>
                </div>
                <div style="display:flex;flex-direction:column;padding:10px 14px;gap:10px;flex:1;overflow:hidden;">
                    ${[
                        {cat:'Technology',title:'OpenAI Releases o4 With Real-Time Reasoning Transparency',src:'The Verge',time:'2 hr ago',read:'4 min',grad:'#0a1a2e,#0f2d4a',hot:true},
                        {cat:'Business',title:'Nvidia\'s Market Cap Crosses $4T Milestone',src:'Reuters',time:'5 hr ago',read:'2 min',grad:'#1a0f00,#3a2000',hot:false},
                        {cat:'Science',title:'Webb Captures First Direct Exoplanet Atmosphere Image',src:'NASA / Nature',time:'8 hr ago',read:'6 min',grad:'#0a0a1a,#1a1a3a',hot:false},
                        {cat:'Health',title:'Stanford Study Links 8-Min Daily Walks to 22% Lower Cardiac Risk',src:'JAMA',time:'10 hr ago',read:'3 min',grad:'#0a1a0a,#1a3a1a',hot:false}
                    ].map(a => `
                        <div style="display:flex;gap:10px;align-items:flex-start;">
                            <div style="width:56px;height:56px;border-radius:7px;background:linear-gradient(135deg,${a.grad});flex-shrink:0;"></div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
                                    <span style="font-size:0.62rem;font-weight:700;color:var(--accent-blue);text-transform:uppercase;">${a.cat}</span>
                                    ${a.hot?'<span style="font-size:0.6rem;background:rgba(255,69,58,0.1);color:#ff453a;padding:1px 4px;border-radius:3px;font-weight:700;">Trending</span>':''}
                                </div>
                                <p style="font-size:0.8rem;font-weight:600;line-height:1.3;margin:0 0 4px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${a.title}</p>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <span style="font-size:0.68rem;color:var(--text-secondary);font-weight:600;">${a.src}</span>
                                    <span style="font-size:0.65rem;color:rgba(255,255,255,0.2);">·</span>
                                    <span style="font-size:0.68rem;color:var(--text-secondary);">${a.time}</span>
                                    <span style="font-size:0.65rem;color:rgba(255,255,255,0.2);">·</span>
                                    <span style="font-size:0.68rem;color:var(--text-secondary);">${a.read} read</span>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`,
        target: 'B'
    }

];
// ============================================================
// END OF TRIALS ARRAY
// Also update CFG.NUM_TRIALS to 6 (already correct)
// target distribution: A=3 (trials 1,3,5) · B=3 (trials 2,4,6)
// ============================================================

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
