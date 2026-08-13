import { apiClient } from '@/services';

import type { Product, ProductsResponse } from '../types';

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products';

export interface GetProductsParams {
  limit?: number;
  skip?: number;

  search?: string;
}

/**
 * Data access for the products feature, backed by the dummyjson API.
 * Absolute URLs are used so this works regardless of the shared axios baseURL.
 */
export const productsService = {
  async getProducts({ limit = 10, skip = 0, search = '' }: GetProductsParams = {}): Promise<ProductsResponse> {
    const endpoint = search ? `${PRODUCTS_ENDPOINT}/search` : PRODUCTS_ENDPOINT;
    const { data } = await apiClient.get<ProductsResponse>(endpoint, {
      params: search ? { q: search, limit, skip } : { limit, skip },
    });
    return data;
  },

  async getProductById(id: number): Promise<Product> {
    const { data } = await apiClient.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
    return data;
  },
};
