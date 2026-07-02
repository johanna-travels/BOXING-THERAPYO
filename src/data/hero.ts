/** Layer 0 — hero background (poster → video). */
export const heroBackground = {
  poster: {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    alt: 'Unlock Your Creative Potential',
  },
  video: {
    localSrc: 'videos/hero.mp4',
    remoteSrc: 'https://horecacreators.b-cdn.net/video-1440p-optimized.mp4',
  },
  videoLoadDelay: 600,
  loadTimeout: 15000,
} as const;
