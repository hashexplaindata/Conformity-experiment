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
- **AI Label condition:** Participants viewed the same 6 pairs, but one option in each pair displayed a "✨ AI Recommended" badge.

Assignment to conditions was randomized (50/50) using client-side JavaScript random number generation at the point of entry.

## Stimuli

Six pairs of high-fidelity UI mockups were created covering common interface patterns in the context of Iqra University and Pakistan Higher Education Commission (HEC):

1. **Information Density (Course Schedule)** - List view vs. Bento grid layout
2. **Data Visualization (HEC Attendance Warning)** - Circular gauge with 78% attendance vs. Linear progress bar
3. **Financial Overview (Fee Voucher)** - Card-based layout vs. Centered layout for semester fees
4. **Campus Event (Visual Dominance)** - Visual-dominant poster vs. Compact text-heavy layout
5. **Interaction (QEC Faculty Evaluation)** - Radio button scale vs. Interactive slider for rating
6. **Navigation Hierarchy (Digital Library)** - Floating search button vs. Header-integrated search

Each pair shared identical content and functionality, differing only in a single design attribute (layout pattern, visualization type, or interaction method). Pairs were rendered as inline CSS/HTML mockups within the experiment page. In the AI condition, one option per pair received a visually prominent "✨ AI Recommended" badge. The assignment of which option (A or B) received the badge was predetermined based on hypothesized modern design preferences (e.g., Bento grid over list, circular gauge over bar chart).

## Procedure

1. Participants accessed the experiment via a URL with condition parameter (`?condition=control` or `?condition=ai`).
2. A welcome screen explained the task and obtained informed consent.
3. Participants rated their AI familiarity on a 5-point Likert scale (covariate: 1=Never used → 5=Daily user).
4. Participants completed 6 trials presented in randomized order.
5. On each trial, two UI mockups appeared side-by-side (left/right placement randomized).
6. Participants clicked to select their preferred design.
7. Reaction time was automatically captured using `performance.now()` for millisecond accuracy.
8. After all trials, participants provided an optional free-text justification explaining their selection strategy.
9. Upon completion, participants saw a confirmation screen with their anonymous Participant ID and data sync status.

## Measures

- **Primary DV:** Choice (A or B) — coded as whether the AI-labeled option was selected (`chose_target_layout` boolean)
- **Secondary DVs:**
  - Reaction time (ms) — Time from trial display to choice click, measured via `performance.now()`
  - Semantic justification — Free-text explanation of decision-making strategy (optional)
- **Between-subjects IV:** Condition (`control` vs. `ai_labeled`)
- **Covariate:** AI familiarity (1–5 Likert scale: Never used, Rarely, Occasionally, Frequently, Daily)
- **Metadata:**
  - Participant UUID (anonymous identifier)
  - Trial sequence (1-6, randomized order)
  - UI domain (trial category name)
  - AI badge position (which option had the badge: "A", "B", or "none" for control)
  - User selection ("A" or "B")
  - Timestamp (Unix milliseconds)

## Ethics

- Participation was voluntary and anonymous.
- No personally identifiable information was collected.
- Informed consent was obtained prior to participation.
- A debrief statement was provided upon completion explaining the true purpose of the study and the manipulation.
- Participants could withdraw at any time by closing their browser.
- The study involved minimal risk (viewing interface mockups and clicking preferences).
- Data was synced to Firebase Firestore (`conformity_telemetry` collection) with fallback to localStorage for offline participants.
- Participants were informed they could request data withdrawal within 7 days using their Participant ID.

---
_Last updated: 2026-03-12 | Copy-paste this text into your Methods section. Update bracketed placeholders as needed._
