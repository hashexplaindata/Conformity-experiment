# Survey Configuration Notes

## Survey Approach: Self-Hosted Static Experiment

This experiment uses a self-hosted static HTML page rather than an external survey platform (SurveyMonkey / Mentimeter). This approach offers:

- **No API keys required** — zero external dependencies
- **Full control** over randomization and data capture
- **Works offline** after initial page load
- **No cost** — no platform subscriptions needed

## Two Conditions

### Flow_Control

- URL: `experiment.html?cond=control`
- Shows 8 UI pairs with neutral labels ("Option A" / "Option B")
- No AI recommendations displayed

### Flow_AI

- URL: `experiment.html?cond=ai`  
- Shows the same 8 UI pairs
- One option per pair displays "★ AI Recommended" badge
- Badge assignment alternates: pair01=A, pair02=B, pair03=A, pair04=B, pair05=A, pair06=B, pair07=A, pair08=B

## Random Assignment

- `redirector.html` randomly assigns participants 50/50 to either condition
- Assignment is via client-side JavaScript `Math.random()`
- No cookies or server-side logic required

## Data Capture

- All responses captured client-side in browser memory
- At completion, participant can download their data as CSV
- CSV follows the canonical schema defined in `analytics/schema.md`

## Alternative: External Survey Platform

If you prefer to use an external platform:

1. Export the 8 UI pair images from the experiment
2. Create two survey flows (Control and AI) in your platform of choice
3. Use platform-native Image Choice question type
4. Set up randomization using platform tools or the redirector page

---
_Configuration date: 2026-02-27_
