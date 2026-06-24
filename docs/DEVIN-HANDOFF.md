# Devin AI Handoff Report — astro-react-app (Boxing Game)

**Date:** 2026-06-24  
**Repo:** https://github.com/johanna-travels/BOXING-THERAPYO  
**Branch:** `main`  
**Owner workflow:** Component → Console → Test → GitHub (one direction, port 4321)

This document explains what was built, how to work in the repo, and what is intentionally unfinished.

---

## 1. Project summary

Astro 6 static site (“Boxing Game”) with:

- Tailwind CSS v4 (`@tailwindcss/vite`)
- GSAP animations (footer bob, page mask)
- Playwright E2E tests + GitHub Actions CI
- Dev sandbox at `/dev/test-lab` for component targeting
- **Not** a React app anymore — React was removed; components are `.astro` only

**Package name:** `floras-cookingmagic` (legacy naming in `package.json`)

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 6.4.7 |
| Styling | Tailwind 4, global CSS in `src/styles/` |
| Fonts | Bebas Neue + Oswald via `@fontsource` |
| Animation | GSAP 3; ScrollTrigger in `plugins.ts`; Draggable/Flip inline in ContactSection |
| E2E | Playwright 1.61, Chromium only in CI |
| Node | `>=22.12.0` |

---

## 3. Dev server rules (critical)

Configured in `astro.config.mjs`:

```js
server: { host: '127.0.0.1', port: 4321, strictPort: true }
preview: { host: '127.0.0.1', port: 4321, strictPort: true }
```

- **Always** use `http://127.0.0.1:4321` — not `localhost:4322`
- Console debugging and Playwright must share the same server
- If port stuck: `npm run dev:reset`

Playwright local config reuses `npm run dev`; CI runs `build + preview` on 4321.

---

## 4. Workflow philosophy

### Primary dev loop (human)

1. Add `data-testid` (kebab-case, match file name) on testable elements
2. Mount component on `src/pages/dev/test-lab.astro`
3. `npm run dev` → open `/dev/test-lab` → F12 Console → verify selectors
4. Optional: `npm run workflow` or `npm run workflow:footer` (Playwright)

### Automation loop (CI / “after 1 month”)

- `npm run check` before push
- GitHub Actions `.github/workflows/e2e.yml` runs `npm run check` on push/PR
- Playwright catches **runtime** regressions Astro build cannot see (wrong href, missing DOM, text changes)

### Astro vs Playwright

| Astro `build` | Playwright |
|---------------|------------|
| Compile errors, broken imports | Browser loads page, checks DOM |
| Does **not** verify hrefs/text/visibility | Verifies `data-testid`, text, attributes |

### Console vs Playwright

- **Console:** JavaScript on live page — `$$('[data-testid="..."]')`
- **Playwright:** TypeScript in Terminal — `page.getByTestId('...')`
- **Never paste `.spec.ts` files into browser Console**

Chrome paste guard: type `allow pasting` once per tab.

**Cheatsheet:** `workflow-commands.txt` (project root)

---

## 5. Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/index.astro` | Production homepage — hero, slider, `SiteFooter` |
| `/dev/test-lab` | `src/pages/dev/test-lab.astro` | **Sandbox** — MyButton + Footer CTAs; not linked from homepage |
| `/dev/contact-hero` | `src/pages/dev/contact-hero.astro` | Mobile LCP hero reference page |

---

## 6. Components built / in use

### Test sandbox (`test-lab.astro`)

| Component | File | `data-testid` |
|-----------|------|----------------|
| MyButton | `src/components/MyButton.astro` | `my-button` |
| Footer CTAs | `src/components/sections/footer-ctas-wrapper.astro` | `footer-ctas-wrapper`, `footer-ctas-phone-link`, `footer-ctas-phone-text`, `footer-ctas-donate-link` |

### Production homepage

