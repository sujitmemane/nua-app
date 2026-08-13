import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { ALL_CATEGORY, productsService } from '../services/products-service';

const PAGE_SIZE = 12;

export const productKeys = {
  all: ['products'] as const,
  categories: ['products', 'categories'] as const,
  list: (search: string, category: string) => ['products', 'list', { search, category }] as const,
  detail: (id: number) => ['products', id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: productsService.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(search = '', category = ALL_CATEGORY) {
  return useInfiniteQuery({
    queryKey: productKeys.list(search, category),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productsService.getProducts({
        limit: PAGE_SIZE,
        skip: pageParam,
        search,
        category: search ? ALL_CATEGORY : category,
      }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.products),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
