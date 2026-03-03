# Data Schema — UI Conformity Experiment

## CSV Columns

| Column | Type | Description |
|--------|------|-------------|
| `participant_id` | UUID string | Unique anonymous identifier (generated client-side) |
| `condition` | string | `Control` or `AI_Labeled` — experimental condition |
| `trial_num` | integer (1–8) | Sequential trial number for this participant |
| `trial_id` | string | UI trial identifier (T1_Schedule–T8_Placeholder) |
| `user_choice` | string | `A` or `B` — which option the participant selected |
| `target_pos` | string | `A` or `B` — position of the AI-labeled option |
| `chose_target` | integer (0/1) | Whether the participant chose the target option |
| `confidence_1_5` | integer (1–5) | Self-reported confidence (1 = not at all, 5 = very confident) |
| `rt_ms` | float | Reaction time in milliseconds from trial display to choice click |
| `timestamp` | ISO 8601 | UTC timestamp of the response |

## Example Row
```
550e8400-e29b-41d4-a716-446655440000,AI_Labeled,3,T3_Library,A,A,1,4,1523.45,2026-02-26T12:34:56Z
```

## Notes
- Each participant produces exactly 8 rows (one per trial)
- Trial order is randomized per participant
- A/B side placement (left/right) is randomized per trial
- In the `AI_Labeled` condition, one option per pair has a "✨ AI Suggested" badge
- `target_pos` mapping: T1=A, T2=B, T3=A, T4=B, T5=A, T6=B, T7=A, T8=B

_Schema version: 1.0 — 2026-02-27_
