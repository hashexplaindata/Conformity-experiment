"""
run_analysis.py — UI Conformity Experiment
Runs statistical analysis on experiment data.
Generates: results.json, chart PNGs

Usage: python run_analysis.py [--input analytics/sample_data.csv] [--output analytics/]

Requirements: pip install matplotlib numpy scipy
"""

import csv
import json
import math
import argparse
import os
from collections import defaultdict

def load_csv(path):
    with open(path, 'r') as f:
        return list(csv.DictReader(f))

def two_proportion_ztest(x1, n1, x2, n2):
    """Two-proportion z-test (two-tailed)."""
    p1 = x1 / n1
    p2 = x2 / n2
    p_pool = (x1 + x2) / (n1 + n2)
    se = math.sqrt(p_pool * (1 - p_pool) * (1/n1 + 1/n2))
    if se == 0:
        return 0, 1.0
    z = (p1 - p2) / se
    # Approximate p-value using normal CDF
    p_value = 2 * (1 - normal_cdf(abs(z)))
    return z, p_value

def normal_cdf(x):
    """Approximate standard normal CDF using Abramowitz and Stegun."""
    a1, a2, a3, a4, a5 = 0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429
    p = 0.3275911
    sign = 1 if x >= 0 else -1
    x = abs(x) / math.sqrt(2)
    t = 1.0 / (1.0 + p * x)
    y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * math.exp(-x * x)
    return 0.5 * (1.0 + sign * y)

def cohens_h(p1, p2):
    """Cohen's h for comparing two proportions."""
    return 2 * math.asin(math.sqrt(p1)) - 2 * math.asin(math.sqrt(p2))

def t_test_ind(group1, group2):
    """Independent samples t-test (two-tailed)."""
    n1, n2 = len(group1), len(group2)
    mean1 = sum(group1) / n1
    mean2 = sum(group2) / n2
    var1 = sum((x - mean1)**2 for x in group1) / (n1 - 1)
    var2 = sum((x - mean2)**2 for x in group2) / (n2 - 1)
    se = math.sqrt(var1/n1 + var2/n2)
    if se == 0:
        return 0, 1.0, 0
    t = (mean1 - mean2) / se
    df = n1 + n2 - 2
    # Approximate p-value
    p_value = 2 * (1 - normal_cdf(abs(t)))
    pooled_sd = math.sqrt(((n1-1)*var1 + (n2-1)*var2) / (n1 + n2 - 2))
    cohens_d = (mean1 - mean2) / pooled_sd if pooled_sd > 0 else 0
    return t, p_value, cohens_d

def mean(lst):
    return sum(lst) / len(lst) if lst else 0

def std(lst):
    m = mean(lst)
    return math.sqrt(sum((x - m)**2 for x in lst) / (len(lst) - 1)) if len(lst) > 1 else 0

