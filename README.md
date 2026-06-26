# Site

Minimal Astro starter with Tailwind, Barba.js, and GSAP.

## Stack

- Astro
- Tailwind CSS v4
- Barba.js (`@barba/core`)
- GSAP
- Fonts: Oswald (headings), Bebas Neue (body)

## Commands

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build
npm run preview
```

## Structure

```
src/
  components/PageTransition.astro   # Barba curtain overlay
  layouts/Layout.astro              # Barba wrapper + container
  pages/index.astro                 # Home
  pages/about.astro                 # Second page (test transitions)
  scripts/barba/                    # init + GSAP transitions
  styles/global.css                 # Tailwind + fonts
  styles/fonts.css
```
