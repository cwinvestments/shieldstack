# Phase 1: Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold ShieldStack Next.js project and build the complete landing page with all 6 sections + footer.

**Architecture:** Next.js 14 App Router with Tailwind CSS for styling. All landing page components are server components (no interactivity needed except the URL input in Hero). Single `page.tsx` composes all sections. Dark theme (#0a0f1a) with green (#22c55e) primary.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand (installed now, used later)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `.gitignore`, `.env.example`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /c/Projects/ShieldStack
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

If directory not empty, allow overwrite. This creates the full Next.js scaffold.

**Step 2: Install additional dependencies**

Run:
```bash
npm install zustand
```

**Step 3: Configure Tailwind with ShieldStack theme**

Replace `tailwind.config.ts` with custom theme extending colors from CLAUDE.md:

```typescript
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
```

**Step 4: Set up global styles**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0f1a;
  color: #f1f5f9;
}
```

**Step 5: Set up root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShieldStack™ — Ship fast. Ship safe.",
  description:
    "Automated security scanning for AI-generated code. Find vulnerabilities in 60 seconds. No login required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 6: Create placeholder landing page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold text-primary text-center pt-20">
        ShieldStack™
      </h1>
      <p className="text-muted text-center mt-4">Landing page coming soon.</p>
    </main>
  );
}
```

**Step 7: Create .env.example**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 8: Update .gitignore**

Ensure these are in `.gitignore`:
```
.env
.env.local
.env.production
```

**Step 9: Initialize git and verify build**

Run:
```bash
git init
npm run build
```
Expected: Build succeeds with no errors.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind and ShieldStack theme"
```

---

### Task 2: Hero Section

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Hero component**

`src/components/landing/Hero.tsx` — Full-width hero with headline, subheadline, URL input with CTA button, and trust badges below. The URL input is a client component (needs `"use client"` for form state). Shield/lock visual on the right side using CSS.

Key elements:
- H1: "Your AI-built app has security holes. Find them in 60 seconds."
- URL input with placeholder "https://your-app.com"
- Green CTA button: "Scan My Site Free →"
- Trust line: "No login required • Results in 60 seconds • Free forever"

**Step 2: Wire into page.tsx**

Import Hero and render it in `page.tsx`.

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/landing/Hero.tsx src/app/page.tsx
git commit -m "feat: add Hero section with URL input and CTA"
```

---

### Task 3: HowItWorks Section

**Files:**
- Create: `src/components/landing/HowItWorks.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create HowItWorks component**

3-step horizontal layout (stacks vertically on mobile):
1. "Enter Your URL" — with globe/link icon
2. "Get Your Score" — with shield/chart icon
3. "Fix What Matters" — with wrench/check icon

Each step: number badge, icon, title, short description. Connected with arrows/lines on desktop.

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/HowItWorks.tsx src/app/page.tsx
git commit -m "feat: add HowItWorks 3-step section"
```

---

### Task 4: WhatWeCheck Section

**Files:**
- Create: `src/components/landing/WhatWeCheck.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create WhatWeCheck component**

10-item grid (from CLAUDE.md scan checks):
1. Exposed Secrets
2. HTTP Headers
3. SSL/TLS
4. Cookie Security
5. Mixed Content
6. CORS
7. Dependencies
8. Auth Patterns
9. Common Paths
10. SEO Bonus

Each item: icon (SVG inline or emoji), title, one-line description. Grid: 2 cols mobile, 3 cols tablet, 5 cols desktop.

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/WhatWeCheck.tsx src/app/page.tsx
git commit -m "feat: add WhatWeCheck 10-item security grid"
```

---

### Task 5: SampleReport Section

**Files:**
- Create: `src/components/landing/SampleReport.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create SampleReport component**

Mock scan result card with:
- Score circle showing "B" grade (78/100)
- Summary bar: 0 critical, 1 high, 3 medium, 2 low, 4 passed
- 3-4 finding rows with severity badges and titles
- Bottom half blurred with CSS `blur(4px)` overlay
- CTA overlay: "Unlock Full Report — $29"
- Green unlock button

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/SampleReport.tsx src/app/page.tsx
git commit -m "feat: add SampleReport blurred preview section"
```

---

### Task 6: Pricing Section

**Files:**
- Create: `src/components/landing/Pricing.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Pricing component**

Two cards side-by-side:

**Free Scan** (bordered card):
- Price: $0
- Features: Security score, grade (A-F), severity counts, finding titles, shareable badge
- CTA: "Scan Free →"

**Pro Report** (highlighted card with primary border):
- Price: $29 one-time
- Features: Everything in Free +, detailed descriptions, fix recommendations with code, code snippets, file paths, PDF export
- CTA: "Get Full Report"
- "Most Popular" badge

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/Pricing.tsx src/app/page.tsx
git commit -m "feat: add Pricing comparison section"
```

---

### Task 7: FAQ Section

**Files:**
- Create: `src/components/landing/FAQ.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create FAQ component**

Accordion-style (click to expand) with 5 questions:
1. "What does ShieldStack scan for?" — list of 10 checks
2. "Do I need to create an account?" — No, anonymous scans work instantly
3. "How is this different from a manual code review?" — Instant vs 24hr, automated vs manual
4. "What do I get in the paid report?" — Full descriptions, fix code, PDF
5. "Is my site data stored?" — Minimal retention, privacy-focused

Client component (`"use client"`) for accordion toggle state.

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/FAQ.tsx src/app/page.tsx
git commit -m "feat: add FAQ accordion section"
```

---

### Task 8: Footer

**Files:**
- Create: `src/components/landing/Footer.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Footer component**

3-column layout:
- Col 1: ShieldStack™ logo/text, tagline, "Part of the ™Stack family by CW Affiliate Investments LLC"
- Col 2: Links — Pricing, Scan, Dashboard, Blog (placeholder)
- Col 3: Legal — Privacy Policy, Terms of Service, Contact

Copyright line at bottom.

**Step 2: Wire into page.tsx**

**Step 3: Verify build, commit**

```bash
git add src/components/landing/Footer.tsx src/app/page.tsx
git commit -m "feat: add Footer with links and legal"
```

---

### Task 9: Final Polish + Full Build Verify

**Step 1: Review all sections render correctly**

Run: `npm run dev` and visually verify at localhost:3000.

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors, no warnings.

**Step 3: Run linter**

Run: `npm run lint`
Expected: No errors.

**Step 4: Final commit if any polish changes**

```bash
git add -A
git commit -m "chore: polish landing page layout and spacing"
```
