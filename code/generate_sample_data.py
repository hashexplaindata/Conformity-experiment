"""
generate_sample_data.py — UI Conformity Experiment
Generates synthetic participant data for testing the analytics pipeline.
Usage: python generate_sample_data.py [--n 50] [--output analytics/sample_data.csv]
"""

import csv
import uuid
import random
import argparse
from datetime import datetime, timedelta

# AI-preferred options per pair
AI_PREFERRED = {
    'pair01': 'A', 'pair02': 'B', 'pair03': 'A', 'pair04': 'B',
    'pair05': 'A', 'pair06': 'B', 'pair07': 'A', 'pair08': 'B',
}

PAIR_IDS = [f'pair{i:02d}' for i in range(1, 9)]

def generate_participant(condition, base_time):
    """Generate 8 trial rows for one participant."""
    pid = str(uuid.uuid4())
    trials = list(range(1, 9))
    random.shuffle(trials)
    rows = []

    for trial_num, pair_idx in enumerate(trials, 1):
        pair_id = PAIR_IDS[pair_idx - 1]
        target_pos = AI_PREFERRED[pair_id]

        # Effect: AI condition → higher probability of picking AI-preferred option
        if condition == 'AI_Labeled':
            p_ai = random.gauss(0.72, 0.05)
        else:
            p_ai = random.gauss(0.48, 0.05)

        p_ai = max(0.1, min(0.95, p_ai))
        user_choice = target_pos if random.random() < p_ai else ('B' if target_pos == 'A' else 'A')

        # Confidence: slightly higher in AI condition
        if condition == 'AI_Labeled':
            confidence = max(1, min(5, round(random.gauss(3.8, 0.9))))
        else:
            confidence = max(1, min(5, round(random.gauss(3.2, 0.9))))

        # Reaction time: lognormal distribution, mean ~2000ms
        rt_ms = max(400, int(random.lognormvariate(7.5, 0.4)))

        timestamp = base_time + timedelta(seconds=random.randint(0, 300))

        rows.append({
            'participant_id': pid,
            'condition': condition,
            'trial_num': trial_num,
            'pair_id': pair_id,
            'user_choice': user_choice,
            'target_pos': target_pos,
            'chose_target': 1 if user_choice == target_pos else 0,
            'confidence_1_5': confidence,
            'rt_ms': rt_ms,
            'timestamp': timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
        })

    return rows


def main():
    parser = argparse.ArgumentParser(description='Generate synthetic experiment data')
    parser.add_argument('--n', type=int, default=50, help='Number of participants (default: 50)')
    parser.add_argument('--output', type=str, default='analytics/sample_data.csv', help='Output CSV path')
    args = parser.parse_args()

    random.seed(42)
    base_time = datetime(2026, 2, 27, 10, 0, 0)
    all_rows = []

    for i in range(args.n):
        condition = 'Control' if i < args.n // 2 else 'AI_Labeled'
        participant_base = base_time + timedelta(minutes=i * 5)
        all_rows.extend(generate_participant(condition, participant_base))

    headers = ['participant_id', 'condition', 'trial_num', 'pair_id', 'user_choice',
               'target_pos', 'chose_target', 'confidence_1_5', 'rt_ms', 'timestamp']

    with open(args.output, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f'[OK] Generated {len(all_rows)} rows ({args.n} participants) -> {args.output}')


if __name__ == '__main__':
    main()
