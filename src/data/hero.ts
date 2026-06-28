/**
 * Hero video orchestration — «The Plan»
 *
 *  0.0s  Poster + tint + «LOADING STORY» loader
 *  0.5s  Video src hydrates hidden — buffers under the veil
 * ~1.0s  Loader fades — play appears, user taps (mobile)
 *  1–2s  GSAP reveal (icon, tint fade, zoom) — buffer headroom
 *  2.0s+ Video playing — feels like an interactive intro, not a load
 */
export const heroVideo = {
  /** Local MP4 — place at public/videos/hero.mp4 */
  videoSrc: 'videos/hero.mp4',
  /** Optional WebM for smaller delivery (public/videos/hero.webm) */
  videoSrcWebm: undefined as string | undefined,
  /** Local poster — instant L1 paint, no build-time network fetch */
  posterUrl: 'images/hero-poster.jpg',
  /** L3 veil — masks buffering blur & player chrome (0–1). */
  tintOpacity: 0.52,
  /** L4 gatekeeper — GSAP reveal length in seconds (target: 1s → 2s mark). */
  gatekeeperDuration: 1,
  /** Deferred video — ms after page idle (target: 0.5s). */
  videoLoadDelay: 500,
  /** Branded loader copy — shown until story/video is ready. */
  loaderText: 'LOADING STORY',
} as const;
