# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npx convex dev       # Start Convex backend dev server (must run alongside next dev)
```

No test framework is configured yet.

## Architecture

This is a **multi-tenant loyalty rewards platform** built with Next.js 16 (App Router) and Convex as the backend-as-a-service.

### Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript (strict)
- **Convex** for real-time database, backend functions, and auth
- **Tailwind CSS v4** with shadcn/ui (New York style, Radix UI primitives)
- **React Hook Form + Zod** for form handling/validation
- **Stripe** for payments
- **@convex-dev/auth** with Password provider for authentication

### Route Structure

- `src/app/(auth)/` — Sign-in/sign-up pages (public)
- `src/app/(dashboard)/` — Protected portals for 5 roles: `admin`, `merchant`, `agent`, `ambassador`, `partner`
- `middleware.ts` — Auth guard; redirects unauthenticated users to `/sign-in`

### Backend (Convex)

All backend logic lives in `/convex`:
- `schema.ts` — Database tables: users, merchants, stores, agents, ambassadors, partners, customers, transactions, products, bannerAds
- `auth.ts` / `auth.config.ts` — Auth setup (Password provider)
- `http.ts` — HTTP routes

Convex uses TypeScript-first schema definitions with built-in real-time subscriptions. No traditional ORM — queries and mutations are defined as Convex functions.

### Key Patterns

- Path alias: `@/*` maps to `src/*`
- UI components in `src/components/ui/` (shadcn/ui, add via `npx shadcn@latest add <component>`)
- Dashboard components in `src/components/dashboard/`
- `src/lib/navigation.ts` — Portal navigation configs per role
- `src/components/providers.tsx` — ConvexAuthProvider wrapping the app
- User roles are: `admin | merchant | agent | ambassador | partner`

### Environment Variables

Required in `.env.local`:
- `CONVEX_DEPLOYMENT` — Convex deployment identifier
- `NEXT_PUBLIC_CONVEX_URL` — Convex cloud URL
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe keys
