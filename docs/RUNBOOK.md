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
  - Confirm: No "✨ AI Recommended" badges visible.
- **AI Link**: `http://localhost:8000/code/index.html?condition=ai`
  - Confirm: "✨ AI Recommended" badges visible on designated options.

### Step 3: Prepare Distribution Link

- **Cohort A (Control)**: Share the Control Link or its QR code.
- **Cohort B (AI)**: Share the AI Link or its QR code.

---

## During Session

### Step 4: Welcome Participants

- Instruct participants to open the link in their browser
- Participants will be assigned to either control or AI condition based on the URL parameter
- Estimated completion time: 3-5 minutes per participant
- 6 trial pairs will be shown in randomized order

### Step 5: Monitor Progress

- Data is automatically synced to Firebase Firestore (`conformity_telemetry` collection)
- Participants see a completion confirmation with their anonymous Participant ID
- Data includes reaction times, selections, AI familiarity rating, and optional justification

---

## Post-Session

### Step 6: Verify Data Sync

- Access your Firebase Console at [console.firebase.google.com](https://console.firebase.google.com)
- Navigate to Firestore Database
- Check the `conformity_telemetry` collection for new participant data
- Each participant record includes: condition, trial results, reaction times, AI familiarity, and timestamps

---

## Deployment (Optional)

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy: `firebase deploy --only hosting`
4. Access at your Firebase hosting URL (e.g., `conformity-experiment.web.app`)

### GitHub Pages

1. Push the repository to GitHub
2. Enable GitHub Pages in Settings > Pages
3. Set source to the `main` branch
4. Access at `https://[username].github.io/Conformity-experiment/code/index.html?condition=control` or `?condition=ai`

### Netlify

1. Drag the `code/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Share the generated URL

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Badges not appearing | Check URL parameter: `?condition=ai` (not `?condition=control`) |
| Firebase sync fails | Check internet connection and Firebase configuration in `experiment.js` |
| Blank screen | Ensure local server is running and path is correct |
| Browser compatibility | Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) |

---
_Last updated: 2026-03-12_
