import {z} from 'zod';

// Schema base para endereço de usuário
export const userAddressSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  streetName: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  complement: z.string().nullable().optional(),
  country: z.string().default('Brasil'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Schema para criação de endereço (campos obrigatórios)
export const createUserAddressSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  streetName: z.string().min(1, 'Nome da rua é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  complement: z.string().optional(),
  country: z.string().optional().default('Brasil'),
});

// Schema para atualização de endereço (todos os campos opcionais)
export const updateUserAddressSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  streetName: z.string().min(1, 'Nome da rua é obrigatório').optional(),
  number: z.string().min(1, 'Número é obrigatório').optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório').optional(),
  city: z.string().min(1, 'Cidade é obrigatória').optional(),
  state: z.string().min(1, 'Estado é obrigatório').optional(),
  zipCode: z.string().min(1, 'CEP é obrigatório').optional(),
  complement: z.string().optional(),
  country: z.string().optional(),
});

// Schema para parâmetros da rota (ID do endereço)
export const userAddressParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

// Schema de metadados para paginação
export const metaSchema = z.object({
  total: z.number(),
  per_page: z.number(),
  current_page: z.number(),
});

// Schema para resposta de lista de endereços
export const userAddressesResponseSchema = z.object({
  meta: metaSchema.optional(),
  data: z.array(userAddressSchema),
});

// Schema para resposta de endereço único
export const userAddressResponseSchema = z.object({
  data: userAddressSchema,
});

// Schema para resposta de deleção
export const deleteUserAddressResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Types inferidos dos schemas
export type UserAddress = z.infer<typeof userAddressSchema>;
export type CreateUserAddress = z.infer<typeof createUserAddressSchema>;
export type UpdateUserAddress = z.infer<typeof updateUserAddressSchema>;
export type UserAddressParams = z.infer<typeof userAddressParamsSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type UserAddressesResponse = z.infer<typeof userAddressesResponseSchema>;
export type UserAddressResponse = z.infer<typeof userAddressResponseSchema>;
export type DeleteUserAddressResponse = z.infer<
  typeof deleteUserAddressResponseSchema
>;
