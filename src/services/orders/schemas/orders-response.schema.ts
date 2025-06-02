// schemas/orders-response.schema.ts
import {z} from 'zod';

export const OrderStatusEnum = z.enum([
  'Pending',
  'Confirmed',
  'Processing',
  'On Hold',
  'Awaiting Payment',
  'Payment Received',
  'In Production',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Completed',
  'Cancelled',
  'Refunded',
  'Failed',
  'Returned',
  'Partially Shipped',
  'Backordered',
]);
export const OrderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  price: z.number(),
  product: z
    .object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      description: z.string().optional(),
      images: z
        .array(
          z.object({
            id: z.number(),
            path: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const PaymentSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  method: z.string(),
  status: z.string(),
  amount: z.number(),
  transactionId: z.string().optional(),
});

export const ShippingSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  trackingNumber: z.string().optional(),
});

export const OrderUpdateSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  status: OrderStatusEnum,
  comment: z.string().optional(),
  createdAt: z.string().or(z.date()),
});

export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  status: OrderStatusEnum,
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  customer: CustomerSchema.optional(),
  items: z.array(OrderItemSchema).optional(),
  payment: PaymentSchema.optional(),
  shipping: ShippingSchema.optional(),
  updates: z.array(OrderUpdateSchema).optional(),
});

export const OrdersResponseSchema = z.object({
  data: z.array(OrderSchema),
  meta: z.object({
    total: z.number(),
    current_page: z.number(),
    per_page: z.number(),
    last_page: z.number(),
  }),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type Shipping = z.infer<typeof ShippingSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
export type OrdersResponse = z.infer<typeof OrdersResponseSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
