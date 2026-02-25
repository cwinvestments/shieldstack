"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScoreCard from "@/components/scan/ScoreCard";
import SeveritySummary from "@/components/scan/SeveritySummary";
import FindingsList from "@/components/scan/FindingsList";
import UnlockCTA from "@/components/scan/UnlockCTA";
import type { Grade, ScanSummary, Severity } from "@/types";

interface ScanData {
  id: string;
  target_url: string;
  status: string;
  score: number;
  grade: Grade;
  summary: ScanSummary;
  is_paid?: boolean;
  results?: {
    name: string;
    severity: Severity;
    title: string;
    category: string;
    description?: string | null;
    recommendation?: string | null;
    code_snippet?: string | null;
    file_path?: string | null;
  }[];
  checks?: {
    check_name: string;
    severity: Severity;
    title: string;
    category: string;
    description?: string | null;
    recommendation?: string | null;
    code_snippet?: string | null;
    file_path?: string | null;
  }[];
}

export default function ScanResultPage() {
  const params = useParams();
  const id = params.id as string;

  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadScan() {
      // First try sessionStorage (instant results from POST)
      const cached = sessionStorage.getItem(`scan-${id}`);
      if (cached) {
        try {
          setScan(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // Fall through to API
        }
      }

      // Fetch from API
      try {
        const res = await fetch(`/api/scan/${id}`);
        if (!res.ok) {
          setError("Scan not found.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setScan(data);
      } catch {
        setError("Failed to load scan results.");
      } finally {
        setLoading(false);
      }
    }

    loadScan();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 text-primary animate-spin mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-4 text-muted">Loading scan results...</p>
        </div>
      </main>
    );
  }

  if (error || !scan) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Scan Not Found</h1>
          <p className="mt-2 text-muted">{error || "This scan doesn't exist or has expired."}</p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 transition-colors"
          >
            Scan Another Site
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = scan.is_paid ?? false;

  // Normalize findings — handle both POST response format and GET response format
  const findings = scan.results?.map((r) => ({
    name: r.name,
    severity: r.severity,
    title: r.title,
    category: r.category,
    description: r.description ?? null,
    recommendation: r.recommendation ?? null,
    code_snippet: r.code_snippet ?? null,
    file_path: r.file_path ?? null,
  })) ?? scan.checks?.map((c) => ({
    name: c.check_name,
    severity: c.severity,
    title: c.title,
    category: c.category,
    description: c.description ?? null,
    recommendation: c.recommendation ?? null,
    code_snippet: c.code_snippet ?? null,
    file_path: c.file_path ?? null,
  })) ?? [];

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <span className="font-bold">ShieldStack</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Scan Another Site
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-12 space-y-10">
        {/* Score Card */}
        <ScoreCard
          score={scan.score}
          grade={scan.grade}
          targetUrl={scan.target_url}
        />

        {/* Severity Summary */}
        <SeveritySummary summary={scan.summary} />

        {/* Unlock CTA (free tier only, shown above findings) */}
        {!isPaid && findings.some((f) => f.severity !== "pass") && (
          <UnlockCTA scanId={id} />
        )}

        {/* Findings List */}
        <FindingsList findings={findings} isPaid={isPaid} />

        {/* Bottom CTA (free tier only) */}
        {!isPaid && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted mb-3">
              Want the full picture? Unlock detailed fix instructions.
            </p>
            <button
              onClick={() => {
                // TODO: Wire to Stripe
                console.log("Unlock scan:", id);
              }}
              className="px-8 py-3 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Full Report &mdash; $29
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
