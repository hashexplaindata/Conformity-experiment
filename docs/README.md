# UI Conformity Experiment

## Purpose

This experiment tests whether an "AI Recommended" label influences users' UI design preferences. Participants view 6 pairs of interface mockups and select their preferred option. Half see neutral labels (control); half see one option per pair marked with a "★ AI Recommended" badge (treatment).

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

hashexplaindata (hashexplaindata@users.noreply.github.com)

---
_Generated: 2026-02-27 | Version: 1.0_
