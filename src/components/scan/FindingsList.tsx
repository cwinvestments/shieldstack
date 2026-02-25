"use client";

import type { Severity } from "@/types";

interface Finding {
  name: string;
  severity: Severity;
  title: string;
  category: string;
  description?: string | null;
  recommendation?: string | null;
  code_snippet?: string | null;
  file_path?: string | null;
}

const severityOrder: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
  pass: 5,
};

const severityColors: Record<Severity, string> = {
  critical: "bg-severity-critical",
  high: "bg-severity-high",
  medium: "bg-severity-medium",
  low: "bg-severity-low",
  info: "bg-severity-info",
  pass: "bg-severity-pass",
};

const severityBadgeColors: Record<Severity, string> = {
  critical: "text-severity-critical border-severity-critical/30 bg-severity-critical/10",
  high: "text-severity-high border-severity-high/30 bg-severity-high/10",
  medium: "text-severity-medium border-severity-medium/30 bg-severity-medium/10",
  low: "text-severity-low border-severity-low/30 bg-severity-low/10",
  info: "text-severity-info border-severity-info/30 bg-severity-info/10",
  pass: "text-severity-pass border-severity-pass/30 bg-severity-pass/10",
};

interface FindingsListProps {
  findings: Finding[];
  isPaid: boolean;
}

export default function FindingsList({ findings, isPaid }: FindingsListProps) {
  // Sort by severity (critical first, pass last)
  const sorted = [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const issues = sorted.filter((f) => f.severity !== "pass");
  const passed = sorted.filter((f) => f.severity === "pass");

  return (
    <div className="space-y-6">
      {/* Issues */}
      {issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Issues Found ({issues.length})
          </h3>
          <div className="space-y-3">
            {issues.map((finding, i) => (
              <FindingCard key={`${finding.name}-${i}`} finding={finding} isPaid={isPaid} />
            ))}
          </div>
        </div>
      )}

      {/* Passed checks */}
      {passed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Passed Checks ({passed.length})
          </h3>
          <div className="space-y-2">
            {passed.map((finding, i) => (
              <div
                key={`${finding.name}-${i}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border"
              >
                <span className={`flex-shrink-0 w-2 h-2 rounded-full ${severityColors[finding.severity]}`} />
                <span className="text-sm text-foreground">{finding.title}</span>
                <span className={`ml-auto text-xs capitalize px-2 py-0.5 rounded-full border ${severityBadgeColors[finding.severity]}`}>
                  pass
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FindingCard({ finding, isPaid }: { finding: Finding; isPaid: boolean }) {
  const hasDetails = finding.description || finding.recommendation;
  const showDetails = isPaid && hasDetails;

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${severityColors[finding.severity]}`} />
        <span className="text-sm font-medium text-foreground flex-1">
          {finding.title}
        </span>
        <span className={`text-xs capitalize px-2.5 py-0.5 rounded-full border ${severityBadgeColors[finding.severity]}`}>
          {finding.severity}
        </span>
      </div>

      {/* Details (paid only) */}
      {showDetails && (
        <div className="px-5 pb-4 pt-0 space-y-3 border-t border-border mt-0 pt-4">
          {finding.description && (
            <p className="text-sm text-muted leading-relaxed">
              {finding.description}
            </p>
          )}
          {finding.recommendation && (
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Recommendation
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {finding.recommendation}
              </p>
            </div>
          )}
          {finding.code_snippet && (
            <pre className="text-xs bg-background rounded-lg p-3 overflow-x-auto text-muted font-mono">
              {finding.code_snippet}
            </pre>
          )}
          {finding.file_path && (
            <p className="text-xs text-muted">
              <span className="font-semibold">File:</span> {finding.file_path}
            </p>
          )}
        </div>
      )}

      {/* Locked indicator for free tier */}
      {!isPaid && hasDetails && (
        <div className="px-5 py-3 border-t border-border bg-background/50 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="text-xs text-muted">
            Unlock full details with Pro Report
          </span>
        </div>
      )}
    </div>
  );
}
