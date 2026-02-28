# RUNBOOK — UI Conformity Experiment

Step-by-step operator instructions for running a live experiment session.

---

## Pre-Session Setup (10 min before)

### Step 1: Start Local Server

```bash
cd "Conformity experiment"
python -m http.server 8000
```

The experiment is now accessible at `http://localhost:8000/code/redirector.html`

### Step 2: Verify Both Conditions

- Open `http://localhost:8000/code/experiment.html?cond=control`
  - Confirm: No "AI Recommended" badges visible
- Open `http://localhost:8000/code/experiment.html?cond=ai`
  - Confirm: "★ AI Recommended" badges visible on designated options

### Step 3: Prepare Distribution Link

- **For in-person sessions:** Share `http://[YOUR_IP]:8000/code/redirector.html`
- **For remote sessions:** Deploy to GitHub Pages or Netlify (see Deployment below)

---

## During Session

### Step 4: Welcome Participants

- Instruct participants to open the link in their browser
- They will be randomly assigned to control or AI condition
- Estimated completion time: 3-5 minutes per participant

### Step 5: Monitor Progress

- Each participant downloads their own CSV upon completion
- Collect CSV files from participants

---

## Post-Session

### Step 6: Aggregate Data

Combine all individual CSV files:

```bash
# Windows PowerShell
Get-Content analytics\*.csv | Select-Object -Skip 1 | Set-Content analytics\combined.csv
# Prepend header
$header = (Get-Content analytics\sample_data.csv -TotalCount 1)
$content = Get-Content analytics\combined.csv
Set-Content analytics\combined.csv -Value ($header, $content)
```

### Step 7: View Dashboard

- Open `analytics/dashboard.html` in a browser
- Drag & drop your combined CSV file
- Charts render automatically

### Step 8: Run Statistical Analysis

```bash
python code/run_analysis.py --input analytics/combined.csv --output analytics/
```

Results saved to `analytics/results.json` and chart SVGs.

---

## Deployment (Optional)

### GitHub Pages

1. Push the `code/` folder to a GitHub repository
2. Enable GitHub Pages in Settings > Pages
3. Share the Pages URL with participants

### Netlify

1. Drag the `code/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Share the generated URL

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Ensure all files are in the same `code/` directory |
| CSV download fails | Check browser popup blocker settings |
| Charts not rendering | Ensure internet connection (Chart.js loads from CDN) |

---
_Last updated: 2026-02-27_
