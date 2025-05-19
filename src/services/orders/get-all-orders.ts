import { api } from '../api';
import { Order, OrdersResponse } from './schemas/orders-response.schema';

export const getAllOrders = async (
  page: number = 1,
  perPage: number = 50,
  status?: string
): Promise<{orders: Order[], total: number, currentPage: number}> => {
  try {
    const params: Record<string, any> = {
      page,
      perPage
    };
    
    if (status) params.status = status;
    
    const { data } = await api.get<OrdersResponse>('/orders', { params });
    
    return {
      orders: data.data,
      total: data.meta.total,
      currentPage: data.meta.current_page
    };
  } catch (error: any) {
    console.error('Erro ao buscar pedidos:', error);
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : new Error('Não foi possível carregar os pedidos');
  }
};

export const getOrders = async (
  status?: string
): Promise<Order[]> => {
  try {
    const { orders } = await getAllOrders(1, 100, status);
    return orders;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<Order> => {
  try {
    const { data } = await api.get<{data: Order}>(`/orders/${id}`);
    return data.data;
  } catch (error: any) {
    console.error(`Erro ao buscar pedido #${id}:`, error);
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : new Error('Não foi possível carregar o pedido');
  }
};