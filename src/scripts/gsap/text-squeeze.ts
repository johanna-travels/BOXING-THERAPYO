/**
 * Layer 3 — "Squeeze" text reveal for any [data-gsap-squeeze] element.
 *
 * SplitText breaks the text into characters, then each char bounces up from a
 * vertically-compressed (squashed) state as the element scrolls into view.
 * Reusable: add `data-gsap-squeeze` to any heading.
 *
 * Anti-flash: the CSS gate hides [data-gsap-squeeze] until this runs, so the
 * full title never flashes before it splits. If JS is unavailable the element
 * stays hidden (same trade-off as the other reveal layers).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let initialized = false;
let ctx: ReturnType<typeof gsap.context> | undefined;

export function initTextSqueeze(): void {
  if (initialized || typeof window === 'undefined') return;

  const targets = gsap.utils.toArray<HTMLElement>('[data-gsap-squeeze]');
  if (targets.length === 0) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  initialized = true;

  // Reduced motion: no split, just reveal the titles.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(targets, { autoAlpha: 1, visibility: 'visible' });
    return;
  }

  // gsap.context() scopes every tween / ScrollTrigger / SplitText created here,
  // so destroyTextSqueeze() can revert them all in a single call — no orphaned
  // triggers left controlling the same element after teardown.
  ctx = gsap.context(() => {
    targets.forEach((el) => {
      gsap.set(el, { visibility: 'visible' });

      // autoSplit re-splits on web-font load AND on resize, reverting the
      // previous split + returned animation first (incl. clearing GSAP's inline
      // styles). This prevents duplicate ScrollTriggers fighting over the same
      // chars and keeps lines aligned across breakpoints.
      SplitText.create(el, {
        type: 'chars',
        charsClass: 'squeeze-char',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.chars,
            {
              autoAlpha: 0,
              yPercent: 120,
              scaleY: 2.4,
              scaleX: 0.4,
              transformOrigin: 'center bottom',
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
              duration: 0.9,
              ease: 'back.out(2.5)',
              stagger: 0.045,
              force3D: true,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        },
      });
    });
  });
}

/** Tear down every squeeze animation/split (call on route change / unmount). */
export function destroyTextSqueeze(): void {
  ctx?.revert();
  ctx = undefined;
  initialized = false;
}
