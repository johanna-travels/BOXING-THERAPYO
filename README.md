# Site

Minimal Astro starter with Tailwind, GSAP, and a single-page landing.

## Stack

- Astro
- Tailwind CSS v4
- GSAP (ScrollSmoother, ScrollTrigger)
- Fonts: Oswald (headings), Bebas Neue (body)

## Commands

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build
npm run preview
```

## Astro + GSAP

**Start here with your partner:** [`docs/GSAP-ASTRO.md`](docs/GSAP-ASTRO.md)

Three layers: Layout (global scroll) → IntroLoader (overlay) → LandingPage (homepage sections).

## Structure

```
src/
  pages/index.astro              ← route only: Layout + LandingPage
  layouts/Layout.astro           ← shell, ScrollSmoother, initLayout()
  components/
    IntroLoader.astro            ← intro overlay (Layer 2)
    landing/                     ← homepage sections (Layer 3)
      LandingPage.astro
      HeroSection.astro          ← hero shell (background + LoaderContain)
      HeroBackground.astro
      LoaderContain.astro
      WorkSection.astro
      ServicesSection.astro
      LandingSection.astro
  scripts/gsap/
    init-layout.ts               ← Layer 1 entry
    init-landing.ts              ← Layer 3 entry
    scroll-smoother.ts
    intro-loader.ts
    hero.ts                      ← header scroll hook when leaving hero
    hero-background.ts           ← Layer 0 video/poster (src/scripts/)
    scroll-reveal.ts
    header-transition.ts
    nav-menu.ts
  data/                          ← copy & config
  styles/global.css
docs/
  GSAP-ASTRO.md                  ← full GSAP map for the team
```
