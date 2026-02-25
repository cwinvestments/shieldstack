const steps = [
  {
    number: "01",
    title: "Enter Your URL",
    description: "Paste your live site URL. No signup, no repo access needed.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.822a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Get Your Score",
    description: "We scan 10 security dimensions and give you an A–F grade in under 60 seconds.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Fix What Matters",
    description: "Unlock the full report for detailed fix instructions with code snippets.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
          How It Works
        </h2>
        <p className="mt-4 text-muted text-center text-lg max-w-2xl mx-auto">
          Three steps to a more secure app. No expertise required.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}

              {/* Icon circle */}
              <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border text-primary">
                {step.icon}
              </div>

              {/* Step number */}
              <span className="mt-5 text-sm font-mono text-primary">{step.number}</span>

              {/* Title */}
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-muted text-sm max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
