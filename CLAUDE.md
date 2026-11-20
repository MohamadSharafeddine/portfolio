# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server with Turbopack at http://localhost:3000
- `npm run build` — production build (also the main type-check; there is no separate `tsc` script)
- `npm run start` — serve the production build
- `npm run lint` — ESLint CLI (`eslint .`, flat config in `eslint.config.mjs` extending `next/core-web-vitals` + `next/typescript`; `next lint` is deprecated)

There is no test suite. `next dev` writes to `.next-dev` and `next build` to `.next` (set by phase in `next.config.ts`), so building while the dev server runs is safe. When they shared `.next`, a build broke the running dev server (500s, `ENOENT ... app-build-manifest.json`). If `next build` ever crashes in webpack with `WasmHash ... reading 'length'`, delete `.next` and rebuild.

## Architecture

Single-page personal portfolio: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4 (via `@tailwindcss/postcss`, configured in CSS — there is no `tailwind.config`). Deployed on Netlify (its Next.js runtime is detected automatically, with no `netlify.toml`; `next/image` goes through Netlify's image CDN). `images.qualities` in `next.config.ts` must list every `quality` used by `next/image`.

The design direction is **black chrome and brushed silver, AI-first**. The owner positions as an AI engineer (agentic workflows, LLM pipelines) who also builds full-stack and 3D software. Decoration speaks the language of models and code: a logo that "generates" step by step, an attention map, a commit graph, an agent terminal. Keep 3D printing as content (it's in the experience), not as the theme.

- `src/app/layout.tsx` loads Geist + Geist Mono, sets the theme before paint, and renders `Navbar` / `Footer` around the page.
- `src/app/page.tsx` renders `Hero`, then About → Experience → Skills → Projects → Contact inside `Reveal`. Each section uses `Section` (`id`, `layer` = section number, `title`, optional `comment` rendered as a `// code comment` on the index rule). Section ids must match the anchors in `Navbar.tsx`'s `navItems`.
- Content is hardcoded as arrays at the top of each section component. Project images live in `public/projects/`; each project in `Projects.tsx` passes an `overlay` element (from `src/components/decor/`) that `ProjectCard` renders over the screenshot.

### Hero and 3D

- The hero is always black (`data-theme="dark"` on the section, see Theming). The monogram canvas and the transparent portrait (`public/Personal-Image.png`) share one **figure** box (4:3, sized by viewport height), so the logo stays locked behind the head and shoulders at any screen size. On phones the figure sits at the top, poster style, and the copy starts on a fade over the chest. On `lg` it stands on the floor, centered on the right column. `FIGURE_DESKTOP` / `FIGURE_PHONE` in `Hero.tsx` hold the framing, picked with a `matchMedia` on the `lg` breakpoint.
- `components/three/ChromeLogo.tsx` is a plain three.js scene (no react-three-fiber), loaded with `next/dynamic` + `ssr: false`. It extrudes the MS logo from `src/lib/logoPath.ts` (an SVG path traced from `public/logo.png` with potrace) in polished chrome and builds it up with two world-space clipping planes: chrome below the cut, a BackSide mesh that shows as the bright cross-section, and ghost edges above. The readout (status, step, percent, bar) is plain DOM updated through refs.
  - Framing is passed as `wide` / `tall` `Framing` objects (logo center as fractions of the canvas, height `fill`, width cap `maxW`), and the camera pans to place it. Keep them as module-level constants: they are effect dependencies, and a new object rebuilds the scene.
  - The SVG is y-down, so the geometry is scaled by `(s, -s, -s)`: flipping two axes is a rotation. Flipping only y inverts face winding, and the logo renders as the flat cap color.
  - Load order matters for smoothness. `Hero` mounts `ChromeLogo` only after the intro (~1.7s), on `requestIdleCallback`. Setup yields to the browser between phases (renderer, reflection map, geometry, materials), uses `compileAsync` for shaders, and calls `onReady` after the first frame, at which point `Hero` fades in the stage and readout (`[data-hero-item='stage'|'hud']`). Mounting it during the intro froze the animation for ~600ms on phones.
  - Phones (≤767px) get lighter geometry and a 128px reflection map. Framing switches between `wide`/`tall` via the `media` prop on resize, without rebuilding the scene.
  - Rendering pauses when offscreen or the tab is hidden. The pixel ratio is capped at 1.5x and ~2.4 MP per frame. Reduced motion renders one finished frame.
- `components/decor/`: `AttentionMap` (About: an attention head from psychology tokens to engineering tokens. It autoplays one query at a time, and a header readout shows `▸ auto` / `● exploring`. Mouse hover holds a token until the pointer leaves (resume after 1.6s). Taps, clicks and keyboard focus hold it for 3s, restarted per interaction. On touch, focus and click fire *after* pointerleave, so resuming must not depend on leave events. A query shows its row, a key its column. The edge gradient must stay `userSpaceOnUse`, because same-row edges are horizontal and a bounding-box gradient paints nothing on them), `PoseOverlay` (JumpCade), `RadarOverlay` (CognifyEdu) and `FlameOverlay` (Red Flame & Blue Flame). Project overlays use `translateZ` inside the `preserve-3d` stage of `ProjectCard`, which tilts toward the pointer, so their roots must keep `[transform-style:preserve-3d]`. Project overlays keep their own colors because they belong to the project.
- Skills renders an exploded CSS-3D stack of plates ("model layers"). GSAP scrubs the `--gap` CSS variable and the stage rotation, and the active category lifts its plate.

### Theming and design tokens

- The theme follows the device (`prefers-color-scheme`) unless the visitor presses the toggle. Only the toggle writes `localStorage["theme-choice"]`, and toggling back to the device's own mode removes it, so the site follows the device again. The inline script in `layout.tsx` sets `data-theme` before first paint, and `ThemeContext` follows device changes live while no choice is saved. The legacy `theme` key, which an old version wrote on every visit, is deleted and ignored. The light theme is "brushed aluminum".
- `src/app/globals.css` defines the ramps as CSS variables under `:root` and `[data-theme="dark"]`, mapped into Tailwind with `@theme inline`. Use the token classes (`bg-bg`, `bg-surface`, `bg-raised`, `border-line`, `text-fg` / `text-fg-2` / `text-fg-3`, `bg-accent`, `text-accent-ink`). The accent is silver in dark and gunmetal in light.
- **Scoped dark:** `data-theme="dark"` on any element switches every token (and the `dark:` variant) inside it. The hero, the navbar while it's over the hero, the attention-map card and the contact terminal use this to stay black in the light theme. Prefer this over hardcoded colors.
- `site-dark:` (defined in `globals.css`) matches only the `<html>` theme. Use it for UI that must show the site theme inside a scoped-dark area, e.g. the theme toggle icon in the navbar over the hero.
- `.btn-metal` (brushed-metal primary button, silver on dark, gunmetal on light) and `.chrome-text` (the hero name only) live in `globals.css`.

### Motion

Looping decorative animations must run only while visible: pass them to `pauseOffscreen(trigger, animations)` from `src/lib/pauseOffscreen.ts` inside `useGSAP`.


GSAP via `@gsap/react` (`useGSAP` with a `scope` ref; `contextSafe` for event handlers). Every animation is registered inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`, with a static fallback where needed.
- `Hero`: the name slides up line by line from masked spans (`overflow-y-clip` keeps the line mask without clipping wide names). The portrait rises out of the dark, and the other `[data-hero-item]` elements fade in. They start `visibility: hidden` in CSS (with a `<noscript>` override in the layout). After a hot reload the hero can stay hidden, so do a full reload.
- `Reveal`: `ScrollTrigger.batch` fades in `[data-reveal]` elements that start below the fold, once.
- Experience scrubs the commit-graph line and the HEAD marker with scroll, and toggles `.is-reached` on each role (styled via `group-[.is-reached]:`).

### Checking visuals

Chrome throttles `requestAnimationFrame` (down to ~1 fps) when its window is covered, and GSAP's lag smoothing then makes intros look frozen. For screenshots, a headless Playwright run (SwiftShader) gives real timing.

## Agent skills

`.claude/skills/` links to the skills in `.agents/skills/` (installed via `skills-lock.json`): `frontend-design` and the GSAP skills.
