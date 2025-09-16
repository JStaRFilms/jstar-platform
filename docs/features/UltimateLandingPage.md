
# Feature: Ultimate Landing Page

## 1. Purpose

This document outlines the structure and components of the new, feature-rich landing page implemented from the `ultimate_landing.html` mockup. The goal is to provide a comprehensive, engaging overview of the J StaR Films platform, encouraging user interaction and exploration.

## 2. Main Component (`src/app/page.tsx`)

This is the primary container for the new landing page. It imports and renders all the major section components in a specific order to construct the page.

### Structure

The `HomePage` component renders the following sections inside a `<main>` tag:

- `<HeroSection />`
- `<AboutSection />`
- `<ServicesSection />`
- `<PortfolioSection />`
- `<ProcessSection />`
- `<PricingSection />`
- `<TestimonialsSection />`
- `<BlogSection />`
- `<StoreSection />`
- `<ContactSection />`
- `<FinalCTASection />`

## 3. Component Details

All components are located in `src/features/HomePage/components/`.

### `IconComponents.tsx`
- **Purpose:** A collection of all SVG icons used throughout the landing page, exported as individual React components. This centralizes icons and follows project conventions.

### `HeroSection.tsx`
- **Purpose:** Displays the main hero area with a two-slide slideshow, animated backgrounds, headlines, and calls-to-action.
- **Dependencies:** `useSlideshow` hook, `PlayCircleIcon`.

### `AboutSection.tsx`
- **Purpose:** Presents the "About J StaR Films" content, including a team showcase and a list of trusted client logos.
- **Dependencies:** `ShieldCheckIcon`, `CheckIcon`.

### `ServicesSection.tsx`
- **Purpose:** Details the services offered through a series of cards, including main services, additional services, and a CTA block.
- **Dependencies:** Various icon components.

### `PortfolioSection.tsx`
- **Purpose:** A filterable portfolio gallery. It allows users to filter projects by category and view project details in a modal-like lightbox.
- **Dependencies:** `usePortfolioFilter` hook, `PlayCircleIcon`, `ArrowRightIcon`, `CloseIcon`.

### `ProcessSection.tsx`
- **Purpose:** Visually outlines the 5-step creative process using a timeline-style layout.
- **Dependencies:** Various icon components.

### `PricingSection.tsx`
- **Purpose:** Displays a three-tiered pricing table, a feature comparison chart, and a CTA for a consultation.
- **Dependencies:** `CheckCircleIcon`, `CheckIcon`, `ArrowRightIcon`.

### `TestimonialsSection.tsx`
- **Purpose:** Displays client testimonials in a carousel format with navigation arrows, dots, and a call-to-action section.
- **Features:**
  - Carousel displaying 3 testimonials at a time
  - Navigation arrows and dot indicators
  - Hover effects and smooth transitions
  - Responsive design for mobile and desktop
  - Call-to-action section at the bottom
- **Reference Mockup:** `docs/Mockups/01_Public_Website/ultimate_landing.html`

### `BlogSection.tsx`
- **Purpose:** Displays a featured blog post prominently followed by a grid of latest blog posts, offering insights on creativity, technology, and faith, with a link to read more articles.
- **Features:**
  - Featured post with large image layout (left image, right content)
  - Author information with avatar
  - Tag system for content categorization
  - Grid of 3 additional blog posts
  - Hover effects and smooth transitions
  - Responsive design for mobile and desktop
- **Reference Mockup:** `docs/Mockups/01_Public_Website/ultimate_landing.html`

### `StoreSection.tsx`
- **Purpose:** Showcases digital products available for purchase, including a product carousel and a prominent "Free Creator Bundle" lead magnet section.
- **Features:**
  - Product carousel with navigation arrows
  - Individual product cards with images, ratings, and pricing
  - "Free Creator Bundle" section with email capture form
  - Gradient background with decorative elements
  - Responsive design for mobile and desktop
- **Components:**
  - Product showcase carousel
  - Email subscription form for free resources
  - Product preview cards with pricing information
- **Dependencies:** `useProductCarousel` hook, `CheckIcon`, `ArrowRightIcon`.

### `ContactSection.tsx`
- **Purpose:** Provides contact information, a lead generation form for potential clients, and showcases client testimonials.
- **Features:**
  - Contact form with validation (name, email, subject, message fields)
  - Client testimonial card with quote, avatar, and client information
  - Company contact details (email, phone, address, working hours)
  - Glass morphism design with gradient accents
  - Responsive layout with form on left and testimonial/contact info on right
  - Call-to-action for project inquiries

### `FinalCTASection.tsx`
- **Purpose:** The final call-to-action section featuring a glassmorphism card with project consultation options and a free creator resource bundle offer.
- **Features:**
  - Glassmorphism design with backdrop blur effects
  - Email and WhatsApp consultation buttons
  - Free creator resource bundle section with download button
  - Responsive design for mobile and desktop
- **Reference Mockup:** Custom implementation based on provided mockup

## 4. Custom Hooks

All hooks are located in `src/features/HomePage/hooks/`.

### `useSlideshow.ts`
- **Purpose:** Manages the state and automatic progression of the slideshow in the `HeroSection`. It returns the `currentSlide` and a setter function.

### `usePortfolioFilter.ts`
- **Purpose:** Manages the state for the portfolio filter buttons in `PortfolioSection.tsx`. It returns the `activeFilter` and a handler function.

### `useTestimonialCarousel.ts`
- **Purpose:** Manages the state and navigation logic (next, previous, auto-play) for the carousel in `TestimonialsSection.tsx`.

## 5. Usage Example

The `HomePage` component is the default export for `src/app/page.tsx` and is automatically rendered as the application's root page.

```tsx
// src/app/page.tsx
import HeroSection from "@/features/HomePage/components/HeroSection";
import AboutSection from "@/features/HomePage/components/AboutSection";
import ServicesSection from "@/features/HomePage/components/ServicesSection";
import PortfolioSection from "@/features/HomePage/components/PortfolioSection";
import ProcessSection from "@/features/HomePage/components/ProcessSection";
import PricingSection from "@/features/HomePage/components/PricingSection";
import TestimonialsSection from "@/features/HomePage/components/TestimonialsSection";
import BlogSection from "@/features/HomePage/components/BlogSection";
import StoreSection from "@/features/HomePage/components/StoreSection";
import ContactSection from "@/features/HomePage/components/ContactSection";
import FinalCTASection from "@/features/HomePage/components/FinalCTASection";

export default function HomePage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <StoreSection />
      <ContactSection />
      <FinalCTASection />
    </main>
  );
}
```
