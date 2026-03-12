# UI Conformity Experiment

> **Beta UI Diagnostic Dashboard**: A behavioral research tool investigating AI authority bias in user interface design preferences

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This repository contains a web-based behavioral experiment designed to investigate whether "AI Recommended" labels influence users' UI design preferences. The study employs a randomized between-subjects design to measure conformity effects in human-computer interaction.

### Research Question

**Does an "AI Recommended" label influence users' UI design preferences?**

## Quick Start

```bash
# Clone the repository
git clone https://github.com/hashexplaindata/Conformity-experiment.git
cd Conformity-experiment

# Start a local server
python -m http.server 8000

# Access the experiment
# Control condition: http://localhost:8000/code/index.html?condition=control
# AI label condition: http://localhost:8000/code/index.html?condition=ai
```

## Project Structure

```
Conformity-experiment/
├── code/                          # Application files
│   ├── index.html                 # Main experiment page (147 lines)
│   ├── experiment.js              # Core behavioral engine (489 lines)
│   └── style.css                  # Styling & animations (281 lines)
├── docs/                          # Documentation & ethics
│   ├── README.md                  # Quick reference guide
│   ├── METHODS.md                 # Formal research methodology
│   ├── RUNBOOK.md                 # Step-by-step operational guide
│   ├── IRB_CHECKLIST.md           # Ethics compliance checklist
│   ├── CONSENT.txt                # Participant consent form
│   └── DEBRIEF.txt                # Post-study disclosure
├── .github/workflows/             # CI/CD pipelines
│   └── codeql.yml                 # Security scanning
├── firebase.json                  # Firebase hosting configuration
└── .firebaserc                    # Firebase project reference
```

## Experimental Design

### Conditions

- **Control Group**: Views 6 pairs of UI mockups with neutral labels ("Option A" / "Option B")
- **Treatment Group**: Views identical pairs with "✨ AI Recommended" badges on designated options

### Trial Domains (Iqra University Context)

1. **Information Density** - Course Schedule (List vs. Grid)
2. **Data Visualization** - HEC Attendance Warning (Circular gauge vs. Progress bar)
3. **Financial Overview** - Fee Voucher (Card vs. Centered layout)
4. **Campus Event** - Event Display (Visual-dominant vs. Compact)
5. **Interaction** - QEC Faculty Evaluation (Radio buttons vs. Slider)
6. **Navigation** - Digital Library (Floating search vs. Header-integrated)

### Data Collection

Each participant record captures:
- **Primary DV**: Whether the AI-labeled option was selected
- **Reaction time**: Millisecond-accurate (`performance.now()`)
- **AI familiarity**: 5-point Likert scale covariate
- **Semantic justification**: Free-text explanation (optional)
- **Metadata**: UUID, condition, trial sequence, timestamps

## Features

### Technical Highlights

- 🎯 **Client-side randomization** - 50/50 condition assignment
- ⚡ **Millisecond-accurate telemetry** - `performance.now()` reaction time tracking
- 🔥 **Firebase integration** - Automatic Firestore sync (`conformity_telemetry` collection)
- 🎨 **Modern UI** - Dark theme with Bento grid design and radial glow effects
- 🔒 **Privacy-first** - Anonymous UUIDs, no PII collection
- 📱 **Responsive** - Mobile and desktop compatible
- 🚫 **Anti-manipulation** - Browser back-navigation prevention

### Research Features

- Counterbalanced AI badge assignment
- Randomized trial order
- Left/Right position randomization (prevents motor habituation)
- Covariate collection (AI familiarity)
- Qualitative data capture (semantic justification)

## Deployment Options

### 1. Local Development
```bash
python -m http.server 8000
```

### 2. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

### 3. GitHub Pages
1. Enable in repository Settings > Pages
2. Access at: `https://[username].github.io/Conformity-experiment/code/index.html?condition=control`

