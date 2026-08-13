import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { productsService } from '../services/products-service';

const PAGE_SIZE = 10;

export const productKeys = {
  all: ['products'] as const,
  list: (search: string) => ['products', 'list', search] as const,
  detail: (id: number) => ['products', id] as const,
};

export function useProducts(search = '') {
  return useInfiniteQuery({
    queryKey: productKeys.list(search),
    initialPageParam: 0,
    queryFn: (params) => {
      console.log('queryFn params', params);
      return productsService.getProducts({ limit: PAGE_SIZE, skip: params.pageParam, search });
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    select: (data) =>
      data.pages.flatMap((page) => {
        console.log('page');
        return page.products;
      }),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
