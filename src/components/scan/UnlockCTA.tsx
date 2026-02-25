interface UnlockCTAProps {
  scanId: string;
}

export default function UnlockCTA({ scanId }: UnlockCTAProps) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8 text-center">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
        <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-foreground">
        Unlock Your Full Security Report
      </h3>

      <p className="mt-3 text-sm text-muted max-w-md mx-auto">
        Get detailed vulnerability descriptions, step-by-step fix recommendations
        with code snippets, file paths, and a downloadable PDF report.
      </p>

      {/* What you get */}
      <ul className="mt-5 space-y-2 text-sm text-left max-w-sm mx-auto">
        {[
          "Detailed vulnerability descriptions",
          "Fix recommendations with code",
          "Code snippets & file paths",
          "Downloadable PDF report",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-foreground">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      {/* Price + CTA */}
      <div className="mt-6">
        <button
          onClick={() => {
            // TODO: Wire to Stripe checkout
            console.log("Unlock scan:", scanId);
          }}
          className="px-10 py-3.5 rounded-lg bg-primary text-background font-semibold text-base hover:bg-primary/90 transition-colors"
        >
          Get Full Report &mdash; $29
        </button>
        <p className="mt-3 text-xs text-muted">
          One-time payment &bull; Instant access &bull; PDF included
        </p>
      </div>
    </div>
  );
}
