import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/gsap/plugins';

/** Matches the footer marker in `SiteFooter.astro`. */
export const FOOTER_BOB_SELECTOR = '[data-footer-bob]';

type FooterBobOptions = {
  /** How far the footer jumps up in pixels. */
  jump?: number;
  /** Animation duration in seconds. */
  duration?: number;
};

/**
 * Bobs the footer up and down while it is visible in the viewport.
 * ScrollTrigger starts/pauses the tween — nothing runs off-screen.
 */
export function initFooterBob({
  jump = 120,
  duration = 0.9,
}: FooterBobOptions = {}): void {
  registerGsapPlugins();

  const footer = document.querySelector<HTMLElement>(FOOTER_BOB_SELECTOR);
  if (!footer) return;

  const bob = gsap.to(footer, {
    keyframes: {
      y: [0, -jump, 0],
      ease: 'power4.out',
    },
    duration,
    ease: 'bounce.out',
    paused: true,
  });

  ScrollTrigger.create({
    trigger: footer,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      if (isActive) bob.restart();
      else bob.pause();
    },
  });
}
