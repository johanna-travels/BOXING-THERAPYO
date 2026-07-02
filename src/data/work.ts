export interface WorkCard {
  id: string;
  index: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

export const workSection = {
  eyebrow: 'What We Do',
  headline: 'Our Works',
} as const;

// TODO: swap image URLs for your own brand assets.
export const workCards: WorkCard[] = [
  {
    id: 'content-creation',
    index: '01',
    title: 'Content Creation',
    description:
      'Scroll-stopping video, photo, and design built for the feed. From concept to final cut, we produce content that looks native and performs.',
    cta: { label: 'Learn more', href: '#contact' },
    image: {
      src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
      alt: 'Creator filming content with a camera setup',
    },
  },
  {
    id: 'influencer-marketing',
    index: '02',
    title: 'Influencer Marketing',
    description:
      'The right creators, the right message, real results. We match your brand with voices your audience already trusts and manage the whole partnership.',
    cta: { label: 'Learn more', href: '#contact' },
    image: {
      src: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=1600&q=80',
      alt: 'Influencer recording a video on a smartphone',
    },
  },
  {
    id: 'social-media-marketing',
    index: '03',
    title: 'Social Media Marketing',
    description:
      'Strategy, publishing, and paid campaigns that grow reach and revenue. We turn analytics into a content engine that keeps compounding.',
    cta: { label: 'Learn more', href: '#contact' },
    image: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
      alt: 'Marketing analytics dashboard on a laptop',
    },
  },
];
