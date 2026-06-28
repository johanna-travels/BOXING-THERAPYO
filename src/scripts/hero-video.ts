import gsap from 'gsap';

import { heroVideo } from '@/data/hero';
import { setVideoEnded, signalPlayStart } from '@/scripts/gsap/header-transition';

const VIDEO_ID = 'headerVideo';
const DESKTOP_MEDIA = '(min-width: 768px)';

const { gatekeeperDuration: GATEKEEPER_DURATION, videoLoadDelay: VIDEO_LOAD_DELAY } = heroVideo;

function isDesktopViewport(): boolean {
  return window.matchMedia(DESKTOP_MEDIA).matches;
}

function hydrateVideoSources(video: HTMLVideoElement): void {
  if (video.dataset.hydrated === 'true') return;

  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    const src = source.dataset.src;
    if (src) source.src = src;
  });

  video.dataset.hydrated = 'true';
  video.load();
}

function isVideoHydrated(video: HTMLVideoElement): boolean {
  return video.dataset.hydrated === 'true';
}

function bindVideoEvents(video: HTMLVideoElement): void {
  video.addEventListener('ended', () => setVideoEnded(), { passive: true });
}

function playVideo(video: HTMLVideoElement): void {
  void video.play().catch(() => {
    /* autoplay blocked — gatekeeper or user gesture will retry */
  });
}

/** Inject deferred local sources — skeleton first, video second. */
function loadHeroVideo(video: HTMLVideoElement): Promise<void> {
  if (isVideoHydrated(video)) return Promise.resolve();

  return new Promise((resolve) => {
    const onReady = (): void => {
      video.removeEventListener('canplay', onReady);
      resolve();
    };

    video.addEventListener('canplay', onReady, { once: true });
    hydrateVideoSources(video);
  });
}

function markVideoReady(section: HTMLElement): void {
  section.classList.remove('is-iframe-loading');
  section.classList.add('is-video-ready');
  section.dataset.videoReady = 'true';
}

function scheduleDeferredVideoLoad(video: HTMLVideoElement, section: HTMLElement): void {
  const startLoad = (): void => {
    section.classList.add('is-iframe-loading');

    window.setTimeout(() => {
      void loadHeroVideo(video).then(() => {
        markVideoReady(section);
        bindVideoEvents(video);

        if (isDesktopViewport()) {
          playVideo(video);
        }
      });
    }, VIDEO_LOAD_DELAY);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(startLoad, { timeout: 2500 });
  } else if (document.readyState === 'complete') {
    startLoad();
  } else {
    window.addEventListener('load', startLoad, { once: true });
  }
}

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
  video,
}: {
  section: HTMLElement;
  touchGate: HTMLAnchorElement;
  playIcon: HTMLElement;
  tint: HTMLElement;
  media: HTMLElement;
  visor: HTMLElement | null;
  loader: HTMLElement | null;
  video: HTMLVideoElement;
}): void {
  section.classList.add('is-playing');
  dismissVideoLoader(loader);

  void loadHeroVideo(video).then(() => {
    markVideoReady(section);
    bindVideoEvents(video);
    playVideo(video);
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
  const video = document.getElementById(VIDEO_ID) as HTMLVideoElement | null;

  if (!section || !touchGate || !playIcon || !tint || !media || !video) return;

  scheduleDeferredVideoLoad(video, section);

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
      video,
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
