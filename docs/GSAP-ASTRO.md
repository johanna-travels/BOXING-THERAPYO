# Astro + GSAP — how this project is wired

One-page homepage. GSAP runs in **three layers**. Each layer has **one entry file** your partner can open first.

---

## Load order (what runs when)

```
Browser loads HTML
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Layer 1 — Layout.astro                                      │
│  init-layout.ts → ScrollSmoother, header, nav menu           │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Layer 2 — IntroLoader.astro (fixed, outside smooth scroll)  │
│  intro-loader.ts → word animation → slide up → remove DOM     │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Layer 3 — LandingPage.astro (inside #smooth-content)        │
│  init-landing.ts → hero ScrollTrigger + section scroll reveal │
└──────────────────────────────────────────────────────────────┘
```

**Rule:** Page scripts (Layer 3) wait two `requestAnimationFrame` ticks so ScrollSmoother from Layer 1 can measure `#smooth-content` before ScrollTrigger runs.

---

## DOM tree (where things live)

```
<body>
  IntroLoader          ← Layer 2 (position: fixed — must stay OUTSIDE #smooth-wrapper)
  SiteHeader
  NavMenu
  <main id="smooth-wrapper">          ← ScrollSmoother wrapper
    <div id="smooth-content">         ← ScrollSmoother content (transform applied here)
      <LandingPage>                   ← Layer 3 — homepage sections
        HeroImg
        ServicesSection
        LandingSection × n
      </LandingPage>
    </div>
  </main>
</body>
```

**Why IntroLoader is outside `#smooth-wrapper`:** ScrollSmoother transforms `#smooth-content`. `position: fixed` inside a transformed parent breaks viewport-fixed positioning.

---

## File map — start here

| If you want to… | Open this |
|-----------------|-----------|
| Change intro animation / copy | `src/components/IntroLoader.astro` + `src/data/intro-loader.ts` |
| Change smooth scroll / parallax | `src/scripts/gsap/scroll-smoother.ts` |
| Change header on scroll | `src/scripts/gsap/header-transition.ts` |
| Change nav menu animation | `src/scripts/gsap/nav-menu.ts` |
| Add / reorder homepage sections | `src/components/landing/LandingPage.astro` |
| Change hero image | `src/components/landing/HeroImg.astro` + `src/data/hero.ts` |
| Change services block (do not break parallax hooks) | `src/components/landing/ServicesSection.astro` |
| Change section fade-in on scroll | `src/scripts/gsap/scroll-reveal.ts` |
| Debug "when does GSAP run?" | `init-layout.ts` (global) · `init-landing.ts` (homepage) |

---

## Entry points (only two scripts to remember)

### Layer 1 — every page

**File:** `src/scripts/gsap/init-layout.ts`  
**Called from:** `src/layouts/Layout.astro`

```ts
initScrollSmoother();   // #smooth-wrapper / #smooth-content
initHeaderTransition(); // header color + logo on scroll
initNavMenu();          // open/close menu
```

### Layer 3 — homepage only

**File:** `src/scripts/gsap/init-landing.ts`  
**Called from:** `src/components/landing/LandingPage.astro`

```ts
initHeroImg();        // header mode when hero scrolls away
initScrollReveal();   // [data-reveal] sections fade in
```

Layer 2 is separate: `IntroLoader.astro` calls `bindIntroLoader()` on `window.load`.

---

## "Hooks" — plain explanation (not React)

We call them **hooks** because they are **labels on HTML** that GSAP "grabs onto" later.

Think of it like **sticky notes on furniture before the movers arrive:**

| Sticky note on… | Tells the mover… |
|-----------------|------------------|
| `data-hero-img` on the hero | "When this scrolls away, change the header" |
| `data-speed="0.5"` on text | "Move this slower than the page when scrolling" |
| `data-reveal="up"` on a section | "Fade this in when it enters the screen" |

**You (designer / markup)** stick the note on the element in the `.astro` file.  
**GSAP script (developer)** reads the note and runs the animation.

We split it this way on purpose:

1. **Sections stay simple** — HTML + CSS only. No animation code mixed into layout.
2. **One place for animation logic** — `src/scripts/gsap/`. Easier to debug timing and scroll issues.
3. **Load order stays predictable** — Layout starts ScrollSmoother first; page scripts run after. If every section had its own `<script>`, nobody knows what runs when.

**Not React hooks.** Same word, different thing. Here a hook is just `data-something="..."` on a tag.

Example — you write this in `ServicesSection.astro`:

```html
<p data-speed="0.5">Services</p>
```

ScrollSmoother already runs globally. It scans the page for `data-speed` and applies parallax. **You never touch the GSAP file to add parallax** — only add the attribute.

---

## «Hooks» — εξήγηση στα ελληνικά (όχι React)

Τα λέμε **hooks** επειδή είναι **ετικέτες στο HTML** που το GSAP «πιάνει» αργότερα.

