import { apiClient } from '@/services';

import type { Product, ProductCategory, ProductsResponse } from '../types';
import { isDefaultFirstPage, loadFirstPage, saveFirstPage } from './products-cache';

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products';

export const ALL_CATEGORY = 'all';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
}

/**
 * Data access for the products feature, backed by the dummyjson API.
 * Absolute URLs are used so this works regardless of the shared axios baseURL.
 */
export const productsService = {
  async getCategories(): Promise<ProductCategory[]> {
    const { data } = await apiClient.get<ProductCategory[]>(`${PRODUCTS_ENDPOINT}/categories`);
    return data;
  },

  async getProducts({
    limit = 12,
    skip = 0,
    search = '',
    category = ALL_CATEGORY,
  }: GetProductsParams = {}): Promise<ProductsResponse> {
    const endpoint = search
      ? `${PRODUCTS_ENDPOINT}/search`
      : category && category !== ALL_CATEGORY
        ? `${PRODUCTS_ENDPOINT}/category/${category}`
        : PRODUCTS_ENDPOINT;

    try {
      const { data } = await apiClient.get<ProductsResponse>(endpoint, {
        params: search ? { q: search, limit, skip } : { limit, skip },
      });

      if (isDefaultFirstPage(search, category, skip)) {
        await saveFirstPage(data);
      }

      return data;
    } catch (error) {
      if (!isDefaultFirstPage(search, category, skip)) throw error;

      const cached = await loadFirstPage();
      if (!cached) throw error;

      return {
        ...cached,
        total: cached.products.length,
        skip: 0,
        limit: cached.products.length,
      };
    }
  },

  async getProductById(id: number): Promise<Product> {
    const { data } = await apiClient.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
    return data;
  },
};
