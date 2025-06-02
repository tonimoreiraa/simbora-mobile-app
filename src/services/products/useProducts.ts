import {useQuery} from 'react-query';
import {getProducts, getAllProducts} from './get-all-products';
import {Product} from './schemas/products-response.schema';

interface ProductsQueryParams {
  page?: number;
  perPage?: number;
  query?: string;
  categoryId?: number;
}

interface ProductsQueryResult {
  products: Product[];
  total: number;
  currentPage: number;
}

export const useGetAllProducts = (params: ProductsQueryParams = {}) => {
  const {page = 1, perPage = 25, query, categoryId} = params;

  return useQuery<ProductsQueryResult>(
    ['products', page, perPage, query, categoryId],
    () => getAllProducts(page, perPage, query, categoryId),
    {
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true,
    },
  );
};

export const useProducts = (
  params: Pick<ProductsQueryParams, 'query' | 'categoryId'> = {},
) => {
  const {query, categoryId} = params;

  return useQuery<Product[]>(
    ['products-simple', query, categoryId],
    () => getProducts(query, categoryId),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useProductsByCategory = (categoryId: number) => {
  return useProducts({categoryId});
};

export const useProductSearch = (searchQuery: string) => {
  return useProducts({query: searchQuery});
};
