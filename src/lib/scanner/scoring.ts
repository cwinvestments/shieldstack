import type { CheckResult, Grade, ScanSummary } from "@/types";

const WEIGHTS: Record<string, number> = {
  critical: 15,
  high: 8,
  medium: 3,
  low: 1,
};

export function calculateScore(results: CheckResult[]): number {
  let score = 100;
  for (const r of results) {
    score -= WEIGHTS[r.severity] ?? 0;
  }
  return Math.max(0, Math.min(100, score));
}

export function calculateGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function calculateSummary(results: CheckResult[]): ScanSummary {
  const summary: ScanSummary = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    passed: 0,
  };
  for (const r of results) {
    if (r.severity === "pass") summary.passed++;
    else if (r.severity in summary) {
      summary[r.severity as keyof Omit<ScanSummary, "passed">]++;
    }
  }
  return summary;
}