| Piece | File | Markers |
|-------|------|---------|
| Layout | `src/layouts/Layout.astro` | HTML shell, optional LCP preload |
| PageMask | `src/components/PageMask.astro` | `data-page-mask` |
| BreathingSection | `src/components/BreathingSection.astro` | layout wrapper |
| SliderSection | `src/components/sections/SliderSection.astro` | `data-slider-section` |
| SiteFooter | `src/components/SiteFooter.astro` | `data-site-footer`, `data-footer-bob` |
| Footer contacts | `footer-contacts-wrapper.astro` | class-based, no testid yet |
| Newsletter, legal, contact wrappers | `sections/*` | legacy section wrappers |

### Contact / hero (dev + patterns)

- `ContactHero.astro` — LCP `<img>` with `data-testid="contact-hero-lcp"`, eager + fetchpriority high
- `Contact.astro`, `ContactSection.astro`, `SocialIconLink.astro`

### Site data

- `src/data/site.ts` — name, tagline, CTA, footer label
- `src/data/hero.ts` — hero image URLs

---

## 7. Footer CTAs (today’s feature)

**Component:** `src/components/sections/footer-ctas-wrapper.astro`

Markup (production intent):

- Grey block `bg-[#282828]`, phone `tel:01172338700`, display `0117 233 8700`
- Info text: “Call for all enquiries (Mon to Fri, 10am to 5pm)”
- Donate link (`href="#"` default, prop-overridable)

**Only on test-lab today** — NOT yet in `SiteFooter.astro`.

To ship to production: import and add `<FooterCtasWrapper />` inside `SiteFooter.astro`.

### Console verification (copy-paste block)

```js
$$('[data-testid="footer-ctas-wrapper"]')
$$('[data-testid="footer-ctas-phone-link"]')
document.querySelector('[data-testid="footer-ctas-phone-link"]').href
document.querySelector('[data-testid="footer-ctas-phone-link"]').textContent.trim()
document.querySelector('[data-testid="footer-ctas-phone-text"]').textContent.trim()
document.querySelector('[data-testid="footer-ctas-donate-link"]').textContent.trim()
```

Expected: `Array(1)` for wrappers, `tel:01172338700`, correct text strings.

**Do not confuse with** homepage `<footer data-site-footer>` — different component.

---

## 8. Playwright tests

| File | What it tests |
|------|----------------|
| `tests/example.spec.ts` | MyButton on `/dev/test-lab` |
| `tests/footer-ctas.spec.ts` | Footer CTAs on `/dev/test-lab` |
| `tests/overview.spec.ts` | Homepage sections, screenshots |
| `tests/contact-hero.spec.ts` | LCP image eager/high-priority |

### npm scripts

```bash
npm run workflow          # MyButton only
npm run workflow:footer   # Footer CTAs only
npm run check             # All chromium tests (CI parity)
npm run workflow:clean    # rm test-results, playwright-report
npm run workflow:show     # HTML report
```

Headed/UI modes exist (`workflow:headed`, `workflow:ui`) — optional; headless `workflow` / `workflow:footer` is the reliable path.

`PW_WATCH=1` + `page.pause()` in `example.spec.ts` keeps browser open in headed/debug.

---

## 9. `data-testid` conventions

| Pattern | Usage |
|---------|--------|
| `data-testid="kebab-case"` | New components — Playwright `getByTestId()` |
| `data-slider-section`, `data-site-footer` | Legacy homepage markers — migrate to `data-testid` when touching |
| File `footer-ctas-wrapper.astro` → `footer-ctas-wrapper` | Consistent naming |

**Rule:** One test id per logical target. Console `$$('[data-testid="x"]')` must return `Array(1)`.

---

## 10. GSAP layer (for agents)

### Architecture — two styles in this repo

| Style | Where | Status |
|-------|-------|--------|
| **Clean** | `src/scripts/gsap/footer-bob.ts` | Logic extracted; init from `SiteFooter.astro` |
| **Inline** | `ContactSection.astro` `<script>` (~120 lines) | Draggable + Flip carousel — **tech debt**; extract when touching |

**Plugin registration:**

