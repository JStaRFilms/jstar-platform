# Feature Spec: Next-Gen Creative Technology Landing Page (V5)

**Status:** Ready for Implementation / Baseline Active in `/v5`  
**Label:** `ready-for-agent`  
**Author:** J StaR Studios / Antigravity Engineering  
**Version:** 1.0.0  

---

## Problem Statement

Visitors landing on the J StaR platform encountered an identity crisis and brand incoherence. The legacy experience suffered from:
1. **Generic Agency Clichés**: Slogans like *"Crafting Exceptional Visual Experiences"* and *"We blend creativity, technology and strategy"* that erased founder personality and made J StaR look like a template AI agency.
2. **Organizational & Metric Inconsistencies**: Artificial corporate hierarchy and conflicting metrics across pages (e.g., claiming 10+ years vs. 6 actual years, 200+ projects vs. 50+ projects vs. 8 verified clients).
3. **Confusing & Fragmented Offerings**: A scattered supermarket of 25+ disconnected services, LUT packs, masterclasses, and pricing tables (₦150k vs. ₦350k vs. ₦1M vs. $197) diluting high-ticket positioning.
4. **Buried Core Moat**: The founder's rare intersection as a filmmaker, software engineer, national speedcubing champion, and saxophonist was buried in an obscure sub-page rather than driving the core brand.

---

## Solution

A ground-up repositioning of J StaR as a **Creative Technology Studio** built on the brand thesis: **"We build things worth watching."**

The new experience establishes:
1. **The 3 Canonical Pillars**: J StaR Films (Cinematic Production), J StaR Labs (Software Architecture & WebGL), and J StaR Intelligence (Autonomous AI Creator Engines).
2. **1:1 Flat Bold Kinetic Hero**: High-impact architectural typography (`Syne Black`), floating glass dock navigation, and clean layout free of metric clutter.
3. **Fused Manifesto & Interactive Disciplines**: Blended thesis statement with fluid mask hover wipes on discipline cards and instant **Time-Travel Deep-Dive Modals** on click.
4. **Interactive Proof of Craft Comparator**: Draggable before-and-after split slider covering Film Color Grading, WebGL Shader Architecture, and AI Video Transcript Synthesis.
5. **Evidence-Based Case Studies**: Highlighting real projects (*Blink*, *Adaptive AI Study Engine*, *Samsung Galaxy Cinema*, *Elizade University*) structured strictly as `// THE PROBLEM` → `// THE BUILD` → `// THE OUTCOME`.
6. **Canonical Metrics Verification**: Single source of truth metrics bar (`176K+ Views Generated`, `280+ Films Produced`, `8+ Verified Partners`, `6+ Years Craft`).
7. **Authentic Architect Section**: Highlighting founder John Oluleke-Oke's polymath credentials with clean high-contrast visual hierarchy.
8. **Dynamic Glitch Text Intake CTA**: Direct commission intake form with cyber-scrambler text decoding animations on hover and interval.
9. **Permanent 5-Color Brand System**: Ink Black (`#001514`), Chartreuse (`#B5E619`), Toffee Brown (`#8E592F`), Powder Blue (`#AFC2D5`), and Moonlight White (`#FBFFFE`).

---

## User Stories

1. As a prospective brand client, I want to immediately understand what J StaR creates from the hero headline, so that I know I am engaging a premium creative technology studio.
2. As a visitor, I want a floating header that remains accessible during scrolling, so that I can quickly jump to different sections or initiate a project commission.
3. As a creative director, I want to explore the 3 studio disciplines (Films, Labs, Intelligence) with clear capability summaries, so that I understand the specific scope of services offered.
4. As an interactive design enthusiast, I want cards to exhibit fluid mask wipes on hover, so that the browsing experience feels tactile and modern.
5. As a prospective client, I want to click any discipline card to open a full-screen time-travel deep dive modal, so that I can read the full capability stack, philosophy, and verified metrics without leaving the page.
6. As a filmmaker or colorist, I want to drag the Proof of Craft slider on the Film Grading mode, so that I can inspect the difference between flat raw camera sensor log and J StaR's anamorphic master color grade.
7. As a technical lead or software client, I want to toggle the Proof of Craft slider to WebGL Architecture mode, so that I can see the wireframe blueprint transform into a live 60fps fluid dynamics shader.
8. As a content creator, I want to toggle the Proof of Craft slider to AI Synthesis mode, so that I can see unstructured raw video transcripts converted into structured high-retention production scripts.
9. As a prospective client evaluating credibility, I want to read structured case studies with Problem, Build, and Outcome breakdowns, so that I can assess verified business results rather than generic claims.
10. As a visitor, I want to inspect canonical metrics in a dedicated verification row, so that I see believable, verified data points regarding total views, edits, and partner relationships.
11. As a visitor, I want to learn about founder John Oluleke-Oke's polymath background, so that I understand why the intersection of software engineering and cinematic direction provides a competitive advantage.
12. As a mobile or desktop user, I want the intake headline to animate with a hacker-style character decoding effect on hover, so that the call to action feels engaging and alive.
13. As a prospective client with a specific project in mind, I want to select my project type (Film, Software, AI) and input my brief directly into a streamlined form, so that I can transmit my inquiry without navigating away.
14. As an applicant submitting a project brief, I want instant confirmation feedback upon form submission, so that I know my brief was received.
15. As a visitor on weaker mobile hardware, I want smooth 60fps scrolling and responsive layout adaptation, so that performance remains high regardless of device.

