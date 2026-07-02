/**
 * FocusBox logo reveal — stagger on [data-logo-part], fake→real handoff after intro.
 */
import gsap from 'gsap';

const FAKE_WRAP = '[data-fake-logo-wrap]';
const REAL_WRAP = '[data-real-logo-wrap]';
const LOGO_PART = '[data-logo-part]';

function getParts(wrap: HTMLElement): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(wrap.querySelectorAll(LOGO_PART));
}

/** Remove flash — parts start hidden until GSAP runs. */
export function primeLogoHidden(wrap: HTMLElement | null): void {
  if (!wrap) return;
  const parts = getParts(wrap);
  gsap.set(parts, { autoAlpha: 0, y: 14 });
}

export function revealLogoStagger(wrap: HTMLElement | null): gsap.core.Tween | null {
  if (!wrap) return null;

  wrap.classList.remove('is-op-0');
  gsap.set(wrap, { autoAlpha: 1, visibility: 'visible' });

  const parts = getParts(wrap);
  if (parts.length === 0) return null;

  return gsap.to(parts, {
    autoAlpha: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.04,
    ease: 'power3.out',
  });
}

/** Loader fake logo out → header real logo in (Webflow hand-off). */
export function handoffFakeToReal(): Promise<void> {
  const fake = document.querySelector<HTMLElement>(FAKE_WRAP);
  const real = document.querySelector<HTMLElement>(REAL_WRAP);

  if (!real) return Promise.resolve();

  return new Promise((resolve) => {
    const realParts = getParts(real);
    real.classList.remove('is-op-0');
    gsap.set(real, { autoAlpha: 1, visibility: 'visible' });

    const tl = gsap.timeline({ onComplete: resolve });

    if (fake) {
      tl.to(fake, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 0);
    }

    if (realParts.length > 0) {
      gsap.set(realParts, { autoAlpha: 0, y: 10 });
      tl.to(
        realParts,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: 'power3.out',
        },
        fake ? 0.12 : 0,
      );
    }
  });
}

/** Reduced motion / fallback — show header logo immediately. */
export function showRealLogoInstant(): void {
  const fake = document.querySelector<HTMLElement>(FAKE_WRAP);
  const real = document.querySelector<HTMLElement>(REAL_WRAP);

  fake?.remove();
  if (!real) return;

  real.classList.remove('is-op-0');
  gsap.set(real, { autoAlpha: 1, visibility: 'visible' });
  gsap.set(getParts(real), { autoAlpha: 1, y: 0 });
}

export function initLogoPrime(): void {
  primeLogoHidden(document.querySelector<HTMLElement>(FAKE_WRAP));
  primeLogoHidden(document.querySelector<HTMLElement>(REAL_WRAP));
}
