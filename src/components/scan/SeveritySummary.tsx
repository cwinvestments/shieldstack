import type { ScanSummary } from "@/types";

const badges: {
  key: keyof ScanSummary;
  label: string;
  color: string;
  bg: string;
}[] = [
  { key: "critical", label: "Critical", color: "text-severity-critical", bg: "bg-severity-critical/10" },
  { key: "high", label: "High", color: "text-severity-high", bg: "bg-severity-high/10" },
  { key: "medium", label: "Medium", color: "text-severity-medium", bg: "bg-severity-medium/10" },
  { key: "low", label: "Low", color: "text-severity-low", bg: "bg-severity-low/10" },
  { key: "info", label: "Info", color: "text-severity-info", bg: "bg-severity-info/10" },
  { key: "passed", label: "Passed", color: "text-severity-pass", bg: "bg-severity-pass/10" },
];

interface SeveritySummaryProps {
  summary: ScanSummary;
}

export default function SeveritySummary({ summary }: SeveritySummaryProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {badges.map((badge) => {
        const count = summary[badge.key];
        return (
          <div
            key={badge.key}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${badge.bg}`}
          >
            <span className={`text-xl font-bold ${badge.color}`}>
              {count}
            </span>
            <span className="text-sm text-muted">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
