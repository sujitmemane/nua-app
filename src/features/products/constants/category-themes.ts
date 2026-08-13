import { colors } from '@/theme/colors';

import { ALL_CATEGORY } from '../services/products-service';

export interface CategoryHeaderTheme {
  background: string;
  foreground: string;
  muted: string;
  searchBackground: string;
  searchText: string;
  searchPlaceholder: string;
  underline: string;
}

function makeSolidTheme(background: string): CategoryHeaderTheme {
  return {
    background,
    foreground: '#FFFFFF',
    muted: 'rgba(255,255,255,0.75)',
    searchBackground: colors.background,
    searchText: colors.textPrimary,
    searchPlaceholder: colors.textMuted,
    underline: '#FFFFFF',
  };
}

const THEMES = {
  all: makeSolidTheme(colors.primary),
  beauty: makeSolidTheme('#E0568A'),
  'skin-care': makeSolidTheme('#E0568A'),
  'womens-dresses': makeSolidTheme('#C73E7A'),
  'womens-bags': makeSolidTheme('#C73E7A'),
  'womens-shoes': makeSolidTheme('#C73E7A'),
  'womens-watches': makeSolidTheme('#C73E7A'),
  'womens-jewellery': makeSolidTheme('#C9A227'),
  fragrances: makeSolidTheme('#7C3AED'),
  sunglasses: makeSolidTheme('#D97706'),
  furniture: makeSolidTheme('#8B5E3C'),
  'home-decoration': makeSolidTheme('#A86B4B'),
  'kitchen-accessories': makeSolidTheme('#0F766E'),
  groceries: makeSolidTheme(colors.success),
  smartphones: makeSolidTheme('#2563EB'),
  laptops: makeSolidTheme('#1D4ED8'),
  tablets: makeSolidTheme('#2563EB'),
  'mobile-accessories': makeSolidTheme('#1E40AF'),
  'mens-shirts': makeSolidTheme('#1E3A5F'),
  'mens-shoes': makeSolidTheme('#1E3A5F'),
  'mens-watches': makeSolidTheme('#334155'),
  motorcycle: makeSolidTheme('#374151'),
  vehicle: makeSolidTheme('#374151'),
  'sports-accessories': makeSolidTheme('#15803D'),
  tops: makeSolidTheme('#DB2777'),
} satisfies Record<string, CategoryHeaderTheme>;

const FALLBACK_SOLIDS = [
  colors.primary,
  '#7C3AED',
  colors.success,
  '#2563EB',
  '#8B5E3C',
  '#D97706',
  '#0F766E',
];

function fallbackTheme(slug: string): CategoryHeaderTheme {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return makeSolidTheme(FALLBACK_SOLIDS[hash % FALLBACK_SOLIDS.length]);
}

export function getCategoryHeaderTheme(slug: string): CategoryHeaderTheme {
  if (slug === ALL_CATEGORY) return THEMES.all;
  return THEMES[slug as keyof typeof THEMES] ?? fallbackTheme(slug);
}

const SEARCH_HINTS: Record<string, string> = {
  [ALL_CATEGORY]: 'Search "atta, dal, coke"',
  beauty: 'Search "lipstick"',
  groceries: 'Search "atta, dal"',
  fragrances: 'Search "perfume"',
  furniture: 'Search "sofa"',
  smartphones: 'Search "phone"',
  laptops: 'Search "laptop"',
};

export function getCategorySearchPlaceholder(slug: string): string {
  return SEARCH_HINTS[slug] ?? `Search "${slug.replace(/-/g, ' ')}"`;
}
