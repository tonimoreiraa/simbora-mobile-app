// use-orders.ts
import { useQuery } from 'react-query';
import { getAllOrders, getOrders, getOrderById } from './get-all-orders';
import { Order } from './schemas/orders-response.schema';

interface OrdersQueryParams {
  page?: number;
  perPage?: number;
  status?: string;
}

interface OrdersQueryResult {
  orders: Order[];
  total: number;
  currentPage: number;
}

export const useGetAllOrders = (params: OrdersQueryParams = {}) => {
  const { page = 1, perPage = 50, status } = params;
  
  return useQuery<OrdersQueryResult>(
    ['orders', page, perPage, status],
    () => getAllOrders(page, perPage, status),
    {
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }
  );
};

export const useOrders = (status?: string) => {
  return useQuery<Order[]>(
    ['orders-simple', status],
    () => getOrders(status),
    {
      staleTime: 5 * 60 * 1000
    }
  );
};

export const useOrderById = (id: number) => {
  return useQuery<Order>(
    ['order', id],
    () => getOrderById(id),
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!id
    }
  );
};

export const useOrdersByStatus = (status: string) => {
  return useOrders(status);
};