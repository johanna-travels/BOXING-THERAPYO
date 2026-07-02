/**
 * Layer 3 — Work section card-stack.
 * GSAP pin stack + depth transforms + image scale reveal on all viewports.
 * Pinning is required because ScrollSmoother breaks native position: sticky.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const SCRUB = 1;

const DEPTH = {
  rotationX: 40,
  scale: 0.7,
  rotationZRange: 10,
  perspective: 1000,
} as const;

let initialized = false;

type CardElements = {
  card: HTMLElement;
  heading: HTMLElement | null;
  text: HTMLElement | null;
  img: HTMLElement | null;
  layout: HTMLElement | null;
};

function getCardElements(card: HTMLElement): CardElements {
  return {
    card,
    heading: card.querySelector('[data-work-heading]'),
    text: card.querySelector('[data-work-text]'),
    img: card.querySelector('[data-work-img]'),
    layout: card.querySelector('.card_stack_layout'),
  };
}

function scrubTrigger(
  trigger: Element,
  start: string,
  end: string | (() => string),
): ScrollTrigger.Vars {
  return { trigger, start, end, scrub: SCRUB };
}

function initTextReveal(els: CardElements, splits: SplitText[]): void {
  const lineTargets = [els.heading, els.text].filter(Boolean) as HTMLElement[];
  if (lineTargets.length === 0) return;

  const split = new SplitText(lineTargets, {
    type: 'lines',
    linesClass: 'work-split-line',
  });
  splits.push(split);

  gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
  gsap.to(split.lines, {
    yPercent: 0,
    autoAlpha: 1,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.08,
    force3D: true,
    scrollTrigger: {
      trigger: els.card,
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initImageScale(els: CardElements): void {
  if (!els.img) return;

  gsap.set(els.img, { scale: 0.3, force3D: true });
  gsap.to(els.img, {
    scale: 1,
    ease: 'none',
    force3D: true,
    scrollTrigger: scrubTrigger(els.card, 'top 80%', 'top 30%'),
  });
}

function initDepthEffect(layout: HTMLElement, rotationZ: number, nextCard: HTMLElement): void {
  gsap.to(layout, {
    rotationZ,
    scale: DEPTH.scale,
    rotationX: DEPTH.rotationX,
    ease: 'none',
    force3D: true,
    transformPerspective: DEPTH.perspective,
    scrollTrigger: scrubTrigger(nextCard, 'top bottom', 'top top'),
  });
}

function initFadeOut(card: HTMLElement, layout: HTMLElement): void {
  gsap.to(layout, {
    autoAlpha: 0,
    ease: 'power1.in',
    scrollTrigger: scrubTrigger(
      card,
      'top -80%',
      () => `+=${window.innerHeight * 0.2}`,
    ),
  });
}

function initCardStack(track: HTMLElement, cards: HTMLElement[], splits: SplitText[]): void {
  gsap.set(track, {
    perspective: DEPTH.perspective,
    transformStyle: 'preserve-3d',
  });

  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top top',
      endTrigger: track,
      end: 'bottom bottom',
      pin: true,
      pinSpacing: false,
    });

    const els = getCardElements(card);
    initTextReveal(els, splits);
    initImageScale(els);

    if (!els.layout) return;

    const next = cards[index + 1];
    if (next) {
      const rotationZ = (Math.random() - 0.5) * DEPTH.rotationZRange;
      initDepthEffect(els.layout, rotationZ, next);
    }

    initFadeOut(card, els.layout);
  });
}

function fadeInOnScroll(target: HTMLElement, card: HTMLElement, duration: number): void {
  gsap.from(target, {
    autoAlpha: 0,
    duration,
    ease: 'power2.out',
    scrollTrigger: { trigger: card, start: 'top 80%', once: true },
  });
}

function initReducedMotion(cards: HTMLElement[]): () => void {
  cards.forEach((card) => {
    const els = getCardElements(card);
    const content = card.querySelector<HTMLElement>('[data-work-content]');
    if (content) fadeInOnScroll(content, card, 0.8);
    if (els.img) fadeInOnScroll(els.img, card, 1);
  });
  return () => {};
}

export function initWorkCards(): void {
  if (initialized || typeof window === 'undefined') return;

  const track = document.querySelector<HTMLElement>('[data-work-track]');
  if (!track) return;

  const cards = gsap.utils.toArray<HTMLElement>('[data-work-card]');
  if (cards.length === 0) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  initialized = true;
  document.documentElement.classList.add('gsap-work-ready');

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => initReducedMotion(cards));

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const splits: SplitText[] = [];
    initCardStack(track, cards, splits);
    ScrollTrigger.refresh();
    return () => splits.forEach((s) => s.revert());
  });
}
