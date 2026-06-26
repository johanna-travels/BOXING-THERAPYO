export const primaryNav = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
  { label: 'Jobs', href: '#jobs' },
] as const;

export const socialNav = [
  { label: 'IG', href: 'https://instagram.com', external: true },
  { label: 'TW', href: 'https://twitter.com', external: true },
  { label: 'LI', href: 'https://linkedin.com', external: true },
  { label: 'FB', href: 'https://facebook.com', external: true },
] as const;

export const ctaNav = {
  label: "Let's start a project",
  href: '#contact',
} as const;

export const sections = [
  { id: 'hero', title: 'Home' },
  { id: 'services', title: 'Services' },
  { id: 'work', title: 'Work' },
  { id: 'about', title: 'About' },
  { id: 'journal', title: 'Journal' },
  { id: 'contact', title: 'Contact' },
  { id: 'jobs', title: 'Jobs' },
] as const;
