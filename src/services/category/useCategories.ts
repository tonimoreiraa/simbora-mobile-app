// hooks/useCategories.js
import { useQuery } from 'react-query';
import { getAllCategories } from './get-all-categories';

interface Category {
  id: number;
  name: string;
  image: string;
}

export const useGetAllCategories = () => {
  return useQuery<Category[]>(
    ['categories'],
    () => getAllCategories(),
    {
      staleTime: 5 * 60 * 1000
    }
  );
};