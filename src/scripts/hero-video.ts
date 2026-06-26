import gsap from 'gsap';

import { heroVideo } from '@/data/hero';
import { setVideoEnded, signalPlayStart } from '@/scripts/gsap/header-transition';

const IFRAME_ID = 'headerVideo';
const VIMEO_ORIGIN = 'https://player.vimeo.com';

const { gatekeeperDuration: GATEKEEPER_DURATION, iframeLoadDelay: IFRAME_LOAD_DELAY } = heroVideo;

let windowMessageBound = false;

function bindVimeoEvents(iframe: HTMLIFrameElement): void {
  postToVimeo(iframe, 'addEventListener', 'finish');
  postToVimeo(iframe, 'addEventListener', 'play');

  if (windowMessageBound) return;
  windowMessageBound = true;

  window.addEventListener('message', (event) => {
    if (event.origin !== VIMEO_ORIGIN) return;

    try {
      const data = JSON.parse(event.data as string) as { event?: string };
      if (data.event === 'finish') setVideoEnded();
    } catch {
      /* ignore non-json postMessages */
    }
  });
}

function postToVimeo(iframe: HTMLIFrameElement, method: string, value?: unknown): void {
  const payload = value === undefined ? { method } : { method, value };
  iframe.contentWindow?.postMessage(JSON.stringify(payload), VIMEO_ORIGIN);
}

function isIframeLoaded(iframe: HTMLIFrameElement): boolean {
  return Boolean(iframe.src && iframe.src !== 'about:blank');
}

/** Inject deferred Vimeo src — skeleton first, player second. */
function loadHeroIframe(iframe: HTMLIFrameElement): Promise<void> {
  if (isIframeLoaded(iframe)) return Promise.resolve();

  const src = iframe.dataset.src;
  if (!src) return Promise.resolve();

  return new Promise((resolve) => {
    iframe.addEventListener('load', () => resolve(), { once: true });
    iframe.src = src;
  });
}

function scheduleDeferredIframeLoad(iframe: HTMLIFrameElement, section: HTMLElement): void {
  const startLoad = (): void => {
    section.classList.add('is-iframe-loading');

    window.setTimeout(() => {
      void loadHeroIframe(iframe).then(() => {
        section.classList.remove('is-iframe-loading');
        section.classList.add('is-video-ready');
        bindVimeoEvents(iframe);
      });
    }, IFRAME_LOAD_DELAY);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(startLoad, { timeout: 2500 });
  } else if (document.readyState === 'complete') {
    startLoad();
  } else {
    window.addEventListener('load', startLoad, { once: true });
  }
}

/**
 * L4 gatekeeper reveal — ~1s staged timeline (The Plan: 1s→2s dance).
 * Play icon vanishes fast; tint + zoom linger so Vimeo can buffer underneath.
 */
function dismissVideoLoader(loader: HTMLElement | null): void {
  if (!loader) return;

  gsap.killTweensOf(loader);
  gsap.to(loader, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => loader.remove(),
  });
}

function runGatekeeperReveal({
  section,
  touchGate,
  playIcon,
  tint,
  media,
  visor,
  loader,
  iframe,
}: {
  section: HTMLElement;
  touchGate: HTMLAnchorElement;
  playIcon: HTMLElement;
  tint: HTMLElement;
  media: HTMLElement;
  visor: HTMLElement | null;
  loader: HTMLElement | null;
  iframe: HTMLIFrameElement;
}): void {
  section.classList.add('is-playing');
  dismissVideoLoader(loader);
  void loadHeroIframe(iframe).then(() => {
    bindVimeoEvents(iframe);
    postToVimeo(iframe, 'setMuted', true);
    postToVimeo(iframe, 'play');
  });

  signalPlayStart();
  section.classList.add('is-revealing', 'is-video-ready');

  const iconOut = GATEKEEPER_DURATION * 0.2;
  const revealStart = GATEKEEPER_DURATION * 0.28;
  const revealDuration = GATEKEEPER_DURATION * 0.72;

  const tl = gsap.timeline({
    onComplete: () => {
      section.classList.add('is-unlocked');
      section.classList.remove('is-revealing', 'is-iframe-loading');
      touchGate.style.visibility = 'hidden';
      touchGate.style.pointerEvents = 'none';
    },
  });

  tl.to(
    playIcon,
    {
      scale: 1.55,
      opacity: 0,
      duration: iconOut,
      ease: 'power2.in',
    },
    0,
  );

  tl.to(
    touchGate,
    {
      opacity: 0,
      duration: iconOut,
      ease: 'power2.out',
    },
    0,
  );

  tl.to(
    tint,
    {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      WebkitBackdropFilter: 'blur(0px)',
      duration: revealDuration,
      ease: 'power2.inOut',
    },
    revealStart,
  );

  tl.to(
    media,
    {
      scale: 1.08,
      duration: revealDuration,
      ease: 'power2.inOut',
    },
    revealStart - 0.05,
  );

  if (visor) {
    tl.to(
      visor,
      {
        opacity: 0,
        duration: revealDuration * 0.85,
        ease: 'power2.inOut',
      },
      revealStart + 0.08,
    );
  }
}

export function initHeroVideo(): void {
  const section = document.querySelector<HTMLElement>('[data-hero-video]');
  const touchGate = document.querySelector<HTMLAnchorElement>('[data-touch-gate]');
  const playIcon = document.querySelector<HTMLElement>('[data-play-icon]');
  const tint = section?.querySelector<HTMLElement>('[data-tinted-window]');
  const media = section?.querySelector<HTMLElement>('.hero-video__media');
  const visor = section?.querySelector<HTMLElement>('.visor');
  const loader = document.getElementById('video-loader');
  const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;

  if (!section || !touchGate || !playIcon || !tint || !media || !iframe) return;

  scheduleDeferredIframeLoad(iframe, section);

  let isUnlocking = false;

  const runUnlock = (): void => {
    if (isUnlocking || section.classList.contains('is-unlocked')) return;
    isUnlocking = true;

    runGatekeeperReveal({
      section,
      touchGate,
      playIcon,
      tint,
      media,
      visor,
      loader,
      iframe,
    });
  };

  touchGate.addEventListener('pointerdown', runUnlock, { once: true });
  touchGate.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      runUnlock();
    },
    { once: true },
  );
}
