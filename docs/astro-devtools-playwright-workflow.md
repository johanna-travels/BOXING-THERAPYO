# Astro + DevTools + Playwright Workflow

```
Component  →  Console  →  Test  →  GitHub
```

One direction. Same URL and dev server for steps 2 and 3. No rebuild between Console and Playwright.

| Step | You do | Command |
| :--- | :--- | :------ |
| 1 | Write component + `data-testid` | edit `src/components/MyButton.astro` |
| 2 | DevTools selector check | `npm run dev` → `/dev/test-lab` → Console |
| 3 | Automate what you verified | `npm run workflow` |
| 4 | Push when green | `npm run check` → `git push` (CI runs `check`) |

---

## 1. Component setup (`data-testid`)

Every testable component gets a `data-testid` in **kebab-case**, matching the file name.

Example: `src/components/MyButton.astro` → `data-testid="my-button"`

```astro
---
const { label = 'Υποβολή' } = Astro.props;
---
<button
  data-testid="my-button"
  type="button"
  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
>
  {label}
</button>
```

Try it on the sandbox page: [http://localhost:4321/dev/test-lab](http://localhost:4321/dev/test-lab)

---

## 2. Live testing — DevTools console (F12)

Start the dev server, open the page, press **F12**, go to **Console**, and run:

**Check the test id is unique (must return one element):**

```js
$$('[data-testid="my-button"]')
```

**Target by visible button text (DevTools — not Playwright syntax):**

```js
Array.from(document.querySelectorAll('button')).filter(
  (el) => el.textContent?.trim() === 'Υποβολή',
)
```

**Target nested elements (e.g. button inside a section):**

```js
$$('[data-testid="hero-section"] button')
```

> `:has-text()` is Playwright-only. In DevTools use the filter pattern above or XPath.

---

## 3. Quick debugging — find the exact line in Issues

When Performance (FCP/LCP) or console warnings appear:

### Issues / Console tab

1. Expand the error (arrow on the left)
2. Click **Affected Resources**
3. Click the line link (e.g. `main.js:25`) — jumps straight to the source

### Network tab (heavy LCP assets / scripts)

1. Right-click column headers → enable **Initiator**
2. Hover the Initiator link for the call stack
3. Click the top frame to open the originating file

---

## 4. Playwright automation

Because the component and DevTools selectors are verified first, the test is short and stable.

Example: `tests/example.spec.ts`

```ts
import { expect, test } from '@playwright/test';

test('MyButton test-id workflow works instantly', async ({ page }) => {
  await page.goto('/dev/test-lab');

  const button = page.getByTestId('my-button');

  await expect(button).toBeVisible();

  // await page.pause(); // Inspector + live DevTools

  await button.click();
});
```

### Commands (linear)

| Step | Command | Server |
| :--- | :------ | :----- |
| 2 Console | `npm run dev` | dev (`127.0.0.1:4321`) |
| 3 Test | `npm run workflow` | same dev server (reused) |
| 4 GitHub | `npm run check` then `git push` | CI: build + preview |

Playwright `baseURL` is `http://127.0.0.1:4321`. Use relative paths: `page.goto('/dev/test-lab')`.

Locally, Playwright starts or reuses `npm run dev`. On GitHub Actions, it runs `build` + `preview` first.

---

## Conventions in this repo

| Pattern | Usage |
| :------ | :---- |
| `data-testid="my-button"` | New components — Playwright `getByTestId()` |
| `data-slider-section`, etc. | Legacy section markers — migrate to `data-testid` when touching a file |
| `/dev/test-lab` | Sandbox route for component experiments (not linked from the homepage) |
| `/dev/contact-hero` | Mobile LCP hero reference (voyaflair.com pattern, optimized) |

---

## 5. Mobile LCP performance (voyaflair.com case study)

Trace analysis on [voyaflair.com](https://voyaflair.com/) showed three mobile bottlenecks. Use this checklist when a hero image is the LCP element.

### Problem → fix

| Issue on production | Why it hurts mobile | Fix in this repo |
| :------------------ | :------------------ | :--------------- |
| `background-image` on `.contact-hero` | Browser cannot mark CSS backgrounds as LCP or assign fetch priority | Real `<img>` in `ContactHero.astro` with `data-testid="contact-hero-lcp"` |
| `loading="lazy"` on hero | Download starts late after layout | `loading="eager"` + `fetchpriority="high"` |
| No preload hint | Image competes with JS/CSS on slow networks | `<link rel="preload" as="image">` via `Layout` `preloadLcpImage` prop |
| GTM long task (~26 ms desktop → 100–150 ms mobile) | Main-thread jank blocks paint | Defer third-party tags; load analytics after `load` or use `partytown` |
| Layout recalc at startup (~11 ms) | Multiplies on low-end CPUs | Reserve hero dimensions with `width`/`height`; avoid DOM reads in inline scripts |

### DevTools — verify LCP element

1. F12 → **Performance** → record page load (enable **CPU 4× slowdown** + mobile device)
2. Find **LCP** marker in the timeline
3. Confirm the LCP node is `img[data-testid="contact-hero-lcp"]`, not a div with `background-image`

Console check:

```js
const img = document.querySelector('[data-testid="contact-hero-lcp"]');
({
  loading: img?.loading,
  fetchPriority: img?.fetchPriority,
  complete: img?.complete,
});
```

### Playwright guard

`tests/contact-hero.spec.ts` asserts the LCP image never regresses to lazy loading:

```bash
npm run test:contact-hero
```

### Port to voyaflair.com

Replace the mobile hero block:

```html
<!-- Before: CSS background (not LCP-discoverable) -->
<div class="contact-hero ..." style="background-image: url('...')">

<!-- After: discoverable LCP img -->
<div class="contact-hero ...">
  <img src="..." width="1800" height="1013" fetchpriority="high" loading="eager" decoding="async" class="absolute inset-0 h-full w-full object-cover" alt="" />
```

Add in `<head>`:

```html
<link rel="preload" as="image" href="HERO_URL" fetchpriority="high" />
```
