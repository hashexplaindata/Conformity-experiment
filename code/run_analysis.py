"""
============================================================
CAUSAL INFERENCE PIPELINE — Algorithmic Conformity Study
============================================================
Processes behavioral_telemetry.csv and executes:
  1. Data cleaning (RT outlier removal)
  2. Chi-Square Test of Independence (conformity effect)
  3. Independent Samples T-Test (cognitive offloading)
  4. Split Violin Plot (RT distribution by condition)

Dependencies: pandas, scipy, seaborn, matplotlib
Usage: python run_analysis.py --input behavioral_telemetry.csv
============================================================
"""

import argparse
import sys
import os
import numpy as np
import pandas as pd
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for script use


def load_and_validate(filepath):
    """Load CSV and validate schema."""
    required_cols = [
        'Participant_ID', 'Condition', 'Trial_Number',
        'Target_Option_Position', 'User_Choice', 'Reaction_Time_ms'
    ]
    df = pd.read_csv(filepath)
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"[ERROR] Missing columns: {missing}")
        sys.exit(1)
    print(f"[OK] Loaded {len(df)} rows, {df['Participant_ID'].nunique()} participants")
    return df


def clean_data(df):
    """
    Remove implausible reaction times:
      - RT < 250ms  => accidental / bot clicks
      - RT > mean + 3*SD => distraction / inattention
    """
    n_before = len(df)

    # Drop sub-250ms (accidental clicks)
    df = df[df['Reaction_Time_ms'] >= 250].copy()
    n_fast = n_before - len(df)

    # Drop > 3 SD above mean (distraction)
    mean_rt = df['Reaction_Time_ms'].mean()
    std_rt = df['Reaction_Time_ms'].std()
    upper_bound = mean_rt + 3 * std_rt
    df = df[df['Reaction_Time_ms'] <= upper_bound].copy()
    n_slow = n_before - n_fast - len(df)

    print(f"[CLEAN] Removed {n_fast} fast clicks (<250ms), {n_slow} slow outliers (>3SD)")
    print(f"[CLEAN] Remaining: {len(df)} rows ({df['Participant_ID'].nunique()} participants)")
    return df


def test_conformity(df):
    """
    HYPOTHESIS 1: Conformity Effect
    Chi-Square Test of Independence comparing the choice probability
    of the target option between Control and AI_Labeled groups.

    H0: The presence of the AI label does not affect choice probability.
    H1: The AI label shifts choice probability toward the labeled option.
    """
    print("\n" + "=" * 60)
    print("HYPOTHESIS 1: CONFORMITY EFFECT (Chi-Square)")
    print("=" * 60)

    # Compute whether user chose the target option
    if 'Chose_Target' not in df.columns:
        df['Chose_Target'] = (df['User_Choice'] == df['Target_Option_Position']).astype(int)

    # Build contingency table: Condition x Chose_Target
    ct = pd.crosstab(df['Condition'], df['Chose_Target'], margins=False)
    print("\nContingency Table:")
    print(ct.to_string())

    # Run Chi-Square
    chi2, p, dof, expected = stats.chi2_contingency(ct)

    # Effect size: Cramer's V
    n = ct.values.sum()
    k = min(ct.shape) - 1
    cramers_v = np.sqrt(chi2 / (n * k)) if k > 0 else 0

    print(f"\nChi-Square = {chi2:.4f}")
    print(f"p-value    = {p:.6f}")
    print(f"DoF        = {dof}")
    print(f"Cramer's V = {cramers_v:.4f}")

    # Choice rates per condition
    rates = df.groupby('Condition')['Chose_Target'].mean()
    for cond, rate in rates.items():
        print(f"  {cond}: {rate:.1%} chose target option")

    if p < 0.05:
        print("\n>> RESULT: SIGNIFICANT conformity effect detected.")
    else:
        print("\n>> RESULT: No significant conformity effect at alpha=0.05.")

    return {'chi2': chi2, 'p': p, 'dof': dof, 'cramers_v': cramers_v, 'rates': rates.to_dict()}


