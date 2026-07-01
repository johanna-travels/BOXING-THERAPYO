import { focusBox } from '@/data/focusbox';

const BENTO_BASE = 'https://saree-fashion.vercel.app/assets/home-page/bento';
const HERO_BASE = 'https://saree-fashion.vercel.app/assets/home-page/hero-slider';

export type BentoVariant = 'item-1' | 'item-2' | 'item-3' | 'item-4';
export type BentoReveal = 'left' | 'right';

export type BentoItemData =
  | {
      id: string;
      variant: BentoVariant;
      type: 'image';
      image: string;
      imageAlt: string;
      reveal: BentoReveal;
    }
  | {
      id: string;
      variant: BentoVariant;
      type: 'text';
      title: string;
      description: string;
      reveal: BentoReveal;
    };

export const bentoItems: BentoItemData[] = [
  {
    id: 'fashion-show',
    variant: 'item-1',
    type: 'image',
    image: `${BENTO_BASE}/gird-1.png`,
    imageAlt: 'FocusBox session',
    reveal: 'left',
  },
  {
    id: 'timeless-heritage',
    variant: 'item-2',
    type: 'text',
    title: 'FocusBox Method',
    description: focusBox.tagline,
    reveal: 'right',
  },
  {
    id: 'detail-view',
    variant: 'item-3',
    type: 'image',
    image: `${HERO_BASE}/Website-Banner-3.jpg`,
    imageAlt: 'Breath and recovery drill',
    reveal: 'left',
  },
  {
    id: 'texture',
    variant: 'item-4',
    type: 'image',
    image: `${BENTO_BASE}/gird-2.png`,
    imageAlt: 'Boxing-inspired training',
    reveal: 'right',
  },
];