def ci_proportion(x, n, z=1.96):
    p = x / n
    se = math.sqrt(p * (1 - p) / n)
    return (max(0, p - z * se), min(1, p + z * se))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='analytics/sample_data.csv')
    parser.add_argument('--output', default='analytics/')
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    rows = load_csv(args.input)

    # AI-preferred mapping
    ai_preferred = {
        'pair01': 'A', 'pair02': 'B', 'pair03': 'A', 'pair04': 'B',
        'pair05': 'A', 'pair06': 'B', 'pair07': 'A', 'pair08': 'B',
    }

    # Split by condition
    control_rows = [r for r in rows if r['condition'] == 'control']
    ai_rows = [r for r in rows if r['condition'] == 'ai']

    # Primary DV: proportion choosing AI-preferred option
    def count_ai_chosen(rows_set):
        return sum(1 for r in rows_set if r['choice'] == ai_preferred.get(r['pair_id'], 'A'))

    ctrl_ai_chosen = count_ai_chosen(control_rows)
    ai_ai_chosen = count_ai_chosen(ai_rows)
    n_ctrl = len(control_rows)
    n_ai = len(ai_rows)

    p_ctrl = ctrl_ai_chosen / n_ctrl if n_ctrl > 0 else 0
    p_ai = ai_ai_chosen / n_ai if n_ai > 0 else 0

    # Statistical tests
    z_stat, z_pval = two_proportion_ztest(ctrl_ai_chosen, n_ctrl, ai_ai_chosen, n_ai)
    h = cohens_h(p_ai, p_ctrl)

    ci_ctrl = ci_proportion(ctrl_ai_chosen, n_ctrl)
    ci_ai = ci_proportion(ai_ai_chosen, n_ai)

    # Confidence analysis
    ctrl_conf = [int(r['confidence_1_5']) for r in control_rows]
    ai_conf = [int(r['confidence_1_5']) for r in ai_rows]
    t_conf, p_conf, d_conf = t_test_ind(ai_conf, ctrl_conf)

    # RT analysis
    ctrl_rt = [int(r['rt_ms']) for r in control_rows]
    ai_rt = [int(r['rt_ms']) for r in ai_rows]
    t_rt, p_rt, d_rt = t_test_ind(ai_rt, ctrl_rt)

    # Count unique participants
    ctrl_pids = len(set(r['participant_id'] for r in control_rows))
    ai_pids = len(set(r['participant_id'] for r in ai_rows))

    results = {
        'meta': {
            'analysis_timestamp': '2026-02-27T09:00:00Z',
            'total_participants': ctrl_pids + ai_pids,
            'control_n': ctrl_pids,
            'ai_n': ai_pids,
            'total_trials': len(rows),
        },
        'primary_outcome': {
            'description': 'Proportion choosing AI-preferred option by condition',
            'control_proportion': round(p_ctrl, 4),
            'ai_proportion': round(p_ai, 4),
            'difference': round(p_ai - p_ctrl, 4),
            'control_95ci': [round(ci_ctrl[0], 4), round(ci_ctrl[1], 4)],
            'ai_95ci': [round(ci_ai[0], 4), round(ci_ai[1], 4)],
            'z_statistic': round(z_stat, 4),
            'p_value': round(z_pval, 6),
            'cohens_h': round(h, 4),
            'significant_at_05': z_pval < 0.05,
        },
        'confidence_analysis': {
            'control_mean': round(mean(ctrl_conf), 2),
            'control_sd': round(std(ctrl_conf), 2),
            'ai_mean': round(mean(ai_conf), 2),
            'ai_sd': round(std(ai_conf), 2),
            't_statistic': round(t_conf, 4),
            'p_value': round(p_conf, 6),
            'cohens_d': round(d_conf, 4),
        },
        'rt_analysis': {
            'control_mean_ms': round(mean(ctrl_rt), 1),
            'control_sd_ms': round(std(ctrl_rt), 1),
            'ai_mean_ms': round(mean(ai_rt), 1),
            'ai_sd_ms': round(std(ai_rt), 1),
            't_statistic': round(t_rt, 4),
            'p_value': round(p_rt, 6),
            'cohens_d': round(d_rt, 4),
        },
    }

    # Save results JSON
    json_path = os.path.join(args.output, 'results.json')
    with open(json_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f'[OK] Results saved to {json_path}')

    # Generate charts using simple SVG (no matplotlib dependency)
    generate_svg_charts(results, args.output, p_ctrl, p_ai, ctrl_conf, ai_conf, ctrl_rt, ai_rt)

    # Print summary
    print('')
    print('=' * 50)
    print('  UI CONFORMITY EXPERIMENT - RESULTS')
    print('=' * 50)
    print(f'  Participants: {results["meta"]["total_participants"]} ({ctrl_pids} control, {ai_pids} AI)')
    print(f'  AI-preferred choice rate:')
    print(f'    Control: {p_ctrl:.1%} (95% CI: [{ci_ctrl[0]:.1%}, {ci_ctrl[1]:.1%}])')
    print(f'    AI:      {p_ai:.1%} (95% CI: [{ci_ai[0]:.1%}, {ci_ai[1]:.1%}])')
    print(f'  z = {z_stat:.3f}, p = {z_pval:.4f}')
    print(f'  Cohens h = {h:.3f}')
    sig = 'YES' if z_pval < 0.05 else 'NO'
    print(f'  Significant: {sig}')
    print('=' * 50)


