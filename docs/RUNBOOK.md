# RUNBOOK — UI Conformity Experiment

Step-by-step operator instructions for running a live experiment session.

---

## Pre-Session Setup (10 min before)

### Step 1: Start Local Server

```bash
cd "Conformity-experiment"
python -m http.server 8000
```

The experiment is now accessible at `http://localhost:8000/code/index.html`

### Step 2: Verify Both Conditions

- **Control Link**: `http://localhost:8000/code/index.html?condition=control`
  - Confirm: No "AI Recommended" badges visible.
- **AI Link**: `http://localhost:8000/code/index.html?condition=ai`
  - Confirm: "✨ AI Recommended" badges visible on designated options.

### Step 3: Prepare Distribution Link

- **Cohort A (Control)**: Share the Control Link or its QR code.
- **Cohort B (AI)**: Share the AI Link or its QR code.

---

## During Session

### Step 4: Welcome Participants

- Participants are directed to their pre-assigned condition via condition-specific URLs distributed in WhatsApp groups.
- Estimated completion time: 3-5 minutes per participant

### Step 5: Monitor Progress

- Monitor Firebase Console to confirm responses are being transmitted in real-time.

---

## Post-Session

### Step 6: Verify Data Sync

- Access your Firebase Console.
- Ensure all participant data is synced to the `conformity_telemetry` collection.

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

---

