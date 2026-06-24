const SLIDE_SELECTOR = '.snap-slide--has-bg';
const ACTIVE_CLASS = 'is-active';

export function initFixedSlideBackgrounds(): void {
  const slides = document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
  if (slides.length === 0) return;

  const setActive = (active: HTMLElement) => {
    slides.forEach((slide) => {
      slide.classList.toggle(ACTIVE_CLASS, slide === active);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]?.target instanceof HTMLElement) {
        setActive(visible[0].target);
      }
    },
    { threshold: [0, 0.35, 0.55, 0.75, 1] },
  );

  slides.forEach((slide) => observer.observe(slide));
  setActive(slides[0]);
}