def generate_svg_charts(results, output_dir, p_ctrl, p_ai, ctrl_conf, ai_conf, ctrl_rt, ai_rt):
    """Generate SVG chart files."""

    # 1. Bar chart: AI-preferred choice by condition
    bar_height_ctrl = p_ctrl * 200
    bar_height_ai = p_ai * 200
    svg_bar = f'''<svg xmlns="http://www.w3.org/2000/svg" width="500" height="350" viewBox="0 0 500 350">
  <rect width="500" height="350" fill="#1a1d27" rx="12"/>
  <text x="250" y="30" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="16" font-weight="700">% Choosing AI-Preferred Option by Condition</text>
  <line x1="100" y1="50" x2="100" y2="280" stroke="#374151" stroke-width="1"/>
  <line x1="100" y1="280" x2="400" y2="280" stroke="#374151" stroke-width="1"/>
  <rect x="150" y="{280 - bar_height_ctrl}" width="80" height="{bar_height_ctrl}" fill="#6366f1" rx="6"/>
  <rect x="270" y="{280 - bar_height_ai}" width="80" height="{bar_height_ai}" fill="#a78bfa" rx="6"/>
  <text x="190" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">Control</text>
  <text x="310" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">AI Label</text>
  <text x="190" y="{275 - bar_height_ctrl}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="14" font-weight="600">{p_ctrl:.0%}</text>
  <text x="310" y="{275 - bar_height_ai}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="14" font-weight="600">{p_ai:.0%}</text>
  <text x="250" y="330" text-anchor="middle" fill="#6b7280" font-family="Inter,sans-serif" font-size="11">p = {results["primary_outcome"]["p_value"]:.4f} | Cohen's h = {results["primary_outcome"]["cohens_h"]:.3f}</text>
</svg>'''

    with open(os.path.join(output_dir, 'chart_choice_by_condition.svg'), 'w') as f:
        f.write(svg_bar)

    # 2. Confidence comparison
    mc = results['confidence_analysis']
    bar_ctrl_conf = mc['control_mean'] * 40
    bar_ai_conf = mc['ai_mean'] * 40
    svg_conf = f'''<svg xmlns="http://www.w3.org/2000/svg" width="500" height="350" viewBox="0 0 500 350">
  <rect width="500" height="350" fill="#1a1d27" rx="12"/>
  <text x="250" y="30" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="16" font-weight="700">Mean Confidence Rating by Condition</text>
  <line x1="100" y1="50" x2="100" y2="280" stroke="#374151" stroke-width="1"/>
  <line x1="100" y1="280" x2="400" y2="280" stroke="#374151" stroke-width="1"/>
  <rect x="150" y="{280 - bar_ctrl_conf}" width="80" height="{bar_ctrl_conf}" fill="#22c55e" rx="6"/>
  <rect x="270" y="{280 - bar_ai_conf}" width="80" height="{bar_ai_conf}" fill="#10b981" rx="6"/>
  <text x="190" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">Control</text>
  <text x="310" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">AI Label</text>
  <text x="190" y="{275 - bar_ctrl_conf}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="14" font-weight="600">{mc['control_mean']:.2f}</text>
  <text x="310" y="{275 - bar_ai_conf}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="14" font-weight="600">{mc['ai_mean']:.2f}</text>
  <text x="250" y="330" text-anchor="middle" fill="#6b7280" font-family="Inter,sans-serif" font-size="11">t = {mc["t_statistic"]:.3f}, p = {mc["p_value"]:.4f} | Cohen's d = {mc["cohens_d"]:.3f}</text>
</svg>'''

    with open(os.path.join(output_dir, 'chart_confidence_by_condition.svg'), 'w') as f:
        f.write(svg_conf)

    # 3. RT comparison
    mr = results['rt_analysis']
    max_rt = max(mr['control_mean_ms'], mr['ai_mean_ms'])
    scale = 200 / max_rt if max_rt > 0 else 1
    bar_ctrl_rt = mr['control_mean_ms'] * scale
    bar_ai_rt = mr['ai_mean_ms'] * scale
    svg_rt = f'''<svg xmlns="http://www.w3.org/2000/svg" width="500" height="350" viewBox="0 0 500 350">
  <rect width="500" height="350" fill="#1a1d27" rx="12"/>
  <text x="250" y="30" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="16" font-weight="700">Mean Reaction Time (ms) by Condition</text>
  <line x1="100" y1="50" x2="100" y2="280" stroke="#374151" stroke-width="1"/>
  <line x1="100" y1="280" x2="400" y2="280" stroke="#374151" stroke-width="1"/>
  <rect x="150" y="{280 - bar_ctrl_rt}" width="80" height="{bar_ctrl_rt}" fill="#f59e0b" rx="6"/>
  <rect x="270" y="{280 - bar_ai_rt}" width="80" height="{bar_ai_rt}" fill="#ef4444" rx="6"/>
  <text x="190" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">Control</text>
  <text x="310" y="300" text-anchor="middle" fill="#9ca3af" font-family="Inter,sans-serif" font-size="13">AI Label</text>
  <text x="190" y="{275 - bar_ctrl_rt}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="12" font-weight="600">{mr["control_mean_ms"]:.0f}ms</text>
  <text x="310" y="{275 - bar_ai_rt}" text-anchor="middle" fill="#f0f2f5" font-family="Inter,sans-serif" font-size="12" font-weight="600">{mr["ai_mean_ms"]:.0f}ms</text>
  <text x="250" y="330" text-anchor="middle" fill="#6b7280" font-family="Inter,sans-serif" font-size="11">t = {mr["t_statistic"]:.3f}, p = {mr["p_value"]:.4f} | Cohen's d = {mr["cohens_d"]:.3f}</text>
</svg>'''

    with open(os.path.join(output_dir, 'chart_rt_distribution.svg'), 'w') as f:
        f.write(svg_rt)

    print(f'[OK] Charts saved to {output_dir}')


if __name__ == '__main__':
    main()
