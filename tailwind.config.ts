import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1a",
        card: "#111827",
        primary: "#22c55e",
        accent: "#14b8a6",
        foreground: "#f1f5f9",
        muted: "#94a3b8",
        border: "#1e293b",
        severity: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#eab308",
          low: "#3b82f6",
          info: "#6b7280",
          pass: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
