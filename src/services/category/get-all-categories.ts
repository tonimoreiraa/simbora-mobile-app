import {api} from '../api';
import {Category} from './schemas/categories-response.schema';

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

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const {data} = await api.get<Category[]>('/categories');

    const categoriesWithFixedUrls = data.map(category => ({
      ...category,
      image: getCorrectImageUrl(category.image),
    }));

    return categoriesWithFixedUrls;
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : new Error('Não foi possível carregar as categorias');
  }
};
