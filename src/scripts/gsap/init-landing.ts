/**
 * Layer 3 — Homepage (LandingPage.astro)
 */
import { initHeroScroll } from '@/scripts/gsap/hero';
import { initLoaderContain } from '@/scripts/gsap/loader-contain';
import { initScrollReveal } from '@/scripts/gsap/scroll-reveal';
import { initTextSqueeze } from '@/scripts/gsap/text-squeeze';
import { initThemeSwitch } from '@/scripts/gsap/theme-switch';
import { initWorkCards } from '@/scripts/gsap/work-cards';
import { initHeroBackground } from '@/scripts/hero-background';

export function initLandingPage(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initHeroBackground();
      initHeroScroll();
      initLoaderContain();
      initScrollReveal();
      initWorkCards();
      initTextSqueeze();
      initThemeSwitch();
    });
  });
}
