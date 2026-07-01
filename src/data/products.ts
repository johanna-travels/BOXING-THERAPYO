const ASSET_BASE = 'https://saree-fashion.vercel.app/assets/home-page/card';

export type Product = {
  id: string;
  image: string;
  imageAlt: string;
  category: string;
  name: string;
};

export const products: Product[] = [
  {
    id: 'ethereal-gold-banarasi',
    image: `${ASSET_BASE}/card.png`,
    imageAlt: 'Ethereal Gold Banarasi saree',
    category: 'Silk Collection',
    name: 'Ethereal Gold Banarasi',
  },
  {
    id: 'regal-maroon-bridal',
    image: `${ASSET_BASE}/Website-Banner-6.jpg`,
    imageAlt: 'Regal Maroon Bridal saree',
    category: 'Bridal Wear',
    name: 'Regal Maroon Bridal',
  },
  {
    id: 'midnight-georgette',
    image: `${ASSET_BASE}/card-3.png`,
    imageAlt: 'Midnight Georgette saree',
    category: 'Modern Drape',
    name: 'Midnight Georgette',
  },
  {
    id: 'elegant-kanjeevaram',
    image: `${ASSET_BASE}/card-2.png`,
    imageAlt: 'Elegant Kanjeevaram saree',
    category: 'Classic Weave',
    name: 'Elegant Kanjeevaram',
  },
];