- `src/lib/gsap/plugins.ts` — `registerGsapPlugins()` registers ScrollTrigger once (used by footer-bob)
- `ContactSection.astro` registers Draggable, InertiaPlugin, Flip inline — do not duplicate; consolidate when refactoring

### Footer bob (`initFooterBob`)

- **Marker:** `[data-footer-bob]` on `<footer>` in `SiteFooter.astro`
- **Selector export:** `FOOTER_BOB_SELECTOR` in `footer-bob.ts`
- **Behavior:** Vertical bounce tween; ScrollTrigger toggles play/pause when footer is in viewport
- **Options:** `jump` (px, default 120), `duration` (s, default 0.9)
- **Silent no-op** if footer not in DOM (safe on pages without SiteFooter)

### Contact section carousel (not on homepage today)

- **Marker:** `[data-contact-section]`
- **Only on** pages that mount `ContactSection.astro` (not `index.astro`)
- Uses Flip + Draggable horizontal snap carousel
- **Do not init twice** — script runs once per mounted section

### GSAP debugging (Console on live page)

```js
// Footer bob — is marker present?
document.querySelector('[data-footer-bob]')

// ScrollTrigger instances (GSAP 3)
window.ScrollTrigger?.getAll().map((t) => ({
  trigger: t.trigger,
  start: t.start,
  isActive: t.isActive,
}))

// Active tweens
gsap.globalTimeline.getChildren().length
```

**Performance tab:** record load → check long tasks from GSAP/ScrollTrigger on scroll.

**If animation “does nothing”:**

1. Confirm marker exists in DOM (`data-footer-bob` only on homepage footer)
2. Footer must scroll into view — bob is ScrollTrigger-gated
3. Check Console for GSAP import errors
4. `test-lab` has **no** footer bob — bob only runs where `SiteFooter` is mounted

### Adding new GSAP (agent rules)

1. Put logic in `src/scripts/gsap/<name>.ts` (not 100-line inline scripts)
2. Export selector constant matching `data-*` marker in Astro
3. Register plugins via `registerGsapPlugins()` or extend `plugins.ts`
4. Call `init…()` from component `<script>` only
5. GSAP is **not** covered by test-lab Playwright tests unless you mount that component on test-lab

---

## 10b. Code health audit (not spaghetti — but uneven)

### ✅ Clean / good patterns

- **Layers separated:** `layouts/`, `components/`, `sections/`, `data/`, `scripts/gsap/`, `styles/`
- **Footer bob:** small module, documented, single responsibility
- **Test lab:** isolated sandbox; production homepage untouched
- **New components:** `data-testid` + props with defaults (`footer-ctas-wrapper`, `MyButton`)
- **Playwright:** one spec per feature area; not one giant file
- **CI:** single workflow, `npm run check`

### ⚠️ Tech debt (fix when you touch the file)

| Issue | Location | Fix later |
|-------|----------|-----------|
| Two marker systems | `data-testid` vs `data-site-footer`, `data-slider-section` | Migrate legacy to `data-testid` gradually |
| Inline GSAP monster | `ContactSection.astro` | Move to `src/scripts/gsap/contact-carousel.ts` |
| Naming typo | `wraper-contact.astro` | Rename to `wrapper-contact.astro` when safe |
| Footer CTAs not shipped | Only on test-lab | Add to `SiteFooter` when ready |
| `overview.spec.ts` slider test | Was stale (8 imgs) | **Fixed** — now expects 5 `.slider__slide` backgrounds |
| `ContactSection` unused on homepage | `index.astro` | Dead code path until mounted |
| `BackgroundLayer.astro` | Has testids | Not mounted anywhere yet |

### 🍝 Not spaghetti

Structure is **modular enough for solo dev**. Debt is **localized** (one big ContactSection script, mixed markers) — not whole-repo tangle.

---

## 10c. Test + Console — do we need both?

| Layer | Required? | Role |
|-------|-----------|------|
| **Console** on `/dev/test-lab` | **Yes** for daily dev | Instant DOM/href/text check |
| **Playwright** | **Optional daily; yes before push/CI** | Regression robot |
| **Astro `build`** | **Yes before deploy** | Compile/import errors only |

