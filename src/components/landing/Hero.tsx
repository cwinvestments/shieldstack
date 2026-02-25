"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    const encoded = encodeURIComponent(url.trim());
    router.push(`/scan?url=${encoded}`);
  }

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
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
              className="flex-1 px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-lg bg-primary text-background font-semibold text-base hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Scan My Site Free &rarr;
            </button>
          </div>
        </form>

        {/* Trust badges */}
        <p className="mt-5 text-sm text-muted">
          No login required &bull; Results in 60 seconds &bull; Free forever
        </p>
      </div>
    </section>
  );
}
