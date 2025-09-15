# Styling in this Next.js + Tailwind CSS v4 Project

This guide explains how styling works in this repo (`j-star-platform/`) so you can quickly understand, tweak, and debug styles. It’s written for newcomers, especially if you’re used to Vite + CDN.

---

## What’s in use here

- **Next.js (App Router)** — Pages live in `j-star-platform/src/app/`. The main wrapper is `src/app/layout.tsx`.
- **Tailwind CSS v4** — No `@tailwind base/components/utilities` in a CSS file anymore. We use a single line import: `@import "tailwindcss";`.
- **PostCSS** — Loads Tailwind’s plugin under the hood (`j-star-platform/postcss.config.mjs`).

Relevant files:
- `j-star-platform/src/app/layout.tsx` — imports `./globals.css` and sets global wrappers.
- `j-star-platform/src/app/globals.css` — imports Tailwind and defines custom tokens, animations, and CSS variables.
- `j-star-platform/postcss.config.mjs` — configures Tailwind for PostCSS.
- `j-star-platform/tailwind.config.ts` — minimal in v4; mainly for `content` globs and optional plugins.

---

## How Tailwind v4 is wired in

1. **PostCSS loads Tailwind**
   - `postcss.config.mjs`:
   ```js
   const config = {
     plugins: ["@tailwindcss/postcss"],
   };
   export default config;
   ```

2. **Global CSS imports Tailwind**
   - `src/app/globals.css`:
   ```css
   @import "tailwindcss";
   ```
   That one line brings in Tailwind’s preflight and utilities.

3. **The layout includes global styles once**
   - `src/app/layout.tsx`:
   ```tsx
   import "./globals.css";
   ```
   Because App Router renders all pages through this layout, every page gets Tailwind.

---

## Custom colors with @theme (Tailwind v4)

In v4, you don’t extend colors in `tailwind.config.ts`. You define design tokens in CSS using `@theme`.

- `src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-jstar-blue: #007bff;
  --color-faith-purple: #6f42c1;
  --color-growth-green: #28a745;
}
```

How to use them in components:
- `bg-jstar-blue` → blue background
- `text-faith-purple` → purple text
- `from-growth-green` → gradient start color

Example:
```tsx
<button className="bg-jstar-blue text-white hover:bg-jstar-blue/80 rounded-md px-4 py-2">
  Get Started
</button>
```

Why you saw muted colors earlier:
- We initially put colors in `tailwind.config.ts` (v3 style). In v4, tokens must be defined in CSS with `@theme`. Without that, classes like `bg-jstar-blue` won’t exist.

---

## Global dark mode and base styling

- In `src/app/layout.tsx` we force dark mode:
```tsx
<html lang="en" className="dark">
  <body className="bg-black text-white"> ... </body>
</html>
```
- You can toggle dark mode by adding/removing the `dark` class on `<html>`, then use Tailwind’s `dark:` variants:
```tsx
<p className="text-gray-800 dark:text-gray-200">Hello</p>
```

Custom CSS variables for light/dark are also defined in `globals.css` (under `:root` and `@media (prefers-color-scheme: dark)`), and the `body` uses them for background and text colors. These coexist fine with Tailwind utilities.

---

## Animations

We defined keyframes in `globals.css`:
```css
@keyframes float { /* ... */ }
@keyframes fadeInUp { /* ... */ }

.animate-float { animation: float 3s ease-in-out infinite; }
.animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
```
Use them directly in JSX:
```tsx
<h1 className="animate-fadeInUp">Where Faith Meets Film and Future</h1>
```

---

## Page structure and where styles live

- **Hero and sections** live in `src/features/HomePage/` and subfolders.
- Each component uses Tailwind utility classes in its JSX.
- Example (`src/features/HomePage/components/HeroSection.tsx`):
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-jstar-blue/60 via-faith-purple/50 to-growth-green/40" />
```
Tip: Avoid layering both a low alpha color AND an extra `opacity-*` on the same overlay—stacked transparency can make things look washed out.

---

## Common utility patterns you’ll use a lot

- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`
  - `text-2xl sm:text-4xl lg:text-6xl`
- **State**: `hover:`, `focus:`, `active:`, `disabled:`
  - `hover:bg-jstar-blue/80`
- **Dark mode**: `dark:`
  - `text-gray-700 dark:text-gray-300`
- **Gradients**: `bg-gradient-to-r from-... via-... to-...`
- **Arbitrary values** (when needed): `bg-[rgba(0,0,0,0.3)]`, `shadow-[0_0_10px_#6f42c1]`

---

## Typical problems and how to fix them

1. **Custom color classes not working**
   - Ensure tokens exist in `@theme` inside `globals.css`.
   - Restart dev server after big config changes.

2. **Styles missing on a page**
   - Confirm `layout.tsx` imports `./globals.css`.
   - Make sure your file paths match the `content` globs in `tailwind.config.ts`:
     ```ts
     content: [
       "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
       "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
       "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     ```

3. **Colors look too dull**
   - Remove stacked opacity: prefer a single gradient with per-stop alphas.
   - Try gradient text for headings:
     ```tsx
     <h1 className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green bg-clip-text text-transparent">
       Big colorful headline
     </h1>
     ```

4. **Dark mode doesn’t toggle**
   - We currently force `className="dark"` on `<html>`. Implement a toggle by adding/removing that class on the client.

5. **Coming from Vite + CDN**
   - With CDN you dropped a `<link>` or `<script>` tag. In Next.js, we ship Tailwind via NPM + PostCSS. Don’t add Tailwind CDN; keep it in build pipeline.

---

## Troubleshooting checklist

- Stop and restart the dev server after structural changes:
  ```bash
  npm run dev
  ```
- Hard refresh the browser (Ctrl+Shift+R).
- Verify `@theme` tokens in `globals.css` for any custom colors you reference.
- Check your component file lives under one of the `content` globs.
- Inspect the element in DevTools to see the final class list and computed styles.

---

## Quick recipes

- **Add a new brand color**
  ```css
  /* globals.css */
  @theme { --color-brand-gold: #e6b800; }
  ```
  ```tsx
  <span className="text-brand-gold">Hello</span>
  ```

- **Make a more colorful hero**
  ```tsx
  <div className="absolute inset-0 bg-gradient-to-r from-jstar-blue/60 via-faith-purple/50 to-growth-green/40" />
  ```

- **Gradient headline**
  ```tsx
  <h1 className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green bg-clip-text text-transparent">
    Where Faith Meets Film and Future
  </h1>
  ```

---

## TL;DR

- Tailwind v4 is loaded via `@import "tailwindcss";` in `globals.css`.
- Custom colors are defined via `@theme` in CSS (not in `tailwind.config.ts`).
- `layout.tsx` imports `globals.css` once for the whole app.
- Use Tailwind utility classes in your components. Prefer a single, intentional overlay/gradient to avoid double-opacity.
- If something “just worked” in Vite via CDN, here you should add it via NPM and the build pipeline, not a CDN link.

If you get stuck, open this doc and walk the troubleshooting checklist. Ping me with the file path and a screenshot, and I’ll help you debug fast.
