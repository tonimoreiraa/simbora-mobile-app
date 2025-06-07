import {z} from 'zod';

export const productImageSchema = z.object({
  id: z.number(),
  productId: z.number(),
  path: z.string(),
});

export const supplierSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  supplierId: z.number(),
  categoryId: z.number(),
  tags: z.array(z.string()).nullable(),
  stock: z.number(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  images: z.array(productImageSchema),
  supplier: supplierSchema,
});

export const metaSchema = z.object({
  total: z.number(),
  per_page: z.number(),
  current_page: z.number(),
});

export const productsResponseSchema = z.object({
  meta: metaSchema,
  data: z.array(productSchema),
});

export type ProductImage = z.infer<typeof productImageSchema>;
export type Supplier = z.infer<typeof supplierSchema>;
export type Product = z.infer<typeof productSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
