import {z} from 'zod';

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().max(255),
  image: z.string().url().max(255),
  category_id: z.number().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesResponseSchema = z.array(categorySchema);
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
