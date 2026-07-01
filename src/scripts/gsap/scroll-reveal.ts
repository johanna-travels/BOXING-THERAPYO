/**
 * Layer 3 — Section fade-ins ([data-reveal] on landing sections).
 * Called from init-landing.ts after ScrollSmoother has mounted.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const REVEAL_CONFIG = {
  up: { from: { y: 60, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1 } },
  left: { from: { x: -80, autoAlpha: 0 }, to: { x: 0, autoAlpha: 1 } },
  right: { from: { x: 80, autoAlpha: 0 }, to: { x: 0, autoAlpha: 1 } },
  stagger: { from: { y: 50, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1 } },
} as const;

const SCROLL_TRIGGER_BASE = {
  start: 'top 92%',
  toggleActions: 'play none none none',
  once: true,
} as const;

let initialized = false;

export function initScrollReveal(): void {
  if (initialized || typeof window === 'undefined') return;

  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (revealElements.length === 0) return;

  gsap.registerPlugin(ScrollTrigger);
  initialized = true;

  revealElements.forEach((el) => {
    const variant = el.dataset.reveal as keyof typeof REVEAL_CONFIG | undefined;
    if (!variant || !(variant in REVEAL_CONFIG)) return;

    const config = REVEAL_CONFIG[variant];

    if (variant === 'stagger') {
      const children = el.children;
      if (children.length === 0) return;

      gsap.fromTo(
        children,
        config.from,
        {
          ...config.to,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            ...SCROLL_TRIGGER_BASE,
            trigger: el,
            start: 'top 90%',
          },
        },
      );
      return;
    }

    gsap.fromTo(
      el,
      config.from,
      {
        ...config.to,
        duration: 1.2,
        ease: 'power2.out',
        force3D: true,
        scrollTrigger: {
          ...SCROLL_TRIGGER_BASE,
          trigger: el,
        },
      },
    );
  });

  ScrollTrigger.refresh();
}
