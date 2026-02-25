# Phase 1 Design — Landing Page + Free Security Scan

**Date:** 2026-02-25
**Status:** Approved
**Design Source:** CLAUDE.md (comprehensive spec)

## Scope

Phase 1 delivers: Next.js project setup, landing page, scan API, scan results page, Stripe unlock, and deployment.

## Implementation Order

1. **Project setup** — Next.js 14, Tailwind, TypeScript, Zustand, project structure
2. **Landing page** — Hero, HowItWorks, WhatWeCheck, SampleReport, Pricing, FAQ, Footer
3. **Scan engine** — URL-based security checks (headers, SSL, cookies, secrets, CORS, etc.)
4. **Scan results page** — Score card, findings list, free/paid gating
5. **Stripe integration** — $29 unlock payment flow
6. **Deploy** — Netlify

## Design Decisions

- CLAUDE.md is the single source of truth for all specs
- Dark theme (#0a0f1a background) with green (#22c55e) primary
- Anonymous scans (no login required) are the core UX
- Commit after each major piece for clean git history
