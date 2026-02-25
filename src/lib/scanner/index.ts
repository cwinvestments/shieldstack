import type { CheckResult, Grade, ScanSummary, ScannerModule } from "@/types";
import { calculateGrade, calculateScore, calculateSummary } from "./scoring";

import headersCheck from "./checks/headers";
import sslCheck from "./checks/ssl";
import cookiesCheck from "./checks/cookies";
import secretsCheck from "./checks/secrets";
import corsCheck from "./checks/cors";
import commonPathsCheck from "./checks/common-paths";

// All registered scanner modules
const scanners: ScannerModule[] = [
  headersCheck,
  sslCheck,
  cookiesCheck,
  secretsCheck,
  corsCheck,
  commonPathsCheck,
];

export interface ScanResult {
  results: CheckResult[];
  score: number;
  grade: Grade;
  summary: ScanSummary;
}

/**
 * Run all scan checks in parallel against a target URL.
 * Returns aggregated results with score, grade, and summary.
 */
export async function runScan(url: string): Promise<ScanResult> {
  // Normalize URL — ensure it has a protocol
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  // Validate URL format
  try {
    new URL(targetUrl);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Run all checks in parallel
  const checkResults = await Promise.allSettled(
    scanners.map((scanner) => scanner.run(targetUrl))
  );

  // Flatten results, handling any failed checks gracefully
  const results: CheckResult[] = [];
  for (let i = 0; i < checkResults.length; i++) {
    const result = checkResults[i];
    if (result.status === "fulfilled") {
      results.push(...result.value);
    } else {
      // If a check module crashed, record it as info
      results.push({
        name: `${scanners[i].name}_error`,
        category: "security",
        severity: "info",
        title: `${scanners[i].title} check failed`,
        description: `The ${scanners[i].title} check encountered an error and could not complete.`,
        recommendation: "This check will be retried on the next scan.",
      });
    }
  }

  const score = calculateScore(results);
  const grade = calculateGrade(score);
  const summary = calculateSummary(results);

  return { results, score, grade, summary };
}
