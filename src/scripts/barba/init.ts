import barba from '@barba/core';

import { closeNavMenu, isNavMenuOpen } from '@/scripts/gsap/nav-menu';
import { createDefaultTransition } from '@/scripts/barba/transitions';

export function initBarba(): void {
  if (!document.querySelector('[data-barba="wrapper"]')) return;

  const defaultTransition = createDefaultTransition();

  barba.init({
    preventRunning: true,
    transitions: [
      {
        ...defaultTransition,
        async leave(data) {
          if (isNavMenuOpen()) {
            await closeNavMenu();
          }

          return defaultTransition.leave?.(data);
        },
      },
    ],
  });
}
