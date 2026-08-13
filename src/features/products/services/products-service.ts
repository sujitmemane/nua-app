import { AxiosError } from 'axios';

import { MOCK_OFFLINE } from '@/lib/offline-mock';
import { apiClient } from '@/services';

import type { Product, ProductCategory, ProductsResponse } from '../types';
import { isDefaultFirstPage, loadFirstPage, saveFirstPage } from './products-cache';
import { applyProductsMock, PRODUCTS_API_MOCK } from './products-mock';

const PRODUCTS_ENDPOINT =
  process.env.EXPO_PUBLIC_PRODUCTS_URL ?? 'https://dummyjson.com/products';

export const ALL_CATEGORY = 'all';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  signal?: AbortSignal;
}

export const productsService = {
  async getCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
    const { data } = await apiClient.get<ProductCategory[]>(`${PRODUCTS_ENDPOINT}/categories`, {
      signal,
    });
    return data;
  },

  async getProducts({
    limit = 12,
    skip = 0,
    search = '',
    category = ALL_CATEGORY,
    signal,
  }: GetProductsParams = {}): Promise<ProductsResponse> {
    const hasSearch = Boolean(search);
    const hasCategory = Boolean(category && category !== ALL_CATEGORY);

    try {
      await applyProductsMock(PRODUCTS_API_MOCK, signal);

      if (MOCK_OFFLINE) {
        throw new AxiosError('Network Error', AxiosError.ERR_NETWORK);
      }

      if (hasSearch && hasCategory) {
        const { data } = await apiClient.get<ProductsResponse>(`${PRODUCTS_ENDPOINT}/search`, {
          params: { q: search, limit: 0 },
          signal,
        });
        const products = data.products.filter((product) => product.category === category);
        return {
          products,
          total: products.length,
          skip: 0,
          limit: products.length,
        };
      }

      const endpoint = hasSearch
        ? `${PRODUCTS_ENDPOINT}/search`
        : hasCategory
          ? `${PRODUCTS_ENDPOINT}/category/${category}`
          : PRODUCTS_ENDPOINT;

      const { data } = await apiClient.get<ProductsResponse>(endpoint, {
        params: hasSearch ? { q: search, limit, skip } : { limit, skip },
        signal,
      });

      if (isDefaultFirstPage(search, category, skip)) {
        await saveFirstPage(data);
      }

      return data;
    } catch (error) {
      if (signal?.aborted) throw error;
      if (PRODUCTS_API_MOCK !== 'off') throw error;
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

  async getProductById(id: number, signal?: AbortSignal): Promise<Product> {
    const { data } = await apiClient.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`, { signal });
    return data;
  },
};
