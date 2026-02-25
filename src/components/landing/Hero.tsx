"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store scan results for the results page
      sessionStorage.setItem(`scan-${data.id}`, JSON.stringify(data));
      router.push(`/scan/${data.id}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <section id="hero" className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          Purpose-built for AI-generated code
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Your AI-built app has{" "}
          <span className="text-severity-critical">security holes</span>.
          <br />
          Find them in{" "}
          <span className="text-primary">60 seconds</span>.
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto">
          ShieldStack scans your live site for vulnerabilities — exposed secrets,
          missing headers, SSL issues, and more. Get your security grade
          instantly.
        </p>

        {/* URL Input */}
        <form onSubmit={handleScan} className="mt-10 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-app.com"
              required
              disabled={loading}
              className="flex-1 px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-lg bg-primary text-background font-semibold text-base hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scanning...
                </span>
              ) : (
                "Scan My Site Free \u2192"
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-severity-critical">{error}</p>
          )}
        </form>

        {/* Trust badges */}
        <p className="mt-5 text-sm text-muted">
          No login required &bull; Results in 60 seconds &bull; Free forever
        </p>
      </div>
    </section>
  );
}
