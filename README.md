# Hubology — Premium Digital Workspace

![Hubology Cover Image](https://res.cloudinary.com/dknmebeee/image/upload/v1783740609/Screenshot_2026-07-11_092858_ill4fc.png)

## Overview & Goal

**Hubology** is a high-fidelity, premium digital workspace designed to serve as an all-in-one ecosystem for entrepreneurs and consultants. The main goal of the project is to provide a unified platform that bridges the gap between emerging business leaders and verified subject-matter experts, whilst offering productivity tools, resource stores, interactive community forums, and crowdfunding features.

Built as a sleek, dark-themed frontend application, Hubology showcases modern React and Next.js architectural patterns, micro-interactions, responsive design, and mock integrations. The workspace is built with distinct separation-of-concern layers, enabling it to be seamlessly wired to a real database, authentication provider, and backend APIs in the future.

---

## 🚀 Key Feature Modules

### 1. Services & Expert Consultant Directory
- **Explore Packages:** A curated grid showing pricing-style service packages across different consulting domains.
- **Dynamic Detail Routing:** Deep-dive pages (`/services/[slug]`) mapping services to specific verified industry experts.
- **Expert Contact Integration:** In compliance with accessibility requirements, logged-in members can directly view a vendor's contact information (phone, email, direct call/email links) on the expert profile cards.

### 2. Interactive E-Commerce Store
- **Digital Products Store (`/store`):** Digital resources, e-books, checklists, and templates to scale startup workflows.
- **Office Supplies Store (`/office-supplies`):** Premium physical supplies, stationery, and technology devices.
- **Cart & Checkout Flow (`/checkout`):** Custom cart state provider with interactive item quantities adjustment, visual state transitions, and a multi-step shipping checkout layout.

### 3. Community Forum (`/forum`)
- **Categorized Spaces:** Startup strategy, marketing, growth, tech, and general discussions.
- **Interactive Discussions:** View posts, upvote threads, write comments, and follow active conversations.

### 4. Membership Plans (`/membership`)
- **Tier Options:** Tiered subscription structures (Starter, Professional, Enterprise) detailing resource access, exclusive workshops, and support levels.

### 5. iFundAyiti Micro-Grant Cohort Platform (`/ifundayiti`)
- **Cohort Tracking:** Dashboard for tracking micro-grant programs, application stats, and available funding resources.
- **Application Flow:** Complete applicant sign-up flow, application search engine by ID, applicant galleries, finalists showcases, and program cohort winners.
- **Crowdfunding Campaigns:** Built-in donation modal logic to support entrepreneurship projects directly.

### 6. Interactive Simulator Settings
- **Demo State Toggler:** A visual toggle HUD positioned at the bottom-left of the screen allowing developers and stakeholders to switch between "Logged In" and "Logged Out" views instantly, verifying component responsiveness to user authentication states.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config leveraging native `@theme` directives)
- **Component Primitives:** [Radix UI](https://www.radix-ui.com/) (Avatar, Dropdown, Select, Slot, Collapsible)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **3D Graphics & Physics:** [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://r3f.docs.pmnd.rs/) and [`@react-three/drei`](https://github.com/pmndrs/drei)
- **Transitions:** Custom `useReveal` intersection-observer hooks for animation performance without heavy third-party motion libraries.

---

## 📐 Project Structure

```
src/
├─ app/                         # App Router Pages & Layouts
│  ├─ services/[slug]/          # Dynamic service detail pages
│  ├─ register/[role]/          # Member and Expert registration routes
│  ├─ ifundayiti/               # iFundAyiti micro-grant cohort space
│  ├─ checkout/                 # Cart checkout screen
│  └─ globals.css               # Design tokens, tailwind v4, & global CSS styles
├─ components/
│  ├─ auth/                     # Simulated authentication contexts & forms
│  ├─ cart/                     # Shopping cart context provider
│  ├─ layout/                   # Navbar, footer, notifications, & site menu shells
│  ├─ sections/                 # Main landing page blocks (hero, testimonials, CTA bands)
│  ├─ services/                 # Cards representing consultants and packages
│  ├─ register/                 # Register workflows (forms for members and experts)
│  └─ ui/                       # Reusable shadcn-like primitives
├─ features/                    # Core modules (Community, iFundAyiti, Store, Booking, etc.)
├─ data/                        # Local Mock Datasets (Services, Memberships, Forums, etc.)
├─ hooks/                       # Custom hooks (e.g. useReveal scroll-reveals)
├─ lib/                         # Helper functions (utils, validators)
└─ types/                       # Shared Domain Types
```

---

## 🎨 Design System

Our theme is configured inside [globals.css](file:///c:/Users/yead1/Downloads/hubology/hubology/src/app/globals.css) and defines a premium, futuristic aesthetic:
- **Palette:** Deep Navy base (`#090B1B`), violet gradients (`#8131F0` to `#4A1C8A`), clear light cloud typography (`#EEF0FB`), and soft mist descriptions (`#9CA3C9`).
- **Signature Style:** Violet **aurora glows**, **glassmorphic** panels with `1px` subtle **gradient-hairline** borders, and modern geometric shadows.
- **Typography:** Display typography uses **Sora** and body uses **Manrope** fetched dynamically via Google Fonts.

---

## 🔌 Wiring a Backend Later

Hubology contains highly isolated seams for easy API integration:
- **Authentication:** Located in [auth-context.tsx](file:///c:/Users/yead1/Downloads/hubology/hubology/src/components/auth/auth-context.tsx). Replace mock users with your backend authentication provider (e.g., NextAuth.js, Clerk, or Supabase).
- **Data Layers:** Located in `src/data/*`. Swap out raw mock imports inside the accessor functions (such as `getServicePackages()` and `getVendorsByService()`) with standard HTTP `fetch` or database queries.
- **Forms & Checkout:** Forms use Zod validation and prepare clean payloads. Point form submit handlers directly to your REST endpoints or server actions.

---

## 📦 Getting Started

Follow these steps to run the application locally:

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
Optimize the app for production deployment:
```bash
npm run build
npm run start
```

> **Note:** The initial build downloads fonts from Google Fonts via `next/font` which requires an active internet connection. Subsequent builds are served locally.
