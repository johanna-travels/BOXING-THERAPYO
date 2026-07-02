import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getScrollY } from './scroll-smoother';

const HEADER_SELECTOR = '.site-header';
const LOGO_SELECTOR = '[data-real-logo-wrap] .logo-mark, [data-real-logo-wrap] .logo';

/** At top after video — nav waits so hero content reads first. Cancelled on scroll. */
const FLOW_DELAY = 1.075;
const FLOW_DURATION = 0.25;

const COLORS = {
  light: 'rgba(20, 20, 20, 0)',
  dark: 'rgb(15, 21, 26)',
} as const;

type HeaderState = 'idle' | 'playing' | 'dark';

let styleTween: gsap.core.Tween | null = null;
let logoTween: gsap.core.Tween | null = null;
let currentState: HeaderState | null = null;
let lastScrollY = 0;

function shouldUseDarkMode(): boolean {
  return document.body.classList.contains('video-ended');
}

function getFlowDelay(): number {
  return getScrollY() > 0 ? 0 : FLOW_DELAY;
}

function getHeader(): HTMLElement | null {
  return document.querySelector<HTMLElement>(HEADER_SELECTOR);
}

function isFullyHidden(): boolean {
  return getHeader()?.classList.contains('is-hidden') ?? false;
}

function cancelPendingFlowDelay(): void {
  if (getScrollY() <= 0) return;

  const styleDelayed = styleTween && styleTween.delay() > 0 && !styleTween.isActive();
  const logoDelayed = logoTween && logoTween.delay() > 0 && !logoTween.isActive();

  if (!styleDelayed && !logoDelayed) return;

  styleTween?.kill();
  logoTween?.kill();
  evaluateHeaderMode();
}

function applyHeaderState(state: HeaderState, delay = 0): void {
  if (isFullyHidden()) {
    currentState = state;
    document.body.classList.toggle('is-header-active', state === 'dark');
    return;
  }

  if (state === currentState && delay === 0) return;

  currentState = state;

  const header = getHeader();
  const logo = document.querySelector<HTMLElement>(LOGO_SELECTOR);
  if (!header) return;

  header.classList.add('ready');
  document.body.classList.toggle('is-header-active', state === 'dark');

  const config = {
    idle: {
      backgroundColor: COLORS.light,
      logoScale: 1,
    },
    playing: {
      backgroundColor: COLORS.light,
      logoScale: 0.88,
    },
    dark: {
      backgroundColor: COLORS.dark,
      logoScale: 0.88,
    },
  }[state];

  styleTween?.kill();
  logoTween?.kill();

  styleTween = gsap.to(header, {
    backgroundColor: config.backgroundColor,
    delay,
    duration: FLOW_DURATION,
    ease: 'power2.out',
    overwrite: true,
  });

  if (logo) {
    logoTween = gsap.to(logo, {
      scale: config.logoScale,
      transformOrigin: 'left center',
      delay,
      duration: FLOW_DURATION,
      ease: 'power2.out',
      overwrite: true,
    });
  }
}

export function evaluateHeaderMode(): void {
  const delay = shouldUseDarkMode() ? getFlowDelay() : 0;

  if (shouldUseDarkMode()) {
    applyHeaderState('dark', delay);
  } else if (document.body.classList.contains('is-playing')) {
    applyHeaderState('playing', 0);
  } else {
    applyHeaderState('idle', 0);
  }
}

export function signalPlayStart(): void {
  document.body.classList.add('is-playing', 'video-playing');
  document.body.classList.remove('video-ended');
  applyHeaderState('playing', 0);
}

export const setVideoPlaying = signalPlayStart;

export function setVideoEnded(): void {
  document.body.classList.add('video-ended');
  evaluateHeaderMode();
}

function updateHeaderScrollHide(): void {
  const header = getHeader();
  if (!header) return;

  const currentScroll = getScrollY();

  if (document.body.classList.contains('nav-open')) {
    header.classList.remove('is-hidden');
    lastScrollY = currentScroll;
    return;
  }

  if (currentScroll <= 0) {
    header.classList.remove('is-hidden');
    lastScrollY = currentScroll;
    return;
  }

  if (currentScroll > lastScrollY && !header.classList.contains('is-hidden')) {
    header.classList.add('is-hidden');
  } else if (currentScroll < lastScrollY && header.classList.contains('is-hidden')) {
    header.classList.remove('is-hidden');
  }

  lastScrollY = currentScroll;
}

function onScroll(): void {
  document.body.classList.toggle('scrolled', getScrollY() > 0);
  cancelPendingFlowDelay();
  updateHeaderScrollHide();

  if (!isFullyHidden()) {
    evaluateHeaderMode();
  }
}

/** Show header when nav opens; re-evaluate GSAP state when visible. */
export function refreshHeaderVisibility(): void {
  onScroll();
}

export function initHeaderTransition(): void {
  const header = getHeader();
  const logo = document.querySelector<HTMLElement>(LOGO_SELECTOR);

  if (header) {
    header.classList.add('ready');
    gsap.set(header, {
      backgroundColor: COLORS.light,
      visibility: 'visible',
      clearProps: 'opacity',
    });
  }

  if (logo) {
    gsap.set(logo, { scale: 1, transformOrigin: 'left center' });
  }

  currentState = 'idle';
  header?.setAttribute('data-header-ready', 'true');

  ScrollTrigger.addEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
