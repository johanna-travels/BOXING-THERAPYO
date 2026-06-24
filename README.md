# Boxing Game

Astro site with GSAP animations and Playwright e2e tests.

## Workflow (one direction — no back and forth)

```
Component  →  Console  →  Test  →  GitHub
```

| Step | What | Command |
| :--- | :--- | :------ |
| **1. Component** | Add `data-testid` (kebab-case, same as file name) | Edit e.g. `src/components/MyButton.astro` |
| **2. Console** | Verify selector in DevTools on the **same** dev server | `npm run dev` → `http://127.0.0.1:4321/dev/test-lab` → F12 → `$$('[data-testid="my-button"]')` |
| **3. Test** | Playwright reuses that dev server on **4321** (keep Terminal 1 running) | `npm run workflow` |
| **4. GitHub** | Push — CI runs full production build + all tests | `npm run check` then `git push` |

Step 2 and 3 share `http://127.0.0.1:4321`. Keep `npm run dev` running, verify in Console, then run `npm run workflow` — forward only.

Deep dive (LCP, debugging, conventions): **[docs/astro-devtools-playwright-workflow.md](docs/astro-devtools-playwright-workflow.md)**

## Commands

| Command | Step | Action |
| :------ | :--- | :----- |
| `npm install` | setup | Install dependencies |
| `npm run dev` | 2 | Dev server at `http://localhost:4321` |
| `npm run workflow` | 3 | Example component test (after Console) |
| `npm run check` | 4 | All Chromium E2E (CI parity, before push) |
| `npm run build` | — | Production build to `./dist/` |
| `npm run preview` | — | Preview the production build |
| `npm run test:e2e` | — | All Playwright projects (chromium + mobile) |
| `npm run test:e2e:debug` | — | Playwright Inspector |
