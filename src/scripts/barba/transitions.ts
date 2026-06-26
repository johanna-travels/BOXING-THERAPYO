import type { ITransition } from '@barba/core';
import gsap from 'gsap';

const TRANSITION_SELECTOR = '.transition';
const MIDDLE_SELECTOR = '.transition__middle';

function getTransitionElements() {
  const transition = document.querySelector<HTMLElement>(TRANSITION_SELECTOR);
  const middle = document.querySelector<HTMLElement>(MIDDLE_SELECTOR);

  if (!transition || !middle) {
    throw new Error('Page transition elements are missing from the layout.');
  }

  return { transition, middle };
}

export function createDefaultTransition(): ITransition {
  return {
    name: 'default',
    leave() {
      const { transition, middle } = getTransitionElements();

      return gsap.to(middle, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        onStart: () => {
          transition.style.pointerEvents = 'all';
        },
      });
    },
    enter() {
      const { transition, middle } = getTransitionElements();

      return gsap.to(middle, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          transition.style.pointerEvents = 'none';
        },
      });
    },
  };
}
