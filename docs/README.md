# UI Conformity Experiment

## Purpose

This experiment tests whether an "AI Recommended" label influences users' UI design preferences. Participants view 8 pairs of interface mockups and select their preferred option. Half see neutral labels (control); half see one option per pair marked with a "★ AI Recommended" badge (treatment).

## Folder Structure

```
/ui_assets      — Stitch-generated UI mockup designs (see Stitch project link below)
/code           — Experiment HTML, redirector, CSS, Python scripts
/analytics      — Sample CSV, dashboard, results JSON, charts
/docs           — README, RUNBOOK, METHODS, CONSENT, DEBRIEF, IRB checklist
/portfolio      — Executive summary, portfolio one-pager
/surveys        — Survey configuration notes
```

## Quickstart

1. Open `docs/RUNBOOK.md` and follow Step 1
2. Open `http://localhost:8000/code/index.html?condition=control` (Control)
3. Open `http://localhost:8000/code/index.html?condition=ai` (Treatment)
4. After collecting responses, data is synced to Firebase and available via CSV download.

## Key Files

| File | Purpose |
|------|---------|
| `code/index.html` | Unified experiment page (loads via URL params) |
| `code/experiment.js` | Logic for randomization, trials, and Firebase sync |
| `code/run_analysis.py` | Statistical analysis (z-test, t-test, Cohen's d/h) |
| `analytics/dashboard.html` | Interactive Chart.js results dashboard |
| `analytics/sample_data.csv` | 50-participant synthetic dataset |

## Requirements

- Modern web browser (Chrome, Firefox, Edge)
- Python 3.8+ (for data scripts; no external packages needed)
- Optional: local HTTP server (`python -m http.server 8000`)

## Contact

[Your Name / Email]

---
_Generated: 2026-02-27 | Version: 1.0_
