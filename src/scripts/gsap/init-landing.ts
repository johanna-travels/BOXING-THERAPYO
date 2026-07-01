/**
 * Layer 3 — Homepage (LandingPage.astro)
 * scroll-reveal: section fade-ins. hero.ts: header mode when leaving hero (not hero animation).
 */
import { initHeroImg } from '@/scripts/gsap/hero';
import { initScrollReveal } from '@/scripts/gsap/scroll-reveal';

export function initLandingPage(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initHeroImg();
      initScrollReveal();
    });
  });
}
