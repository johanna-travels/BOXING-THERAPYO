import gsap from 'gsap';
import { refreshHeaderVisibility } from './header-transition';

const SELECTORS = {
  menu: '[data-nav-menu]',
  toggle: '[data-nav-toggle]',
  panel: '[data-nav-panel]',
  items: '[data-nav-item]',
  secondary: '[data-nav-secondary]',
  header: '.site-header',
} as const;

let isOpen = false;
let activeTimeline: gsap.core.Timeline | null = null;

function getElements() {
  const menu = document.querySelector<HTMLElement>(SELECTORS.menu);
  const toggle = document.querySelector<HTMLInputElement>(SELECTORS.toggle);
  const panel = document.querySelector<HTMLElement>(SELECTORS.panel);

  if (!menu || !toggle || !panel) {
    return null;
  }

  return {
    menu,
    toggle,
    panel,
    items: panel.querySelectorAll<HTMLElement>(SELECTORS.items),
    secondary: panel.querySelector<HTMLElement>(SELECTORS.secondary),
  };
}

function setOpenState(open: boolean, elements: NonNullable<ReturnType<typeof getElements>>) {
  isOpen = open;
  elements.toggle.checked = open;
  elements.menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  elements.toggle.setAttribute('aria-checked', open ? 'true' : 'false');
  elements.toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', open);
  refreshHeaderVisibility();
}

function getHeaderOffset(): number {
  return document.querySelector<HTMLElement>(SELECTORS.header)?.offsetHeight ?? 0;
}

function scrollToSection(hash: string): void {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: 'smooth' });
}

export function closeNavMenu(): Promise<void> {
  const elements = getElements();
  if (!elements || !isOpen) return Promise.resolve();

  activeTimeline?.kill();

  const { menu, panel, items, secondary } = elements;

  return new Promise((resolve) => {
    activeTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set(menu, { visibility: 'hidden', pointerEvents: 'none' });
        setOpenState(false, elements);
        activeTimeline = null;
        resolve();
      },
    });

    activeTimeline.to(
      [items, secondary],
      {
        y: -28,
        opacity: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: 'power2.in',
      },
      0,
    );

    activeTimeline.to(
      panel,
      {
        yPercent: -100,
        duration: 0.45,
        ease: 'power3.inOut',
      },
      0.1,
    );
  });
}

function openNavMenu() {
  const elements = getElements();
  if (!elements || isOpen) return;

  activeTimeline?.kill();

  const { menu, panel, items, secondary } = elements;

  setOpenState(true, elements);
  gsap.set(menu, { visibility: 'visible', pointerEvents: 'auto' });
  gsap.set(panel, { yPercent: -100 });
  gsap.set(items, { y: -36, opacity: 0 });
  gsap.set(secondary, { y: -20, opacity: 0 });

  activeTimeline = gsap.timeline({
    onComplete: () => {
      activeTimeline = null;
    },
  });

  activeTimeline.to(panel, {
    yPercent: 0,
    duration: 0.55,
    ease: 'power3.out',
  });

  activeTimeline.to(
    items,
    {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power3.out',
    },
    '-=0.2',
  );

  activeTimeline.to(
    secondary,
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    },
    '-=0.15',
  );
}

export function initNavMenu(): void {
  const elements = getElements();
  if (!elements) return;

  gsap.set(elements.panel, { yPercent: -100 });

  elements.toggle.addEventListener('change', () => {
    if (elements.toggle.checked) {
      openNavMenu();
    } else {
      void closeNavMenu();
    }
  });

  elements.menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = link.getAttribute('href');
      if (!hash) return;

      void closeNavMenu().then(() => {
        scrollToSection(hash);
        history.pushState(null, '', hash);
      });
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) void closeNavMenu();
  });
}

export function isNavMenuOpen(): boolean {
  return isOpen;
}
