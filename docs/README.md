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
2. Open `code/redirector.html` in a browser (or serve via a local server)
3. Participants are auto-assigned to control or AI condition
4. After collecting responses, load CSVs into `analytics/dashboard.html`
5. Run `python code/run_analysis.py` for statistical analysis

## Stitch Design Project

UI mockup pairs were generated using Google Stitch:

- **Project ID:** `4451603137931340420`
- **Screens:** 14+ high-fidelity UI mockups across 8 design scenarios

## Key Files

| File | Purpose |
|------|---------|
| `code/experiment.html` | Main experiment page (loads via URL params) |
| `code/redirector.html` | 50/50 random condition assignment |
| `code/generate_sample_data.py` | Generate synthetic test data |
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
