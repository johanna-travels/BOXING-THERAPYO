/**
 * Layer 1 — ScrollSmoother wrapper (#smooth-wrapper / #smooth-content).
 * effects: true enables data-speed parallax on elements inside #smooth-content.
 */
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let smoother: ScrollSmoother | undefined;

export function getScrollSmoother(): ScrollSmoother | undefined {
  return smoother ?? ScrollSmoother.get();
}

export function getScrollY(): number {
  return getScrollSmoother()?.scrollTop() ?? window.scrollY;
}

export function initScrollSmoother(): ScrollSmoother | undefined {
  const wrapper = document.querySelector('#smooth-wrapper');
  const content = document.querySelector('#smooth-content');

  if (!wrapper || !content || ScrollSmoother.get()) {
    return ScrollSmoother.get();
  }

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // iOS address bar show/hide can resize the viewport and shift trigger positions.
  ScrollTrigger.config({ ignoreMobileResize: true });

  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
    // Does not block iOS Safari address bar in portrait; pairs with ignoreMobileResize above.
    normalizeScroll: true,
  });

  return smoother;
}
