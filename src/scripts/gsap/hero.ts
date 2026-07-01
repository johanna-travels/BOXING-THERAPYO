/**
 * Header scroll hook only — reads [data-hero-img]. Does not animate the hero.
 * Hero markup is Tailwind-only; intro animation is intro-loader.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { evaluateHeaderMode, setVideoEnded } from '@/scripts/gsap/header-transition';

const HERO_SELECTOR = '[data-hero-img]';

function onHeroPassed(): void {
  setVideoEnded();
}

function onHeroReentered(): void {
  document.body.classList.remove('video-ended');
  evaluateHeaderMode();
}

export function initHeroImg(): void {
  const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: hero,
    start: 'bottom top',
    onEnter: onHeroPassed,
    onLeaveBack: onHeroReentered,
  });
}
