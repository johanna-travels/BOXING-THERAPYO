/**
 * Layer 2 — Intro overlay ([data-intro-loader]).
 * Runs on window.load; removes itself when the timeline completes.
 */
import gsap from 'gsap';

const LOADER_SELECTOR = '[data-intro-loader]';
const PROGRESS_SELECTOR = '[data-intro-loader-progress]';
const WORD_SELECTOR = '[data-intro-loader-word]';

let initialized = false;

function dismissLoader(loader: HTMLElement): void {
  gsap.killTweensOf(loader);
  loader.remove();
}

export function initIntroLoader(): void {
  if (initialized || typeof window === 'undefined') return;

  const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
  if (!loader) return;

  initialized = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dismissLoader(loader);
    return;
  }

  const progressBar = loader.querySelector<HTMLElement>(PROGRESS_SELECTOR);
  const words = loader.querySelectorAll<HTMLElement>(WORD_SELECTOR);
  if (!progressBar || words.length === 0) {
    dismissLoader(loader);
    return;
  }

  gsap.set(words, { y: '100%' });

  gsap
    .timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => dismissLoader(loader),
    })
    .from(progressBar, { scaleY: 0, duration: 1.5 })
    .to(
      words,
      {
        y: '0%',
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
      },
      '-=0.8',
    )
    .to(
      loader,
      {
        yPercent: -100,
        duration: 1.2,
        delay: 0.5,
      },
    );
}

export function bindIntroLoader(): void {
  if (typeof window === 'undefined') return;

  const run = () => {
    try {
      initIntroLoader();
    } catch {
      const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
      if (loader) loader.remove();
    }
  };

  // Never leave a black overlay blocking the hero if load/GSAP fails
  window.setTimeout(() => {
    const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
    if (loader) dismissLoader(loader);
  }, 8000);

  if (document.readyState === 'complete') {
    run();
    return;
  }

  window.addEventListener('load', run, { once: true });
}
