import type { Grade } from "@/types";

const gradeColors: Record<Grade, string> = {
  A: "text-severity-pass border-severity-pass",
  B: "text-severity-medium border-severity-medium",
  C: "text-severity-medium border-severity-medium",
  D: "text-severity-high border-severity-high",
  F: "text-severity-critical border-severity-critical",
};

const gradeLabels: Record<Grade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Needs Work",
  D: "Poor",
  F: "Critical Risk",
};

interface ScoreCardProps {
  score: number;
  grade: Grade;
  targetUrl: string;
}

export default function ScoreCard({ score, grade, targetUrl }: ScoreCardProps) {
  const colorClass = gradeColors[grade];
  const label = gradeLabels[grade];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Grade circle */}
      <div
        className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 flex flex-col items-center justify-center ${colorClass}`}
      >
        <span className="text-5xl sm:text-6xl font-bold">{grade}</span>
        <span className="text-lg sm:text-xl font-mono text-muted">
          {score} / 100
        </span>
      </div>

      {/* Label */}
      <p className={`mt-4 text-lg font-semibold ${colorClass.split(" ")[0]}`}>
        {label}
      </p>

      {/* Target URL */}
      <p className="mt-2 text-sm text-muted truncate max-w-md">
        {targetUrl}
      </p>
    </div>
  );
}
