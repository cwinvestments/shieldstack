const plans = [
  {
    name: "Free Scan",
    price: "$0",
    period: "forever",
    description: "Instant security overview for any live URL.",
    cta: "Scan Free →",
    ctaHref: "#hero",
    highlighted: false,
    features: [
      "Security score (0–100)",
      "Letter grade (A–F)",
      "Severity counts",
      "Finding titles",
      "Shareable badge",
    ],
  },
  {
    name: "Pro Report",
    price: "$29",
    period: "one-time",
    description: "Full breakdown with actionable fix instructions.",
    cta: "Get Full Report",
    ctaHref: "#hero",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Detailed descriptions",
      "Fix recommendations with code",
      "Code snippets & file paths",
      "PDF export",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="px-4 py-20 sm:py-28 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-muted text-center text-lg max-w-2xl mx-auto">
          Start free. Pay only when you need the full details to fix your code.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold rounded-full bg-primary text-background">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted">/ {plan.period}</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-muted">{plan.description}</p>

              {/* Features */}
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                className={`mt-8 block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-background hover:bg-primary/90"
                    : "bg-background border border-border text-foreground hover:border-primary/40"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
