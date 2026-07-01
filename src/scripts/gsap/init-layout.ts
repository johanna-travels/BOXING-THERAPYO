/**
 * Layer 1 — Site shell (Layout.astro)
 * Runs once on every page. Start here when debugging global scroll / header / nav.
 */
import { initHeaderTransition } from '@/scripts/gsap/header-transition';
import { initNavMenu } from '@/scripts/gsap/nav-menu';
import { initScrollSmoother } from '@/scripts/gsap/scroll-smoother';

export function initLayout(): void {
  initScrollSmoother();
  initHeaderTransition();
  initNavMenu();
}
