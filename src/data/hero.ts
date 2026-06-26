/**
 * Hero video orchestration — «The Plan»
 *
 *  0.0s  Poster + tint + «LOADING STORY» loader
 *  0.5s  Iframe injects hidden — Vimeo buffers under the veil
 * ~1.0s  Loader fades — play appears, user taps
 *  1–2s  GSAP reveal (icon, tint fade, zoom) — buffer headroom
 *  2.0s+ Video playing — feels like an interactive intro, not a load
 */
export const heroVideo = {
  /** Replace with your Vimeo video ID */
  vimeoId: '76979871',
  /**
   * Hero poster — shown on `.visor` while the iframe loads.
   * Omit to fetch the Vimeo thumbnail at build time (1920px wide).
   * For production, you can host a local file: `/images/hero-poster.jpg`
   */
  posterUrl: undefined as string | undefined,
  /** L3 veil — masks buffering blur & player chrome (0–1). */
  tintOpacity: 0.52,
  /** L4 gatekeeper — GSAP reveal length in seconds (target: 1s → 2s mark). */
  gatekeeperDuration: 1,
  /** Deferred iframe — ms after page idle (Barba stand-in, target: 0.5s). */
  iframeLoadDelay: 500,
  /** Branded loader copy — shown until story/video is ready. */
  loaderText: 'LOADING STORY',
} as const;

/** Vimeo background embed — silent autoplay, no chrome, loops like wallpaper. */
export function buildVimeoEmbedSrc(vimeoId: string): string {
  const params = new URLSearchParams({
    api: '1',
    background: '1',
    autoplay: '1',
    muted: '1',
    loop: '1',
    title: '0',
    byline: '0',
    portrait: '0',
  });

  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}