### 4. Netlify
1. Drag `code/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Share generated URL with condition parameters

## Documentation

| Document | Purpose |
|----------|---------|
| [`docs/README.md`](docs/README.md) | Quick reference and file overview |
| [`docs/METHODS.md`](docs/METHODS.md) | Formal research methodology (copy-paste ready) |
| [`docs/RUNBOOK.md`](docs/RUNBOOK.md) | Step-by-step operational guide for running sessions |
| [`docs/IRB_CHECKLIST.md`](docs/IRB_CHECKLIST.md) | 15-point ethical review checklist |
| [`docs/CONSENT.txt`](docs/CONSENT.txt) | Participant informed consent template |
| [`docs/DEBRIEF.txt`](docs/DEBRIEF.txt) | Post-study disclosure statement |

## Ethical Considerations

✅ **IRB-Ready**: Includes informed consent, debrief, and ethics checklist
✅ **Minimal Risk**: Viewing UI mockups only
✅ **Voluntary**: Participants can withdraw at any time
✅ **Anonymous**: UUID-based identification, no PII
✅ **Transparent**: Full disclosure of manipulation in debrief
✅ **Withdrawal Rights**: 7-day data withdrawal window with Participant ID

## Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Server** (optional): Python 3.x, Node.js, or any HTTP server
- **Firebase** (optional): For data persistence and hosting

## Data Format

Data is stored in **tidy data long format** with the following schema:

```javascript
{
  participant_id: "abc123xyz...",           // Anonymous UUID
  experimental_condition: "ai_labeled",      // "control" or "ai_labeled"
  ai_familiarity_covariate: 3,              // 1-5 Likert scale
  trial_sequence: 1,                         // 1-6
  ui_domain: "Information Density...",       // Trial category
  ai_badge_position: "B",                    // "A", "B", or "none"
  user_selection: "B",                       // "A" or "B"
  chose_target_layout: true,                 // Boolean
  reaction_time_ms: 2341,                    // Milliseconds
  semantic_justification: "I prefer...",     // Free text
  timestamp: 1710278400000                   // Unix ms
}
```

## Usage

### For Researchers

1. Review [`docs/METHODS.md`](docs/METHODS.md) for study design
2. Follow [`docs/RUNBOOK.md`](docs/RUNBOOK.md) for session operations
3. Complete [`docs/IRB_CHECKLIST.md`](docs/IRB_CHECKLIST.md) for ethics approval
4. Configure Firebase credentials (or use localStorage fallback)
5. Deploy and share condition-specific URLs with participants

### For Developers

```javascript
// Configuration
const CFG = {
    NUM_TRIALS: 6,
    CONDITION: 'ai_labeled' | 'control',
    COLLECTION: 'conformity_telemetry'
};

// Trial definition structure
const TRIAL = {
    domain: 'Trial Category Name',
    renderA: () => `<div>...</div>`,  // Option A HTML
    renderB: () => `<div>...</div>`,  // Option B HTML
    target: 'A' | 'B'                  // Hypothesized preference
};
```

## Contributing

This is an academic research project. For questions or collaboration inquiries, please open an issue.

## License

MIT License - See [LICENSE](LICENSE) for details

## Citation

If you use this experiment framework in your research, please cite:

```bibtex
@software{conformity_experiment_2026,
  title = {UI Conformity Experiment: AI Authority Bias in Interface Design},
  author = {[Your Name]},
  year = {2026},
  url = {https://github.com/hashexplaindata/Conformity-experiment}
}
```

## Acknowledgments

- Built with vanilla JavaScript for maximum portability
- Firebase for data persistence
- Iqra University and Pakistan HEC for contextual realism

---

**Version**: 2.0 | **Last Updated**: 2026-03-12 | **Status**: Production Ready

For operational guidance, see [`docs/RUNBOOK.md`](docs/RUNBOOK.md)
For methodology details, see [`docs/METHODS.md`](docs/METHODS.md)
