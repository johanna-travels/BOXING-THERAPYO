/**
 * Intro reveal for LoaderContain.astro ([data-loader-contain]).
 */
import gsap from 'gsap';

let initialized = false;

export function initLoaderContain(): void {
  if (initialized || typeof window === 'undefined') return;

  const root = document.querySelector<HTMLElement>('[data-loader-contain]');
  if (!root) return;

  initialized = true;

  const layoutItems = root.querySelectorAll<HTMLElement>('.loader_layout > *');
  const btn = root.querySelector<HTMLElement>('.btn_round');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set([...layoutItems, btn].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
    return;
  }

  if (layoutItems.length > 0) {
    gsap.from(layoutItems, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }

  if (btn) {
    gsap.from(btn, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'back.out(1.7)',
    });
  }

  // Media query check στο GSAP
  const mm = gsap.matchMedia();

  mm.add('(max-width: 991px)', () => {
    // Animations ειδικά για tablet
    const heading = root.querySelector<HTMLElement>('.h1-display');
    if (!heading) return;

    gsap.from(heading, {
      y: 30, // Μικρότερη κίνηση
      opacity: 0,
      duration: 0.8,
    });
  });
}
