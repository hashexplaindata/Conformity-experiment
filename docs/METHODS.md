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

- **Control condition:** Participants viewed 8 pairs of UI mockups with neutral labels ("Option A" / "Option B") and selected their preferred design.
- **AI Label condition:** Participants viewed the same 8 pairs, but one option in each pair displayed a "★ AI Recommended" badge.

Assignment to conditions was randomized (50/50) using client-side JavaScript random number generation at the point of entry.

## Stimuli

Eight pairs of high-fidelity UI mockups were created covering common interface patterns:

1. E-commerce product card (button color: blue vs. green)
2. Settings page (toggle alignment: left vs. right)
3. Analytics dashboard widget (chart type: bar vs. line)
4. Signup form (CTA copy: "Sign Up" vs. "Get Started")
5. Pricing table (highlighted tier: Basic vs. Pro)
6. Navigation sidebar (icon style: outlined vs. filled)
7. Notification banner (position: top vs. inline)
8. Search results (layout: list vs. grid)

Each pair shared identical layout and functionality, differing only in a single design attribute. Pairs were rendered as CSS/HTML mockups within the experiment page. In the AI condition, one option per pair received a visually prominent "★ AI Recommended" badge. The assignment of which option received the badge was counterbalanced across pairs.

## Procedure

1. Participants accessed the experiment via a URL that randomly redirected them to one of two conditions.
2. A welcome screen explained the task and obtained informed consent.
3. Participants completed 8 trials presented in randomized order.
4. On each trial, two UI mockups appeared side-by-side (left/right placement randomized).
5. Participants clicked to select their preferred design.
6. After selection, they rated their confidence on a 5-point scale (1 = not at all confident, 5 = very confident).
7. Upon completion, participants saw a summary and could download their responses.

## Measures

- **Primary DV:** Choice (A or B) — coded as whether the AI-preferred option was selected
- **Secondary DVs:**
  - Confidence rating (1–5 Likert scale)
  - Reaction time (ms) — time from trial display to choice click
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
- Data was stored locally on participant devices (CSV download) and not transmitted to external servers.

---
_Copy-paste this text into your Methods section. Update bracketed placeholders as needed._