Σκέψου το σαν **χαρτάκια-σημειώσεις πάνω στα έπιπλα πριν έρθουν οι μεταφορείς:**

| Χαρτάκι πάνω σε… | Λέει στον μεταφορέα… |
|------------------|----------------------|
| `data-hero-img` στο hero | «Όταν αυτό φύγει από την οθόνη, άλλαξε το header» |
| `data-speed="0.5"` σε κείμενο | «Κινήσου πιο αργά από τη σελίδα όταν κάνουν scroll» |
| `data-reveal="up"` σε section | «Εμφανίσου με fade όταν μπει στην οθόνη» |

**Εσύ (markup / design)** βάζεις την ετικέτα στο στοιχείο στο `.astro` αρχείο.  
**Το GSAP script (developer)** διαβάζει την ετικέτα και τρέχει το animation.

Γιατί το κάνουμε έτσι:

1. **Τα sections μένουν απλά** — μόνο HTML + CSS. Χωρίς κώδικα animation μέσα στο layout.
2. **Ένα σημείο για animation** — `src/scripts/gsap/`. Πιο εύκολο debug στο scroll.
3. **Προβλέψιμη σειρά φόρτωσης** — πρώτα Layout (ScrollSmoother), μετά η σελίδα. Αν κάθε section είχε δικό του `<script>`, κανείς δεν ξέρει τι τρέχει πότε.

**Δεν είναι React hooks.** Ίδια λέξη, άλλο πράγμα. Εδώ hook = `data-κάτι="..."` πάνω σε ένα tag.

Παράδειγμα — γράφεις στο `ServicesSection.astro`:

```html
<p data-speed="0.5">Services</p>
```

Το ScrollSmoother τρέχει ήδη globally. Ψάχνει `data-speed` και κάνει parallax. **Δεν ανοίγεις GSAP αρχείο για απλό parallax** — μόνο βάζεις το attribute.

**Μία πρόταση:** Τα hooks είναι ετικέτες στο HTML ώστε το GSAP να ξέρει τι να κινήσει — εσύ τα βάζεις στο component, το script κάνει την κίνηση.

---

## Data attributes (the actual hook names)

Sections declare **what** should animate. GSAP modules in `src/scripts/gsap/` read these attributes.

| Attribute | Where | Read by |
|-----------|-------|---------|
| `data-intro-loader` | IntroLoader root | `intro-loader.ts` |
| `data-intro-loader-word` | Each intro word | `intro-loader.ts` |
| `data-hero-img` | Hero section | `hero.ts` |
| `data-speed="0.5"` | Services parallax elements | ScrollSmoother (`effects: true`) |
| `data-reveal="up"` | Landing sections | `scroll-reveal.ts` |

**Pattern:** Astro component = HTML + CSS + optional `data-*` hooks. TypeScript in `src/scripts/gsap/` = animation logic.

---

## Page route (minimal on purpose)

`src/pages/index.astro` is only:

```astro
<Layout title="B.TH">
  <LandingPage />
</Layout>
```

All homepage structure lives in `LandingPage.astro`. That keeps the route file boring and the component tree obvious.

---

## Adding a new animated section

1. Create `src/components/landing/MySection.astro` (markup + styles).
2. Import it in `LandingPage.astro`.
3. Pick a hook:
   - **Parallax:** add `data-speed="0.8"` on the element (ScrollSmoother handles it).
   - **Scroll reveal:** add `data-reveal="up"` on the section root (or extend `scroll-reveal.ts`).
   - **Custom timeline:** add `initMySection()` in `src/scripts/gsap/` and call it from `init-landing.ts`.

Do **not** add a new `<script>` block in the section unless you have a strong reason — it scatters load order and makes debugging harder.

---

## Folder layout

```
src/
  pages/
    index.astro                 ← route only (Layout + LandingPage)
  layouts/
    Layout.astro                ← Layer 1 shell + initLayout()
  components/
    IntroLoader.astro           ← Layer 2 intro
    landing/                    ← homepage sections (Layer 3 markup)
      LandingPage.astro         ← composes sections + initLandingPage()
      HeroImg.astro
      ServicesSection.astro
      LandingSection.astro
  scripts/
    gsap/
      init-layout.ts            ← Layer 1 entry
      init-landing.ts           ← Layer 3 entry
      scroll-smoother.ts
      intro-loader.ts
      header-transition.ts
      nav-menu.ts
      scroll-reveal.ts
      hero.ts
  data/                         ← copy / config (no GSAP)
```

---

## Quick debug checklist

1. **Parallax not moving?** Check `effects: true` in `scroll-smoother.ts` and `data-speed` on the element.
2. **Reveal never shows?** Section needs `data-reveal`; `initLandingPage()` must run after Layout.
3. **Intro stuck on screen?** Check console; `prefers-reduced-motion` skips animation and removes loader immediately.
4. **Header wrong after scroll?** Hero trigger in `hero.ts` — fires when hero bottom hits viewport top.
