"use client";

import { useEffect, useState } from "react";

const scanSteps = [
  { label: "Checking SSL/TLS certificate", icon: "lock" },
  { label: "Scanning HTTP security headers", icon: "shield" },
  { label: "Analyzing cookie security", icon: "cookie" },
  { label: "Searching for exposed secrets", icon: "key" },
  { label: "Testing CORS configuration", icon: "arrows" },
  { label: "Probing sensitive paths", icon: "folder" },
  { label: "Calculating security score", icon: "chart" },
];

interface ScanProgressProps {
  targetUrl: string;
}

export default function ScanProgress({ targetUrl }: ScanProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scanSteps.length - 1) return prev;
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center px-4">
      {/* Animated shield */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center">
          <svg className="w-10 h-10 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground">
        Scanning your site...
      </h2>
      <p className="mt-2 text-sm text-muted truncate">{targetUrl}</p>

      {/* Progress steps */}
      <div className="mt-8 space-y-3 text-left">
        {scanSteps.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
              i < currentStep
                ? "bg-primary/5"
                : i === currentStep
                  ? "bg-card border border-primary/30"
                  : "opacity-40"
            }`}
          >
            {/* Status indicator */}
            {i < currentStep ? (
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : i === currentStep ? (
              <svg className="w-4 h-4 text-primary flex-shrink-0 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
            )}

            <span
              className={`text-sm ${
                i <= currentStep ? "text-foreground" : "text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
