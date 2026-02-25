"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does ShieldStack scan for?",
    answer:
      "We scan 10 security dimensions: exposed secrets & API keys, HTTP security headers, SSL/TLS certificates, cookie security flags, mixed content, CORS misconfigurations, known dependency CVEs, client-side auth bypasses, exposed sensitive paths (/.env, /.git, /admin), and basic SEO meta tags.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Your first scan is completely anonymous — just paste a URL and get your security grade in under 60 seconds. You only need an account if you want to track scan history or set up recurring monitoring.",
  },
  {
    question: "How is this different from a manual code review?",
    answer:
      "Manual reviews take 24+ hours and cost $19–$29 per review. ShieldStack gives you instant results by scanning your live site automatically. We catch the most common vulnerabilities in AI-generated code within seconds, not days.",
  },
  {
    question: "What do I get in the paid report?",
    answer:
      "The free scan shows your score, grade, and finding titles. The $29 Pro Report unlocks full descriptions of each vulnerability, step-by-step fix recommendations with code snippets, affected file paths, and a downloadable PDF you can share with your team.",
  },
  {
    question: "Is my site data stored?",
    answer:
      "We store minimal scan metadata (URL, score, findings) to display your results. We never store your source code or page content. Scan data is automatically purged after 90 days for anonymous scans.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-muted text-center text-lg">
          Everything you need to know about ShieldStack.
        </p>

        <div className="mt-12 divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
              >
                <span className="text-base font-medium text-foreground">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-muted transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all ${
                  openIndex === i ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
