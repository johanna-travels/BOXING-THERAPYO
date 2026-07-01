const ASSET_BASE = 'https://saree-fashion.vercel.app/assets/home-page/hero-slider';

export type Collection = {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  href: string;
};

export const collections: Collection[] = [
  {
    id: 'bridal-elegance',
    image: `${ASSET_BASE}/Website-Banner-5.png`,
    imageAlt: 'Bridal Collection',
    title: 'Bridal Elegance',
    href: '#',
  },
  {
    id: 'evening-glamour',
    image: `${ASSET_BASE}/Website-Banner-4.jpg`,
    imageAlt: 'Party Wear',
    title: 'Evening Glamour',
    href: '#',
  },
  {
    id: 'handloom-heritage',
    image: `${ASSET_BASE}/Website-Banner-2.jpg`,
    imageAlt: 'Handloom Heritage',
    title: 'Handloom Heritage',
    href: '#',
  },
];
