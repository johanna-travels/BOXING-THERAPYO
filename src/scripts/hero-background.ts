/**
 * Layer 0 lifecycle — poster first, deferred video, fallback to poster.
 * Dispatches `hero-bg-ready` on the section when Layer 0 is usable.
 */
import { heroBackground } from '@/data/hero';
import { signalPlayStart } from '@/scripts/gsap/header-transition';

export const HERO_BG_READY = 'hero-bg-ready';

const SECTION_SELECTOR = '.section_loader[data-hero-img]';

function shouldSkipVideo(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(prefers-reduced-data: reduce)').matches
  );
}

function markBackgroundReady(
  section: HTMLElement,
  mode: 'video' | 'fallback',
): void {
  section.dataset.heroBgReady = 'true';
  section.classList.remove('is-bg-loading');
  section.classList.add(mode === 'video' ? 'is-video-ready' : 'is-fallback');
  document.documentElement.classList.remove('gsap-hero-pending');
  section.dispatchEvent(new CustomEvent(HERO_BG_READY, { bubbles: true }));
}

function playVideo(video: HTMLVideoElement): void {
  void video.play().then(() => {
    signalPlayStart();
  }).catch(() => {
    /* autoplay blocked — poster remains visible */
  });
}

function probeVideoSrc(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = document.createElement('video');
    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, heroBackground.loadTimeout);

    const cleanup = (): void => {
      window.clearTimeout(timeout);
      probe.removeAttribute('src');
      probe.load();
    };

    probe.preload = 'metadata';
    probe.muted = true;
    probe.playsInline = true;

    probe.addEventListener(
      'loadedmetadata',
      () => {
        cleanup();
        resolve(true);
      },
      { once: true },
    );

    probe.addEventListener(
      'error',
      () => {
        cleanup();
        resolve(false);
      },
      { once: true },
    );

    probe.src = src;
    probe.load();
  });
}

async function resolveVideoSrc(video: HTMLVideoElement): Promise<string | null> {
  const localSrc = video.dataset.localSrc ?? '';
  const remoteSrc = video.dataset.remoteSrc ?? '';

  if (localSrc && (await probeVideoSrc(localSrc))) return localSrc;
  if (remoteSrc && (await probeVideoSrc(remoteSrc))) return remoteSrc;

  return null;
}

function scheduleDeferredLoad(startLoad: () => void): void {
  window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(startLoad, { timeout: 2500 });
    } else {
      startLoad();
    }
  }, heroBackground.videoLoadDelay);
}

export function waitForHeroBackground(section: HTMLElement): Promise<void> {
  if (section.dataset.heroBgReady === 'true') return Promise.resolve();

  return new Promise((resolve) => {
    section.addEventListener(HERO_BG_READY, () => resolve(), { once: true });
  });
}

export function initHeroBackground(): void {
  const section = document.querySelector<HTMLElement>(SECTION_SELECTOR);
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video-el]');

  if (!section) return;

  document.documentElement.classList.add('gsap-hero-pending');
  section.classList.add('is-bg-loading');

  if (shouldSkipVideo() || !video) {
    markBackgroundReady(section, 'fallback');
    return;
  }

  const startLoad = (): void => {
    void resolveVideoSrc(video).then((src) => {
      if (!src) {
        markBackgroundReady(section, 'fallback');
        return;
      }

      video.src = src;

      const onReady = (): void => {
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onError);
        markBackgroundReady(section, 'video');
        playVideo(video);
      };

      const onError = (): void => {
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onError);
        markBackgroundReady(section, 'fallback');
      };

      video.addEventListener('canplay', onReady, { once: true });
      video.addEventListener('error', onError, { once: true });
      video.load();
    });
  };

  if (document.readyState === 'complete') {
    scheduleDeferredLoad(startLoad);
  } else {
    window.addEventListener('load', () => scheduleDeferredLoad(startLoad), { once: true });
  }
}
