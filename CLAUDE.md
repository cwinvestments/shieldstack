# ShieldStack™ - Claude Code Context

## Project Overview
ShieldStack™ is an automated code audit and security scanning platform for vibe coders, indie hackers, and non-technical founders. Freemium model: free instant security scan (no login), paid detailed report ($29) with fix instructions.

**Tagline:** "Ship fast. Ship safe."
**Competitor:** SpringCode.dev (manual reviews, 24hr delivery, $19-$29)
**Our edge:** Instant automated scans, no login required, purpose-built for AI-generated code

## URLs
- **App**: shieldstack.dev (or shieldstack.pro)
- **Dev**: localhost:3000

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Payments**: Stripe (one-time $29 report + future subscriptions)
- **Hosting**: Netlify (frontend), Railway (scan workers if needed)
- **State**: Zustand

## Project Structure
```
src/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── pricing/page.tsx                # Pricing page
│   ├── scan/page.tsx                   # Free scan input (no auth)
│   ├── scan/[id]/page.tsx              # Scan results (free=summary, paid=full)
│   ├── scan/[id]/report/page.tsx       # PDF report (paid only)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx          # Overview: recent scans, usage, trends
│   │   ├── dashboard/scans/page.tsx    # Scan history with filters
│   │   ├── dashboard/scans/new/page.tsx
│   │   └── dashboard/settings/page.tsx
│   └── api/
│       ├── scan/route.ts               # POST: start scan
│       ├── scan/[id]/route.ts          # GET: scan results
│       ├── scan/[id]/unlock/route.ts   # POST: Stripe payment to unlock
│       ├── badge/[id]/route.ts         # GET: SVG badge image
│       └── webhooks/stripe/route.ts
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── scanner/
│   │   ├── index.ts                    # Scan orchestrator
│   │   ├── security-scan.ts            # URL-based checks
│   │   ├── code-audit.ts              # GitHub-based checks (Phase 2)
│   │   ├── checks/
│   │   │   ├── headers.ts             # HTTP security headers
│   │   │   ├── ssl.ts                 # SSL/TLS certificate
│   │   │   ├── cookies.ts            # Cookie security flags
│   │   │   ├── secrets.ts            # Exposed API keys in JS bundles
│   │   │   ├── cors.ts               # CORS misconfiguration
│   │   │   ├── dependencies.ts       # JS library CVE check
│   │   │   ├── auth-patterns.ts      # Client-side auth bypasses
│   │   │   └── common-paths.ts       # Exposed /.env, /admin, /api/debug
│   │   └── scoring.ts                # Score calculation + grading
│   └── pdf-report.ts                  # PDF generation for paid reports
├── components/
│   ├── landing/
│   │   ├── Hero.tsx                   # URL input + "Scan My Site Free"
│   │   ├── HowItWorks.tsx            # 3-step process
│   │   ├── WhatWeCheck.tsx           # Icon grid of scan checks
│   │   ├── SampleReport.tsx          # Blurred report preview
│   │   ├── Pricing.tsx               # Free vs Pro comparison
│   │   └── FAQ.tsx
│   ├── scan/
│   │   ├── ScanInput.tsx             # URL input component
│   │   ├── ScanProgress.tsx          # Animated progress during scan
│   │   ├── ScoreCard.tsx             # Big A-F grade display
│   │   ├── FindingsList.tsx          # List of findings (locked/unlocked)
│   │   └── UnlockCTA.tsx             # $29 unlock prompt
│   ├── dashboard/
│   │   ├── ScanHistory.tsx
│   │   ├── UsageStats.tsx
│   │   └── ScoreTrend.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── stores/
│   └── useAppStore.ts
└── types/
    └── index.ts
```

## Database Schema

### `users` table
- id (uuid, PK)
- email (text, unique)
- name (text)
- plan (text: 'free' | 'pro' | 'agency', default 'free')
- stripe_customer_id (text, nullable)
- scans_used (integer, default 0)
- created_at, updated_at (timestamptz)

### `scans` table
- id (uuid, PK)
- user_id (uuid, nullable — anonymous scans allowed)
- scan_type (text: 'security' | 'code' | 'full')
- target_url (text)
- github_repo (text, nullable)
- status (text: 'pending' | 'running' | 'completed' | 'failed')
- score (integer, 0-100)
- grade (text: A, B, C, D, F)
- summary (jsonb: { critical, high, medium, low, passed })
- results (jsonb — full results, gated for paid)
- is_paid (boolean, default false)
- stripe_payment_id (text, nullable)
- started_at, completed_at, created_at (timestamptz)

### `scan_checks` table
- id (uuid, PK)
- scan_id (uuid, FK → scans, CASCADE delete)
- category (text: 'security', 'performance', 'architecture')
- check_name (text: 'exposed_api_keys', 'missing_csp', etc.)
- severity (text: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'pass')
- title (text — always visible)
- description (text — FREE: truncated, PAID: full)
- recommendation (text — PAID only)
- code_snippet (text — PAID only)
- file_path (text — PAID only)
- created_at (timestamptz)

