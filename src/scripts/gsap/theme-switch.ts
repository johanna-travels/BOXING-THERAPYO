/**
 * Layer 3 — Scroll-driven page theme switching.
 *
 * Any element with `data-animate-theme-to="<theme>"` animates the whole-page
 * background (document.body, which shows through transparent sections behind
 * ScrollSmoother's #smooth-wrapper) to the theme colour when it enters the
 * viewport, and reverts to the base colour when it leaves.
 *
 * Usage: <section data-animate-theme-to="pink"> ... </section>
 * A raw CSS colour also works: data-animate-theme-to="#ff00aa".
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const THEMES: Record<string, string> = {
  pink: '#df0567',
  black: '#000000',
  white: '#ffffff',
  dark: 'rgb(15, 21, 26)',
};

const DURATION = 0.8;

let initialized = false;

export function initThemeSwitch(): void {
  if (initialized || typeof window === 'undefined') return;

  const targets = gsap.utils.toArray<HTMLElement>('[data-animate-theme-to]');
  if (targets.length === 0) return;

  gsap.registerPlugin(ScrollTrigger);
  initialized = true;

  // Snapshot the starting page background to revert to.
  const baseBg = getComputedStyle(document.body).backgroundColor;

  const toColor = (color: string): void => {
    gsap.to(document.body, {
      backgroundColor: color,
      duration: DURATION,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  targets.forEach((el) => {
    const key = el.dataset.animateThemeTo ?? '';
    const themeColor = THEMES[key] ?? key; // fall back to a raw colour value

    ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => toColor(themeColor),
      onEnterBack: () => toColor(themeColor),
      onLeave: () => toColor(baseBg),
      onLeaveBack: () => toColor(baseBg),
    });
  });
}
