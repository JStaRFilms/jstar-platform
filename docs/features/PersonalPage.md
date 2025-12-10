# Feature: Personal Landing Page (/me)

## 1. Purpose

The Personal Landing Page (`/me`) is a high-impact, "epic" profile page designed to showcase John Oluleke-Oke's dual expertise as a Software Engineer and a Creative Director/Video Producer. The core concept is a "Dual Persona" interface that allows visitors to toggle between `ENGINEER` and `CREATOR` modes, dynamically changing the content, theme, and highlighted skills.

## 2. Main Component (`src/app/me/page.tsx`)

This is the entry point for the route. It wraps the entire page in the `PersonaProvider` to manage the global mode state.

### Structure

- `<PersonaProvider>`
  - `<MainContainer>`
    - `<MeHero />` (Includes `<PersonaToggle />`)
    - `<BioSection />`
    - `<StatsRow />`
    - `<SkillsMatrix />`
    - `<FeaturedProjects />`
    - `<TestimonialsCarousel />`
    - `<ContactCTA />`

## 3. Data Architecture

The page relies on a custom hook `usePersonaData` which returns a data object matching the current `mode`.

### Data Sources
- **Engineer Mode:** Content from `docs/portfolio.md` (Tech resume).
- **Creator Mode:** Content from `docs/Yt jobs breakdown-refactor.md` and `docs/portfolio.md` (Creative resume).

## 4. Component Details

### `PersonaContext.tsx`
- **Purpose:** Global state management for `mode` ('ENGINEER' | 'CREATOR').
- **Exports:** `PersonaProvider`, `usePersonaMode`.

### `MeHero.tsx`
- **Purpose:** Full-screen intro.
- **Dynamic:** Headline ("Product-minded Software Engineer" vs "Creative Soul"), Background vibe.

### `PersonaToggle.tsx`
- **Purpose:** The central interaction point. A "sexy" switch to flip between worlds.

### `StatsRow.tsx`
- **Purpose:** High-level social proof.
- **Engineer:** Commits, Projects, Languages.
- **Creator:** Views, Videos, Clients.

### `SkillsMatrix.tsx`
- **Purpose:** Visual breakdown of tools.
- **Engineer:** React, Python, AI.
- **Creator:** DaVinci Resolve, Adobe Suite.

### `FeaturedProjects.tsx`
- **Purpose:** Selected case studies.
- **Engineer:** Apps (Study Game, Storyboard Studio).
- **Creator:** Top videos (Teal & Orange, S10+).

## 5. Implementation Plan

1.  **Blueprint:** Create docs and structure.
2.  **Data:** Implement `usePersonaData` and types.
3.  **State:** Implement `PersonaContext`.
4.  **UI:** Build components iteratively.
5.  **Assemble:** Connect everything in `page.tsx`.