**Console alone is enough** while building. **Playwright + CI** catch silent breaks (wrong href, removed component).

**Do not paste `.spec.ts` into Console** — different runtime.

---

## 10d. Debugging layers (quick map)

| Problem | Tool |
|---------|------|
| Wrong/missing element | Console `$$('[data-testid="…"]')` on test-lab |
| Wrong page | URL must be `/dev/test-lab` not `/` |
| Port mismatch | `127.0.0.1:4321` only; `npm run dev:reset` |
| GSAP not animating | Check marker in DOM; ScrollTrigger tab; homepage footer only for bob |
| LCP / performance | Performance tab; see `docs/astro-devtools-playwright-workflow.md` §5 |
| Test failed after push | `npm run workflow:show` or `npx playwright show-trace test-results/.../trace.zip` |
| Build fails | Terminal `npm run build` — read Astro error |

---

## 10e. What was built in this workflow session

1. Playwright pipeline: `playwright.config.ts`, port 4321 `strictPort`, dev server reuse
2. npm scripts: `workflow`, `workflow:footer`, `check`, `dev:reset`, `workflow:clean`
3. GitHub Actions E2E on push
4. `MyButton` + `footer-ctas-wrapper` with full `data-testid` set
5. `/dev/test-lab` sandbox
6. `workflow-commands.txt` human cheatsheet
7. `docs/DEVIN-HANDOFF.md` (this file)
8. `docs/astro-devtools-playwright-workflow.md`
9. Pushed to `johanna-travels/BOXING-THERAPYO`

---

## 11. Git / CI

- Remote: `origin` → `https://github.com/johanna-travels/BOXING-THERAPYO.git`
- Key commit: Playwright workflow + port 4321 locking + site components
- CI: Ubuntu, Node 22, `npm ci`, Playwright Chromium, `npm run check`

---

## 12. Not in repo / not done (do not assume)

| Item | Status |
|------|--------|
| `supabase/` migration | Untracked — email list, not wired |
| `.env.example` | Untracked — Supabase/Resend placeholders |
| `src/types/email-list.ts` | Untracked — unused |
| Footer CTAs on production footer | Not mounted in `SiteFooter` yet |
| React | Removed — do not re-add without explicit request |
| Playwright headed/UI | Works inconsistently; headless tests are source of truth |

---

## 13. How to add a new component (for Devin)

1. Create `src/components/YourThing.astro` with `data-testid="your-thing"`
2. Add to `src/pages/dev/test-lab.astro`
3. Console: `$$('[data-testid="your-thing"]')` → must be `Array(1)`
4. Create `tests/your-thing.spec.ts` OR extend existing spec
5. `npm run check`
6. When ready for production, mount on real page (e.g. `SiteFooter`, `index.astro`)

Test file organization: **not** strictly one file per component — group by feature/page as needed.

---

## 14. Key files map

```
astro.config.mjs          # port 4321 strict, Tailwind vite plugin
playwright.config.ts      # baseURL, webServer dev vs CI
workflow-commands.txt     # human cheatsheet (Console blocks)
docs/astro-devtools-playwright-workflow.md  # extended workflow + LCP notes
.github/workflows/e2e.yml # CI
src/pages/dev/test-lab.astro                # dev sandbox
src/components/sections/footer-ctas-wrapper.astro
tests/footer-ctas.spec.ts
```

---

## 15. Owner preferences

- Linear workflow — no bouncing between dev ports or rebuild loops
- Console is primary debugger; Playwright is regression insurance
- Minimal scope — don’t add unrelated abstractions
- `data-testid` on test-lab before production mount
- Commits only when asked; push to `main` on `johanna-travels/BOXING-THERAPYO`

---

## 16. Quick start (copy for Devin)

```bash
npm install
npx playwright install chromium
npm run dev
# Browser: http://127.0.0.1:4321/dev/test-lab
npm run workflow:footer   # verify footer CTAs
npm run check             # full suite
npm run build             # astro compile check
```

**End of handoff.**
