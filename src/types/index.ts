// === Severity levels ===
export type Severity = "critical" | "high" | "medium" | "low" | "info" | "pass";

// === Check result returned by each scanner module ===
export interface CheckResult {
  name: string;
  category: "security" | "performance" | "architecture";
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
  filePath?: string;
}

// === Scanner module interface ===
export interface ScannerModule {
  name: string;
  title: string;
  run: (url: string) => Promise<CheckResult[]>;
}

// === Scan summary ===
export interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  passed: number;
}

// === Grade ===
export type Grade = "A" | "B" | "C" | "D" | "F";

// === Scan record (matches DB schema) ===
export interface Scan {
  id: string;
  user_id: string | null;
  scan_type: "security" | "code" | "full";
  target_url: string;
  github_repo: string | null;
  status: "pending" | "running" | "completed" | "failed";
  score: number;
  grade: Grade;
  summary: ScanSummary;
  results: CheckResult[];
  is_paid: boolean;
  stripe_payment_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// === Scan check record (matches DB schema) ===
export interface ScanCheck {
  id: string;
  scan_id: string;
  category: "security" | "performance" | "architecture";
  check_name: string;
  severity: Severity;
  title: string;
  description: string | null;
  recommendation: string | null;
  code_snippet: string | null;
  file_path: string | null;
  created_at: string;
}
