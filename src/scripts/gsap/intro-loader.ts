/**
 * Layer 2 — Intro overlay ([data-intro-loader]).
 * Fake logo stagger → words → hand-off to header logo → slide up.
 */
import gsap from 'gsap';

import {
  handoffFakeToReal,
  initLogoPrime,
  revealLogoStagger,
  showRealLogoInstant,
} from '@/scripts/gsap/logo-reveal';

const LOADER_SELECTOR = '[data-intro-loader]';
const PROGRESS_SELECTOR = '[data-intro-loader-progress]';
const WORD_SELECTOR = '[data-intro-loader-word]';
const FAKE_LOGO_SELECTOR = '[data-fake-logo-wrap]';

let initialized = false;

function dismissLoader(loader: HTMLElement): void {
  gsap.killTweensOf(loader);
  loader.remove();

  const real = document.querySelector<HTMLElement>('[data-real-logo-wrap]');
  if (real?.classList.contains('is-op-0')) {
    showRealLogoInstant();
  }
}

export function initIntroLoader(): void {
  if (initialized || typeof window === 'undefined') return;

  const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
  if (!loader) return;

  initialized = true;
  initLogoPrime();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showRealLogoInstant();
    dismissLoader(loader);
    return;
  }

  const progressBar = loader.querySelector<HTMLElement>(PROGRESS_SELECTOR);
  const words = loader.querySelectorAll<HTMLElement>(WORD_SELECTOR);
  const fakeLogo = loader.querySelector<HTMLElement>(FAKE_LOGO_SELECTOR);

  if (!progressBar || words.length === 0) {
    showRealLogoInstant();
    dismissLoader(loader);
    return;
  }

  gsap.set(words, { y: '100%' });

  const tl = gsap.timeline({
    defaults: { ease: 'expo.inOut' },
    onComplete: () => dismissLoader(loader),
  });

  tl.from(progressBar, { scaleY: 0, duration: 1.5 });

  if (fakeLogo) {
    tl.add(() => {
      revealLogoStagger(fakeLogo);
    }, '-=1.1');
  }

  tl.to(
    words,
    {
      y: '0%',
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
    },
    '-=0.8',
  );

  tl.add(() => handoffFakeToReal(), '-=0.2');

  tl.to(
    loader,
    {
      yPercent: -100,
      duration: 1.2,
      delay: 0.35,
    },
  );
}

export function bindIntroLoader(): void {
  if (typeof window === 'undefined') return;

  const run = () => {
    try {
      initIntroLoader();
    } catch {
      showRealLogoInstant();
      const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
      if (loader) loader.remove();
    }
  };

  window.setTimeout(() => {
    const loader = document.querySelector<HTMLElement>(LOADER_SELECTOR);
    if (loader) {
      showRealLogoInstant();
      dismissLoader(loader);
    }
  }, 8000);

  if (document.readyState === 'complete') {
    run();
    return;
  }

  window.addEventListener('load', run, { once: true });
}
