const findings = [
  { severity: "high", color: "bg-severity-high", title: "Missing Content-Security-Policy header" },
  { severity: "medium", color: "bg-severity-medium", title: "Cookies missing SameSite attribute" },
  { severity: "medium", color: "bg-severity-medium", title: "No Referrer-Policy header detected" },
  { severity: "medium", color: "bg-severity-medium", title: "X-Frame-Options header not set" },
  { severity: "low", color: "bg-severity-low", title: "No Permissions-Policy header" },
  { severity: "low", color: "bg-severity-low", title: "Missing robots.txt file" },
  { severity: "pass", color: "bg-severity-pass", title: "SSL certificate valid (expires in 287 days)" },
  { severity: "pass", color: "bg-severity-pass", title: "No exposed API keys in page source" },
  { severity: "pass", color: "bg-severity-pass", title: "CORS policy properly configured" },
  { severity: "pass", color: "bg-severity-pass", title: "No exposed .env or .git paths" },
];

const summaryBadges = [
  { label: "Critical", count: 0, color: "text-severity-critical" },
  { label: "High", count: 1, color: "text-severity-high" },
  { label: "Medium", count: 3, color: "text-severity-medium" },
  { label: "Low", count: 2, color: "text-severity-low" },
  { label: "Passed", count: 4, color: "text-severity-pass" },
];

export default function SampleReport() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
          See What You Get
        </h2>
        <p className="mt-4 text-muted text-center text-lg max-w-2xl mx-auto">
          Here&apos;s a sample scan report. Unlock the full details for $29.
        </p>

        {/* Report card */}
        <div className="mt-12 rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header with score */}
          <div className="p-6 sm:p-8 border-b border-border flex flex-col sm:flex-row items-center gap-6">
            {/* Grade circle */}
            <div className="flex-shrink-0 w-24 h-24 rounded-full border-4 border-severity-medium flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-severity-medium">B</span>
              <span className="text-xs text-muted">78 / 100</span>
            </div>

            {/* Summary badges */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              {summaryBadges.map((badge) => (
                <div key={badge.label} className="text-center">
                  <div className={`text-2xl font-bold ${badge.color}`}>
                    {badge.count}
                  </div>
                  <div className="text-xs text-muted">{badge.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings list — first 3 visible, rest blurred */}
          <div className="relative">
            {/* Visible findings */}
            <div className="divide-y divide-border">
              {findings.slice(0, 3).map((finding, i) => (
                <div key={i} className="px-6 sm:px-8 py-4 flex items-center gap-3">
                  <span className={`flex-shrink-0 w-2 h-2 rounded-full ${finding.color}`} />
                  <span className="text-sm text-foreground">{finding.title}</span>
                  <span className="ml-auto text-xs text-muted capitalize px-2 py-0.5 rounded-full border border-border">
                    {finding.severity}
                  </span>
                </div>
              ))}
            </div>

            {/* Blurred findings */}
            <div className="relative">
              <div className="divide-y divide-border blur-[6px] select-none pointer-events-none">
                {findings.slice(3).map((finding, i) => (
                  <div key={i} className="px-6 sm:px-8 py-4 flex items-center gap-3">
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full ${finding.color}`} />
                    <span className="text-sm text-foreground">{finding.title}</span>
                    <span className="ml-auto text-xs text-muted capitalize px-2 py-0.5 rounded-full border border-border">
                      {finding.severity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60">
                <p className="text-lg font-semibold text-foreground mb-1">
                  Unlock Full Report
                </p>
                <p className="text-sm text-muted mb-4">
                  Detailed descriptions, fix instructions &amp; code snippets
                </p>
                <button className="px-8 py-3 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 transition-colors">
                  Get Full Report &mdash; $29
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
