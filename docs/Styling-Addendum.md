# Styling Addendum – J StaR Platform (Tailwind CSS v4)

This addendum captures the project-specific Tailwind v4 details for `jstar-platform/`. Use it alongside the universal Tailwind v4 guide in `docs/Styling-in-Next-and-Tailwind-v4.md`.

---

## Project entry points

- **Framework**: Next.js (App Router)
- **Global CSS import**: `src/app/layout.tsx` → `import "./globals.css";`
- **HTML class**: `<html class="dark">` (forced dark mode currently)
- **Dev/build scripts** (`package.json`):
  - `npm run dev` → Next dev (port 5782)
  - `npm run build` → Next build
  - `npm run start` → Next start

---

## Tailwind v4 setup in this project

- **PostCSS**: `postcss.config.mjs` uses `"@tailwindcss/postcss"` (correct for v4)
- **Tailwind config**: `tailwind.config.ts`
  - Currently includes a legacy `content` array and `theme.extend`:
    - `fontFamily`: `Inter`, `Clash Display`
    - `animation`: `bounce`, `pulse`, `spin`
  - `plugins: []`
  - Note: In v4, `content` is not required for utility generation. Keeping it is harmless but optional.

---

## Design tokens (defined in `src/app/globals.css`)

The following tokens are declared via `@theme` and are used throughout:

- Brand tokens: `--color-jstar-blue`, `--color-faith-purple`, `--color-growth-green`, `--color-admin-red`, `--color-sacred-gold`, `--color-primary`, `--color-secondary`, `--color-accent`, `--color-highlight`
- Core v4 tokens (required):
  - `--color-background`
  - `--color-foreground`
  - `--color-border`
  - `--color-ring`
- Dark overrides: defined under `@theme .dark { ... }`
- Base layer applies tokens:
  - `@layer base { * { @apply border-border outline-ring/50 } body { @apply bg-background text-foreground } }`

Usage examples in components:
- `bg-primary`, `text-accent`, `from-primary to-accent` (gradients)
- `bg-background`, `text-foreground`, `border-border`, `outline-ring/50`

---

## Dark mode policy

- Currently forced via `<html class="dark">` in `src/app/layout.tsx`.
- You can toggle dark mode by adding/removing `dark` on `<html>`.
- Tokens are overridden under `@theme .dark`, so utilities adapt automatically.
- Note: `body` also has hard-coded classes (`bg-gray-50 dark:bg-gray-900`) in `layout.tsx`.
  - If you want tokens to fully drive background/text colors, consider removing those explicit `bg-*` classes and rely solely on `@layer base` tokens.

---

## Plugins and UI kits

- `tailwindcss-animate` is installed but not currently activated via CSS.
  - To use: add `@plugin "tailwindcss-animate";` below `@import "tailwindcss";` in `globals.css`.
- `lucide-react` is available for icons.
- `components.json` exists (indicative of shadcn/ui usage). If you add components via shadcn, ensure they align with your token names and dark mode.

---

## Animations in this project

- Custom keyframes and classes declared in `globals.css`:
  - Keyframes: `bounce`, `pulse`, `spin`, `float`, `fadeInUp`, etc.
  - Classes: `.animate-bounce`, `.animate-pulse`, `.animate-spin`, `.animate-fade-in-up`, etc.
- Tailwind config also extends `animation` (bounce/pulse/spin) to map to the same keyframes.
  - Recommendation: Prefer a single source of truth. Either keep animations as CSS classes in `globals.css` (current) or define fully in config—but avoid duplication.
- `src/components/ui/AnimatedIcon.tsx` leverages CSS classes plus `motion/react` for interactive triggers (`hover`, `click`, `load`, `programmatic`). It doesn’t require Tailwind plugins.

---

## File path map (styling-relevant)

- App entry and global styles
  - `src/app/layout.tsx` (imports `./globals.css`, sets `<html class="dark">`)
  - `src/app/globals.css` (Tailwind import, tokens via `@theme`, keyframes, utility classes)
- Tailwind/PostCSS
  - `postcss.config.mjs` (plugin: `"@tailwindcss/postcss"`)
  - `tailwind.config.ts` (minimal config with optional `extend`)
- Components that showcase styling
  - `src/features/HomePage/components/HeroSection.tsx` (gradients, tokens, animations)
  - `src/components/ui/AnimatedIcon.tsx` (animated wrapper, uses CSS classes)
  - `src/lib/utils.ts` (`cn` helper via `clsx` + `tailwind-merge`)

---

## Gotchas and pitfalls

- **Legacy `content` in v4**: Not required. Leaving it is fine but optional. If utilities don’t appear, prefer fixing CSS entry and tokens first.
- **Double-opacity stacking**: Avoid combining low-alpha overlays with separate `opacity-*` utilities. Prefer a single gradient with per-stop alpha.
- **Body classes vs tokens**: If tokens are meant to drive global colors, keep `body` classes minimal to avoid conflicts (`bg-gray-50` vs `bg-background`).
- **Animation duplication**: Either use CSS-defined classes or Tailwind config extension—not both—to keep behavior predictable.
- **Token names in JSX**: Ensure classes like `bg-primary`, `text-accent`, `from-primary` correspond to tokens in `@theme`.

---

## Verification checklist

- **Global import**: `layout.tsx` imports `./globals.css`.
- **PostCSS plugin**: `postcss.config.mjs` has `"@tailwindcss/postcss"`.
- **Core tokens**: `--color-background`, `--color-foreground`, `--color-border`, `--color-ring` are defined.
- **Dark mode**: `<html class="dark">` applied (or toggle implemented). Dark tokens exist.
- **Animations**: Keyframes + classes present in `globals.css` and used in components.
- **No conflicts**: Reduce redundant body classes and duplicated animation sources where possible.
- **Rebuild**: After changes, restart dev server and hard refresh.

---

## Maintenance tips

- Add new brand colors via `@theme` tokens in `globals.css` and reference them via utilities (e.g., `text-brand-gold`).
- If enabling `tailwindcss-animate`, add the CSS plugin directive and consult its class names.
- Keep `tailwind.config.ts` minimal unless you need non-token settings.
- Prefer CSS tokens for theming and keep configuration predictable.