---

## Implementation Decisions

### Route & Architecture
- **Location**: `src/app/v5/page.tsx` (Next.js 15 App Router client component).
- **Standalone Mockup**: `mockups/concept-4-master-synthesis.html` and `mockups/index.html`.

### Brand Color Tokens
```typescript
const BRAND_COLORS = {
  ink: '#001514',      // Deep Obsidian Green-Black (Primary Canvas Base)
  lime: '#B5E619',     // Electric Lime / Chartreuse (Primary Highlight & Active Accents)
  toffee: '#8E592F',   // Warm Toffee Amber Brown (Cinematic Analog Tone & Borders)
  powder: '#AFC2D5',   // Frosted Powder Blue (Technical Specs, Code, Secondary Badges)
  white: '#FBFFFE',    // Moonlight White (High-Contrast Crisp Typography)
};
```

### Typography Hierarchy
- **Hero Headlines & Subtitles**: `Syne` (900 Black for title, 500 Medium for sub-paragraph).
- **Manifesto, Section Headings & Body**: `Plus Jakarta Sans` (800 Extrabold / 700 Bold / 400 Regular).
- **Emphasized Narrative & Quotes**: `Instrument Serif` (Italic).
- **Technical Badges, Code, Metrics & Form Labels**: `Space Mono`.

### Component State Decisions
- **`activeDeepDive`**: `null | 'films' | 'labs' | 'intelligence'` controls the modal overlay state.
- **`comparatorMode`**: `'color' | 'code' | 'ai'` controls the interactive before/after content state.
- **`sliderPos`**: `number (5 - 95)` stores horizontal slider percentage calculated via pointer coordinates.
- **`scrambledText`**: string driven by a micro-interval decoding random characters `ABCDEF012345!@#$%^&*<>[]{}` into the target phrase.

---

## Testing Decisions

### What Makes a Good Test
- Tests must verify external user behavior and visual interactivity rather than internal variable states.
- Must verify that interactive elements (slider, modals, form submission, text scrambler) respond correctly to pointer events and keyboard triggers.

### Key Verification Checks
1. **Compilation & Typing**: Pass `npx tsc --noEmit` with 0 errors.
2. **Deep Dive Portal Navigation**: Clicking each discipline card must set `activeDeepDive` and display the corresponding domain data; clicking the close button or background must dismiss the modal.
3. **Comparator Slider Bounds**: Dragging must clamp properly between 5% and 95% width without breaking layout overflow.
4. **Responsive Breakpoints**: Layout must adapt seamlessly across Mobile (375px+), Tablet (768px+), and Desktop (1440px+).

---

## Out of Scope

- Integrating live third-party email or CRM delivery (Form currently provides instant client-side transmission confirmation).
- Modifying legacy routes (`/`, `/v2`, `/v3`, `/v4`) until `/v5` receives final migration authorization.
- Video stream hosting integration (Placeholders and SVG poster assets used for performance).

---

## Further Notes

- **Preview Hub**: [`mockups/index.html`](file:///c:/CreativeOS/01_Projects/Code/jstar-platform/mockups/index.html)
- **Direct Route**: [`src/app/v5/page.tsx`](file:///c:/CreativeOS/01_Projects/Code/jstar-platform/src/app/v5/page.tsx)
