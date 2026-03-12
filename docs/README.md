# UI Conformity Experiment

## Purpose

This experiment tests whether an "AI Recommended" label influences users' UI design preferences. Participants view 6 pairs of interface mockups and select their preferred option. Half see neutral labels (control); half see one option per pair marked with a "✨ AI Recommended" badge (treatment).

## Folder Structure

```
/code           — Experiment HTML, redirector, CSS
/docs           — README, RUNBOOK, METHODS, CONSENT, DEBRIEF, IRB checklist
```

## Quickstart

1. Open `docs/RUNBOOK.md` and follow Step 1
2. Open `http://localhost:8000/code/index.html?condition=control` (Control)
3. Open `http://localhost:8000/code/index.html?condition=ai` (Treatment)
4. Data is synced to Firebase and available via CSV download.

## Key Files

| File | Purpose |
|------|---------|
| `code/index.html` | Unified experiment page (loads via URL params) |
| `code/experiment.js` | Logic for randomization, trials, and Firebase sync |

## Requirements

- Modern web browser (Chrome, Firefox, Edge)
- Optional: local HTTP server (`python -m http.server 8000`)

## Contact

[Your Name / Email]

## Trial Domains

The experiment includes 6 UI comparison trials covering:

1. **Information Density (Course Schedule)** - List view vs. Grid view
2. **Data Visualization (HEC Attendance Warning)** - Circular gauge vs. Progress bar
3. **Financial Overview (Fee Voucher)** - Card layout vs. Centered layout
4. **Campus Event (Visual Dominance)** - Visual-first vs. Compact layout
5. **Interaction (QEC Faculty Evaluation)** - Radio buttons vs. Slider
6. **Navigation Hierarchy (Digital Library)** - Floating search vs. Header-integrated search

All trials use Iqra University and Pakistan Higher Education Commission (HEC) context for realism.

---
_Last updated: 2026-03-12 | Version: 2.0_
