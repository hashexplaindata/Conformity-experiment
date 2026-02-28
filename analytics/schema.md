# Data Schema — UI Conformity Experiment

## CSV Columns

| Column | Type | Description |
|--------|------|-------------|
| `participant_id` | UUID string | Unique anonymous identifier (generated client-side) |
| `condition` | string | `control` or `ai` — experimental condition |
| `trial_num` | integer (1–8) | Sequential trial number for this participant |
| `pair_id` | string | UI pair identifier (pair01–pair08) |
| `choice` | string | `A` or `B` — which option the participant selected |
| `chosen_image` | string | Filename of the chosen image (e.g., `pair03_A.png`) |
| `confidence_1_5` | integer (1–5) | Self-reported confidence (1 = not at all, 5 = very confident) |
| `rt_ms` | integer | Reaction time in milliseconds from trial display to choice click |
| `timestamp` | ISO 8601 | UTC timestamp of the response |

## Example Row
```
550e8400-e29b-41d4-a716-446655440000,ai,3,pair03,A,pair03_A.png,4,1523,2026-02-26T12:34:56Z
```

## Notes
- Each participant produces exactly 8 rows (one per trial)
- Trial order is randomized per participant
- A/B side placement (left/right) is randomized per trial
- In the `ai` condition, one option per pair has a "★ AI Recommended" badge
- `aiPreferred` mapping: pair01=A, pair02=B, pair03=A, pair04=B, pair05=A, pair06=B, pair07=A, pair08=B

_Schema version: 1.0 — 2026-02-27_
