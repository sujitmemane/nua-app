import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ProductsResponse } from '../types';

const FIRST_PAGE_KEY = 'nua-products-first-page';

export function isDefaultFirstPage(search: string, category: string, skip: number) {
  return !search && skip === 0 && (!category || category === 'all');
}

export async function saveFirstPage(response: ProductsResponse) {
  await AsyncStorage.setItem(FIRST_PAGE_KEY, JSON.stringify(response));
}

export async function loadFirstPage(): Promise<ProductsResponse | null> {
  const raw = await AsyncStorage.getItem(FIRST_PAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ProductsResponse;
  } catch {
    return null;
  }
}
