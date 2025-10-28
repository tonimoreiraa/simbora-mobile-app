import {api} from '../api';
import {Product, ProductsResponse} from './schemas/products-response.schema';

const getCorrectImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return '';
  }
  if (imageUrl.includes('uploads/https://')) {
    return imageUrl.replace('https://api.rapdo.app/uploads/', '');
  }
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    return imageUrl;
  }
  return imageUrl;
};

export const getAllProducts = async (
  page: number = 1,
  perPage: number = 25,
  query?: string,
  categoryId?: number,
): Promise<{products: Product[]; total: number; currentPage: number}> => {
  try {
    const params: Record<string, any> = {
      page,
      perPage,
    };

    if (query) {
      params.query = query;
    }
    if (categoryId) {
      params.categoryId = categoryId;
    }

    const {data} = await api.get<ProductsResponse>('/products', {params});

    const productsWithFixedUrls = data.data.map(product => ({
      ...product,
      images: product.images.map(image => ({
        ...image,
        path: getCorrectImageUrl(image.path),
      })),
    }));

    return {
      products: productsWithFixedUrls,
      total: data.meta.total,
      currentPage: data.meta.current_page,
    };
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : new Error('Não foi possível carregar os produtos');
  }
};

export const getProducts = async (
  query?: string,
  categoryId?: number,
): Promise<Product[]> => {
  try {
    const {products} = await getAllProducts(1, 100, query, categoryId);
    return products;
  } catch (error) {
    throw error;
  }
};
