# Feature: Homepage Redesign

## 1. Purpose

The homepage has been redesigned to act as a scrollable overview of the site, providing snippets and previews of the main pages to encourage exploration and engagement.

## 2. Main Component (`src/app/page.tsx`)

This is the primary container for the redesigned homepage, importing and rendering various section components.

### Structure

The `HomePage` component renders the following sections in order:

- `<HeroSection />`
- `<AboutSection />`
- `<PortfolioSection />`
- `<ServicesSection />`
- `<StoreSection />`
- `<BlogSection />`
- `<ContactSection />`

## 3. Component Details

### `HeroSection.tsx`
- **Purpose:** Displays the main hero banner with a cinematic background, headline, subtitle, and call-to-action buttons.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/homepage-unified.html`

### `AboutSection.tsx`
- **Purpose:** Provides a concise overview of John Oluleke-Oke, highlighting his roles as a filmmaker, app developer, and AI creator.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/about-enhanced.html`

### `PortfolioSection.tsx`
- **Purpose:** Showcases a few example projects from the portfolio with a call-to-action to view the full portfolio.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/portfolio-advanced.html`

### `ServicesSection.tsx`
- **Purpose:** Highlights the main services offered (Video Production, App Development, AI Creator Tools) with brief descriptions and links to learn more.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/services-comprehensive.html`

### `StoreSection.tsx`
- **Purpose:** Features a few digital products from the store (courses, templates, AI tools) with a call-to-action to visit the full store.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/store-enhanced.html`

### `BlogSection.tsx`
- **Purpose:** Displays the latest blog posts, offering insights on creativity, technology, and faith, with a link to read more articles.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/blog-interface.html`

### `ContactSection.tsx`
- **Purpose:** Presents a call-to-action to get in touch, encouraging users to start a project or view pricing.
- **Reference Mockup:** `docs/Mockups/01_Public_Website/contact-leadgen.html`

## 4. Styling and Responsiveness

- **Tailwind CSS v4:** All styling is implemented using Tailwind CSS utility classes, following the guidelines in `docs/Styling-in-Next-and-Tailwind-v4.md`.
- **Mobile-First:** The design adheres to a mobile-first approach, ensuring optimal viewing and interaction across all device sizes, as detailed in `docs/features/MobileFirstResponsiveDesign.md`.

## 5. Usage Example

The `HomePage` component is the default export for `src/app/page.tsx` and is automatically rendered as the application's root page.

```tsx
// src/app/page.tsx
import HeroSection from "@/features/HomePage/components/HeroSection";
import AboutSection from "@/features/HomePage/components/AboutSection";
import PortfolioSection from "@/features/HomePage/components/PortfolioSection";
import ServicesSection from "@/features/HomePage/components/ServicesSection";
import StoreSection from "@/features/HomePage/components/StoreSection";
import BlogSection from "@/features/HomePage/components/BlogSection";
import ContactSection from "@/features/HomePage/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <StoreSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
```