def test_cognitive_offloading(df):
    """
    HYPOTHESIS 2: Cognitive Offloading
    Independent Samples T-Test comparing cleaned Reaction Times
    between Control and AI_Labeled groups.

    H0: Mean RT does not differ between conditions.
    H1: AI label reduces cognitive effort (lower RT in AI condition).
    """
    print("\n" + "=" * 60)
    print("HYPOTHESIS 2: COGNITIVE OFFLOADING (T-Test)")
    print("=" * 60)

    rt_control = df.loc[df['Condition'] == 'Control', 'Reaction_Time_ms']
    rt_ai = df.loc[df['Condition'] == 'AI_Labeled', 'Reaction_Time_ms']

    if len(rt_control) == 0 or len(rt_ai) == 0:
        print("[WARN] One or both conditions have no data. Skipping T-Test.")
        return None

    # Independent samples t-test (Welch's, unequal variance)
    t_stat, p = stats.ttest_ind(rt_control, rt_ai, equal_var=False)

    # Effect size: Cohen's d
    pooled_std = np.sqrt(
        ((len(rt_control) - 1) * rt_control.std()**2 +
         (len(rt_ai) - 1) * rt_ai.std()**2) /
        (len(rt_control) + len(rt_ai) - 2)
    )
    cohens_d = (rt_control.mean() - rt_ai.mean()) / pooled_std if pooled_std > 0 else 0

    print(f"\nControl:   M = {rt_control.mean():.1f} ms, SD = {rt_control.std():.1f} ms, n = {len(rt_control)}")
    print(f"AI_Labeled: M = {rt_ai.mean():.1f} ms, SD = {rt_ai.std():.1f} ms, n = {len(rt_ai)}")
    print(f"\nt-statistic = {t_stat:.4f}")
    print(f"p-value     = {p:.6f}")
    print(f"Cohen's d   = {cohens_d:.4f}")

    if p < 0.05:
        direction = "faster" if rt_ai.mean() < rt_control.mean() else "slower"
        print(f"\n>> RESULT: SIGNIFICANT RT difference. AI condition was {direction}.")
    else:
        print("\n>> RESULT: No significant RT difference at alpha=0.05.")

    return {'t': t_stat, 'p': p, 'cohens_d': cohens_d,
            'mean_control': rt_control.mean(), 'mean_ai': rt_ai.mean()}


def plot_split_violin(df, output_path):
    """
    Generate a split violin plot showing Reaction Time distribution
    density for Control vs AI_Labeled condition.
    """
    print("\n" + "=" * 60)
    print("GENERATING SPLIT VIOLIN PLOT")
    print("=" * 60)

    fig, ax = plt.subplots(figsize=(10, 6))

    # Dark theme
    fig.patch.set_facecolor('#0a0a0a')
    ax.set_facecolor('#0a0a0a')

    # Create the split violin
    palette = {'Control': '#64748B', 'AI_Labeled': '#2997FF'}
    sns.violinplot(
        data=df,
        x='Condition',
        y='Reaction_Time_ms',
        hue='Condition',
        split=False,
        inner='quart',    # Show quartile lines
        palette=palette,
        linewidth=1.2,
        saturation=0.85,
        ax=ax,
        legend=False,
    )

    # Overlay individual data points (jittered strip plot)
    sns.stripplot(
        data=df,
        x='Condition',
        y='Reaction_Time_ms',
        hue='Condition',
        palette=palette,
        size=3,
        alpha=0.25,
        jitter=True,
        ax=ax,
        legend=False,
    )

    # Styling
    ax.set_title('Reaction Time Distribution by Condition',
                 fontsize=16, fontweight='bold', color='#f5f5f7', pad=20)
    ax.set_xlabel('Experimental Condition', fontsize=12, color='#a1a1a6', labelpad=12)
    ax.set_ylabel('Reaction Time (ms)', fontsize=12, color='#a1a1a6', labelpad=12)
    ax.tick_params(colors='#86868b', labelsize=10)
    ax.spines['bottom'].set_color('#333')
    ax.spines['left'].set_color('#333')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.grid(axis='y', color='#222', linewidth=0.5, alpha=0.5)

    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight',
                facecolor='#0a0a0a', edgecolor='none')
    plt.close()
    print(f"[OK] Saved violin plot to {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Causal Inference Pipeline for Algorithmic Conformity Study'
    )
    parser.add_argument('--input', required=True, help='Path to behavioral_telemetry.csv')
    parser.add_argument('--output', default='.', help='Output directory for plots')
    args = parser.parse_args()

    # 1. Load
    df = load_and_validate(args.input)

    # 2. Clean
    df = clean_data(df)

    if len(df) == 0:
        print("[ERROR] No data remaining after cleaning. Exiting.")
        sys.exit(1)

    # 3. Test H1: Conformity Effect
    h1 = test_conformity(df)

    # 4. Test H2: Cognitive Offloading
    h2 = test_cognitive_offloading(df)

    # 5. Visualize
    plot_path = os.path.join(args.output, 'rt_violin_plot.png')
    plot_split_violin(df, plot_path)

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
