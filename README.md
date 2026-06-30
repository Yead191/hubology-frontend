# Hubology

A premium, dark-themed business hub that connects entrepreneurs with verified
expert consultants. Built as a **frontend-only** application with mock data —
all auth and content are UI mockups ready to be wired to a real backend later.

![Hubology](public/logo-hubology.svg)

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **shadcn/ui**-style components (New York), hand-built for Tailwind v4
- **react-hook-form** + **zod** for forms and validation
- **lucide-react** for icons
- Scroll reveals via a tiny custom `useReveal` hook — **no animation library**

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
# http://localhost:3000
```

Build for production with `npm run build && npm start`.

> **Note:** the first build downloads the Sora and Manrope fonts from Google
> Fonts via `next/font`, so an internet connection is required for the initial
> build. After that everything is self-hosted.

## What's included

| Route | Description |
| --- | --- |
| `/` | Home — hero, why Hubology, testimonials, CTA |
| `/services` | Service packages grid (pricing-style cards) |
| `/services/[slug]` | Service overview + verified vendor/expert cards |
| `/join` | Choose a path: member or expert |
| `/register/member` | Short member sign-up form |
| `/register/expert` | Full expert application (with photo upload) |
| `/login` | Email/password + Google (UI only) |
| `/store`, `/forum`, `/membership` | Premium "coming soon" placeholders |

## Notes on the two requirements you called out

- **Both navigation states are built.** The app defaults to **logged-in**
  (profile menu + notifications). Use the **"Demo: …" toggle** at the bottom-left
  of the screen to switch to the logged-out state (Login / Join Hub) without
  touching code. Remove `DemoAuthToggle` once real auth is wired.
- **Members see vendor contact info.** On a service detail page, each vendor card
  exposes the expert's phone and email with direct call/email actions, matching
  "members can view the service vendor details along with their contact
  information."

## Project structure

```
src/
├─ app/                 # routes (App Router)
│  ├─ services/[slug]/  # dynamic service detail
│  └─ register/[role]/  # member | expert registration router
├─ components/
│  ├─ layout/           # navbar, footer, logo, menus
│  ├─ sections/         # hero, testimonials, coming-soon, etc.
│  ├─ services/         # package & vendor cards
│  ├─ auth/             # login form, auth shell, auth context
│  ├─ register/         # role cards, member & expert forms
│  └─ ui/               # shadcn-style primitives
├─ data/                # mock data (swap for an API later)
├─ lib/                 # utils + zod validators
├─ hooks/               # useReveal (IntersectionObserver)
└─ types/               # shared domain types
```

## Wiring up a backend later

The seams are intentional and isolated:

- **Data** lives in `src/data/*`. Each file exposes accessor functions
  (`getServicePackages()`, `getVendorsByService()`, …) — replace their bodies
  with `fetch`/DB calls and nothing else changes.
- **Auth** is a single context in `src/components/auth/auth-context.tsx`. Swap it
  for NextAuth/Auth.js; the navbar already reads `isLoggedIn` / `user`.
- **Forms** validate with zod and assemble a `FormData` payload before a
  simulated submit — point them at a real route handler / server action.

## Design system

Defined entirely in `src/app/globals.css` via Tailwind v4 `@theme`:

- Base `#090B1B`, brand gradient `#8131F0 → #4A1C8A`
- Signature look: violet **aurora** glow + **glass** panels with 1px
  **gradient-hairline** borders
- Type: **Sora** (display) + **Manrope** (body)
- Motion respects `prefers-reduced-motion`
