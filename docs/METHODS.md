# Methods — UI Conformity Experiment

## Title

The Influence of "AI Recommended" Labels on User Interface Design Preferences: A Randomized Online Experiment

## Hypothesis

**H1:** Participants exposed to an "AI Recommended" label will select the labeled UI option at a higher rate than control participants viewing identical options without labels.

**H0:** There is no difference in selection rates between the AI-labeled and control conditions.

## Participants

Participants were recruited from [classroom / online panel]. Inclusion criteria: age 18+, access to a web browser. No demographic restrictions were applied. Participation was voluntary and anonymous. Informed consent was obtained digitally prior to the study.

## Design

A between-subjects experimental design with two conditions:

- **Control condition:** Participants viewed 6 pairs of UI mockups with neutral labels ("Option A" / "Option B") and selected their preferred design.
- **AI Label condition:** Participants viewed the same 6 pairs, but one option in each pair displayed a "★ AI Recommended" badge.

Assignment was experimenter-controlled. Participants were recruited via WhatsApp and directed to specific conditions using URL parameters (?condition=control vs. ?condition=ai), guaranteeing an exact cohort split.

## Stimuli

Participants evaluated 6 distinct, context-neutral UI domains designed to elicit aesthetic ambiguity: 1. Server CPU Load (Data Analytics), 2. Product Card (E-Commerce), 3. Notification Toggles (Settings), 4. Subscription Tiers (SaaS Pricing), 5. App Menu (Navigation), 6. 2FA Verification (Security).

Each pair shared identical layout and functionality, differing only in a single design attribute. Pairs were rendered as CSS/HTML mockups within the experiment page. In the AI condition, one option per pair received a visually prominent "★ AI Recommended" badge. The assignment of which option received the badge was counterbalanced across pairs.

## Procedure

1. Participants accessed the experiment via a condition-specific URL shared by the experimenter.
2. A welcome screen explained the task and obtained informed consent.
3. Participants completed 6 trials presented in randomized order.
4. On each trial, two UI mockups appeared side-by-side (left/right placement randomized).
5. Participants clicked to select their preferred design.
6. Upon completion of the in-app debriefing screen, data was silently transmitted to Firebase.

## Measures

- **Primary DV:** Choice (A or B) — coded as whether the AI-preferred option was selected
- **Secondary DVs:**
  - Reaction time (ms) — time from trial display to choice click
  - Semantic justification (post-task open-ended response)
- **Between-subjects IV:** Condition (control vs. AI label)
- **Metadata:** Participant UUID, trial order, pair ID, timestamp

## Metadata

- Participant UUID
- Condition (control vs. AI label)
- AI familiarity covariate
- Trial sequence
- UI domain
- AI badge position
- User selection
- Choice (target layout)
- Reaction time (ms)
- Semantic justification
- Timestamp

## Ethics

- Participation was voluntary and anonymous.
- No personally identifiable information was collected.
- Informed consent was obtained prior to participation.
- A debrief statement was provided upon completion explaining the true purpose of the study and the manipulation.
- Participants could withdraw at any time by closing their browser.
- The study involved minimal risk (viewing interface mockups and clicking preferences).
- Data is silently transmitted to Firebase Firestore upon completion of the in-app debriefing screen.

---