### RLS Policies
- Users see only their own scans
- Anonymous scans (user_id = NULL) accessible by scan ID
- scan_checks filtered through parent scan ownership

## Scoring System
```
Score = 100 - (critical × 15) - (high × 8) - (medium × 3) - (low × 1)
Minimum: 0

A = 90-100 (Excellent)
B = 75-89  (Good)
C = 60-74  (Needs Work)
D = 40-59  (Poor)
F = 0-39   (Critical Risk)
```

## Security Scan Checks (Phase 1 — URL-based)
1. **Exposed Secrets** — Scan page source + JS bundles for API keys, tokens, .env patterns
2. **HTTP Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
3. **SSL/TLS** — Certificate validity, expiry, protocol version
4. **Cookie Security** — HttpOnly, Secure, SameSite flags
5. **Mixed Content** — HTTP resources on HTTPS pages
6. **CORS** — Overly permissive Access-Control-Allow-Origin
7. **Dependencies** — Parse visible JS library versions against CVE databases
8. **Auth Patterns** — Client-side auth bypasses, exposed admin routes
9. **Common Paths** — Probe for /.env, /admin, /api/debug, /.git, /wp-admin, etc.
10. **SEO Bonus** — Basic meta tags, OG tags, robots.txt (free goodwill)

## Free vs Paid Gating
- **FREE**: Score, grade, severity counts, finding titles only
- **PAID ($29)**: Full descriptions, fix recommendations with code, code snippets, file paths, PDF export

## Shareable Badge
```html
<a href="https://shieldstack.dev/scan/SCAN_ID">
  <img src="https://shieldstack.dev/api/badge/SCAN_ID" alt="ShieldStack Grade: B" />
</a>
```
Badge endpoint returns SVG with grade + score. Viral marketing — every badge is a backlink.

## UI Theme
```
Background:     #0a0f1a (dark)
Card:           #111827
Primary:        #22c55e (green — security/shield theme)
Accent:         #14b8a6 (teal)
Text:           #f1f5f9
Muted:          #94a3b8
Border:         #1e293b
Critical:       #ef4444 (red)
High:           #f97316 (orange)
Medium:         #eab308 (yellow)
Low:            #3b82f6 (blue)
Pass:           #22c55e (green)
```

## Severity Badge Colors
- critical = red (#ef4444)
- high = orange (#f97316)
- medium = yellow (#eab308)
- low = blue (#3b82f6)
- info = gray (#6b7280)
- pass = green (#22c55e)

## Build Phases

### Phase 1: Landing Page + Free Security Scan ← START HERE
1. Next.js project setup with Tailwind
2. Landing page (Hero with URL input, How It Works, What We Check, Pricing, FAQ)
3. Supabase tables + RLS
4. Scan API endpoint — accepts URL, runs all security checks
5. Scan results page — score card, findings list (titles only for free)
6. Stripe checkout for $29 unlock
7. Unlocked results view with full details
8. Deploy to Netlify

### Phase 2: Auth + Dashboard + Code Audit
- Supabase auth (login/register)
- Dashboard with scan history
- GitHub OAuth for code audit
- Code audit engine
- PDF report generation
- Badge endpoint

### Phase 3: Monitoring + Subscriptions
- Pro subscription ($49/mo) via Stripe
- Automated weekly rescans (cron)
- Email alerts on score changes
- Score trend charts

## Landing Page Structure
```
[Hero] — "Your AI-built app has security holes. Find them in 60 seconds."
         URL input + "Scan My Site Free →"
         "No login required • Results in 60 seconds • Free forever"

[How It Works] — 3 steps: Enter URL → Get Score → Fix What Matters

[What We Check] — 10-item icon grid

[Sample Report] — Blurred preview with "Unlock Full Report — $29"

[Pricing] — Free vs Pro comparison

[FAQ] — 4-5 common questions

[Footer] — Links, legal, "Part of the ™Stack family by CW Affiliate Investments LLC"
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=https://shieldstack.dev
```

## Key Patterns
- Anonymous scans are critical — no login friction for first scan
- Score + grade is the free hook; detailed fixes are the paid value
- Every scan check module exports: `{ name, title, run(url): CheckResult }`
- CheckResult: `{ severity, title, description, recommendation, codeSnippet }`
- Scan orchestrator runs all checks in parallel, aggregates results, calculates score

## Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

## Notes
- Keep consistent with AdminStack™ code patterns where possible
- Use Zustand for client state
- Toast notifications for user feedback
- Dark theme throughout — security tool aesthetic
- Mobile-responsive (vibe coders browse FB groups on phone)
- Badge SVGs should be small, fast, cacheable
