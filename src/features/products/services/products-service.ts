import { apiClient, hasApiUrl } from '@/services';
import { delay } from '@/utils';

import type { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aurora Lamp',
    description: 'Warm ambient lighting with adjustable color temperature.',
    price: 89,
    currency: 'USD',
  },
  {
    id: 'p2',
    name: 'Nimbus Speaker',
    description: 'Compact wireless speaker with room-filling sound.',
    price: 129,
    currency: 'USD',
  },
  {
    id: 'p3',
    name: 'Terra Bottle',
    description: 'Insulated bottle that keeps drinks cold for 24 hours.',
    price: 34,
    currency: 'USD',
  },
];

/**
 * Data access for the products feature. Uses axios against the configured
 * backend, and falls back to mock data when no `EXPO_PUBLIC_API_URL` is set.
 */
export const productsService = {
  async getProducts(): Promise<Product[]> {
    if (!hasApiUrl) {
      await delay(600);
      return MOCK_PRODUCTS;
    }
    const { data } = await apiClient.get<Product[]>('/products');
    return data;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    if (!hasApiUrl) {
      await delay(300);
      return MOCK_PRODUCTS.find((product) => product.id === id);
    }
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },
};
