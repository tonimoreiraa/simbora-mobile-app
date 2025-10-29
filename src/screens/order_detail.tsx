import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import {
  CaretLeft,
  CheckCircle,
  Package,
  Truck,
  Star,
  CreditCard,
} from 'phosphor-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useGetOrdersId} from '../services/client/orders/orders';
import {useGetOrdersOrderIdActivityLogs} from '../services/client/order-activity-logs/order-activity-logs';
import {getCorrectImageUrl} from '../utils/image';
import Price from '../components/price';
import {ChatCard} from '../components/chat_card';

const OrderRating = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
        Avalie seu pedido
      </Text>

      <View style={tw`bg-white border border-gray-200 rounded-xl p-5`}>
        <View style={tw`flex-row justify-center items-center gap-1 mb-4`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={tw`p-2`}
            >
              <Star
                size={28}
                color={star <= rating ? "#3b82f6" : "#d1d5db"}
                weight={star <= rating ? "fill" : "regular"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`flex-row justify-between items-center px-2`}>
          <Text style={tw`text-xs text-gray-500`}>Ruim</Text>
          <Text style={tw`text-xs text-gray-500`}>Excelente</Text>
        </View>
      </View>
    </View>
  );
};

interface OrderDetailParams {
  orderId: string | number;
}

const OrderItemCard = ({ item }: { item: any }) => {
  // Preferir imagem que já vem no item do pedido; fallback para null
  const productImage = item?.product?.images?.length
    ? getCorrectImageUrl(item.product.images[0]?.path || '')
    : null;

  // Use unitPrice from API, fallback to product price
  const unitPrice = Number(item?.unitPrice ?? item?.product?.price ?? 0);
  const quantity = Number(item?.quantity ?? 1);
  // Use totalPrice from API if available
  const totalPrice = item?.totalPrice ? Number(item.totalPrice) : (unitPrice * quantity);

  return (
    <View
      style={tw`flex-row bg-white border border-gray-200 rounded-xl p-3 mb-3 items-center w-full`}>
      <View style={tw`bg-gray-50 p-2 rounded-xl`}>
        <Image
          source={{uri: productImage || undefined}}
          width={80}
          height={80}
          resizeMode="contain"
        />
      </View>
      <View style={tw`ml-4 flex-1`}>
        <Text style={tw`text-base font-semibold text-gray-900 mb-1`}>
          {item.product?.name || 'Carregando...'}
        </Text>
        {item.productVariant && (
          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-xs text-gray-500 mr-1`}>Variante:</Text>
            <Text style={tw`text-xs font-semibold text-gray-700`}>
              {item.productVariant.value}
              {item.productVariant.unit && ` (${item.productVariant.unit})`}
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text style={tw`text-sm text-gray-600`}>Qtd: {quantity}</Text>
          <View>
            <Text style={tw`text-lg text-gray-900 font-bold`}>
              {totalPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            {quantity > 1 && (
              <Text style={tw`text-xs text-gray-500 text-right`}>
                {unitPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })} cada
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

function OrderDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params as OrderDetailParams;

  const {data: order, isLoading, error} = useGetOrdersId(Number(orderId));

  // Order activity logs (separate endpoint) - fallback if updates not in order
  const {
    data: orderActivityLogs,
    isLoading: isLoadingOrderActivityLogs,
  } = useGetOrdersOrderIdActivityLogs(Number(orderId), undefined, {
    query: {retry: false},
  });

  // Debug logs removidos para evitar poluição do console

  if (isLoading) {
    return (
      <SafeAreaView style={tw`bg-white flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-500`}>Carregando pedido...</Text>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={tw`bg-white flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Erro ao carregar pedido</Text>
      </SafeAreaView>
    );
  }

  // Get status badge styling (same logic as orders list)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          style: 'bg-blue-50 border border-blue-500',
          textColor: 'text-blue-600',
          icon: CheckCircle,
          iconColor: '#3b82f6',
        };
      case 'Delivered':
        return {
          style: 'bg-orange-50 border border-orange-500',
          textColor: 'text-orange-600',
          icon: Package,
          iconColor: '#f97316',
        };
      default:
        return {
          style: 'bg-white border border-gray-300',
          textColor: 'text-gray-700',
          icon: Truck,
          iconColor: '#6b7280',
        };
    }
  };

  const statusBadge = getStatusBadge(order.status || '');
  const StatusIcon = statusBadge.icon;

  // Get order details text (items count + shipping info if available)
  const getOrderDetailsText = () => {
    // Soma a quantidade real dos itens (não apenas o número de linhas)
    const totalQty = Array.isArray(order.items)
      ? order.items.reduce((acc: number, it: any) => acc + Number(it?.quantity ?? 1), 0)
      : 0;
    const itemsText = totalQty === 1 ? '1 Item' : `${totalQty} Itens`;

    return itemsText;
  };

  // Helper: translate status coming from activity logs to pt-BR human text
  const translateActivityStatus = (status?: string | null) => {
    if (!status) return '';
    const s = String(status).toLowerCase();
    switch (s) {
      case 'completed':
      case 'entregue':
        return 'Entregue';
      case 'delivered':
      case 'retirada':
        return 'Retirada';
      case 'shipped':
      case 'em rota':
        return 'Em rota';
      case 'out for delivery':
      case 'out_for_delivery':
        return 'Em rota';
      case 'processing':
      case 'processando':
        return 'Processando';
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'awaiting payment':
      case 'awaiting_payment':
        return 'Pendente';
      case 'confirmed':
      case 'confirmado':
        return 'Confirmado';
      case 'canceled':
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado';
      default:
        // Capitalize first letter to look nicer
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  // Create timeline with updates from order.updates (API) + fallback to activity logs
  const renderTimeline = () => {
    const logs: Array<{
      title: string;
      description: string;
      date: string;
      isOrderActivity?: boolean;
      isShipping?: boolean;
      isOrderCreation?: boolean;
    }> = [];
    let hasCreatedLog = false;

    // First, use order.updates from the API (primary source)
    if (order?.updates && Array.isArray(order.updates) && order.updates.length > 0) {
      order.updates.forEach((update: any) => {
        if (!update?.createdAt) return;

        // Skip private updates
        if (update.private === true) return;

        const title = update.title || translateActivityStatus(update.status) || 'Atualização';
        const description = update.comment || '';

        logs.push({
          title,
          description,
          date: update.createdAt,
          isOrderActivity: true,
        });
      });
    }

    // Fallback: if no updates in order, use orderActivityLogs endpoint
    if (logs.length === 0 && orderActivityLogs && Array.isArray(orderActivityLogs)) {
      orderActivityLogs.forEach((log: any) => {
        if (!log?.createdAt) return;

        const action = String(log?.action || '').toLowerCase();

        if (action === 'created') {
          hasCreatedLog = true;
          logs.push({
            title: 'Pedido feito',
            description: '',
            date: log.createdAt,
            isOrderActivity: true,
            isOrderCreation: true,
          });
          return;
        }

        if (action === 'status_changed' || action === 'status-changed') {
          const oldLabel = translateActivityStatus(log?.oldStatus);
          const newLabel = translateActivityStatus(log?.newStatus);
          const detail = `Status do pedido atualizado de "${oldLabel}" para "${newLabel}"`;

          logs.push({
            title: detail,
            description: '',
            date: log.createdAt,
            isOrderActivity: true,
          });
          return;
        }

        // Default/custom activities
        const humanize = (s: string) => {
          const cleaned = s.replace(/[_-]+/g, ' ').trim();
          return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        };
        const text = (log?.description as string) || humanize(String(log?.action || 'Atividade'));
        logs.push({
          title: text,
          description: '',
          date: log.createdAt,
          isOrderActivity: true,
        });
      });
    }

    // Fallback: if API didn't return a created log, add it using order.createdAt
    if (!hasCreatedLog && order?.createdAt) {
      logs.push({
        title: 'Pedido feito',
        description: '',
        date: order.createdAt,
        isOrderCreation: true,
      });
    }

    // Sort logs by date (newest first)
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Format date to "31 de Julho às 17h12"
    const formatLogDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('pt-BR', { month: 'long' });
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)} às ${hours}h${minutes}`;
    };

    return (
      <View style={tw`bg-white border border-gray-200 rounded-xl p-5`}>
        <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
          Acompanhamento
        </Text>
        {isLoadingOrderActivityLogs ? (
          <Text style={tw`text-gray-500 text-center py-4`}>
            Carregando atividades...
          </Text>
        ) : logs.length > 0 ? (
          logs.map((log, index) => (
            <View key={index} style={tw`flex-row items-start ${index < logs.length - 1 ? 'mb-5' : ''}`}>
              {/* Timeline dot */}
              <View style={tw`w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4`} />

              {/* Content */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-base text-gray-900 font-semibold mb-1`}>
                  {log.title}
                </Text>
                {log.description && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    {log.description}
                  </Text>
                )}
                <Text style={tw`text-sm text-gray-500`}>
                  {formatLogDate(log.date)}
                </Text>
              </View>

              {/* Vertical line connecting dots */}
              {index < logs.length - 1 && (
                <View style={tw`absolute left-1.5 top-6 w-0.5 h-full bg-gray-300`} />
              )}
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-500 text-center py-4`}>
            Nenhuma atividade registrada ainda
          </Text>
        )}
      </View>
    );
  };

  // Format order ID with SKU- prefix
  const formatOrderId = (id: number | undefined) => {
    if (!id) return 'SKU-0000';
    return `SKU-${id.toString().padStart(4, '0')}`;
  };

  // Status text mapping
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Entregue';
      case 'Delivered':
        return 'Retirada';
      case 'Confirmed':
        return 'Confirmado';
      case 'Shipped':
        return 'Em rota';
      case 'Out for Delivery':
        return 'Em rota';
      case 'Processing':
        return 'Processando';
      case 'Pending':
      case 'Awaiting Payment':
        return 'Pendente';
      case 'Canceled':
      case 'Cancelled':
        return 'Cancelado';
      default:
        return status || 'Pendente';
    }
  };

  // Totals from API response
  const subtotal = Number(order?.subtotalPrice ?? 0);
  const total = Number(order?.totalPrice ?? 0);
  const shippingAmount = Number(order?.shippingPrice ?? 0);
  const discount = Number(order?.discountPrice ?? 0);

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-stone-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}>
          <CaretLeft size={24} color="#000000" weight="bold" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold`}>Meu Pedido</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView style={tw`flex-1 px-6 py-6`} showsVerticalScrollIndicator={false}>
        {/* Order Info Card */}
        <View style={tw`bg-white border border-gray-200 rounded-xl p-5 mb-4`}>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <View>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Pedido</Text>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                {formatOrderId(order.id)}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              style={tw`flex-row items-center ${statusBadge.style} px-3 py-2 rounded-full`}>
              <StatusIcon
                size={16}
                color={statusBadge.iconColor}
                weight="fill"
                style={tw`mr-2`}
              />
              <Text style={tw`text-sm font-semibold ${statusBadge.textColor}`}>
                {getStatusText(order.status || '')}
              </Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={tw`bg-gray-50 rounded-lg py-3 px-4`}>
            <Text style={tw`text-center text-gray-700 text-sm font-medium`}>
              {getOrderDetailsText()}
            </Text>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={tw`mb-6`}>
          {renderTimeline()}
        </View>

        {/* Product Cards */}
        {order.items && order.items.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
              Itens do Pedido
            </Text>
            {order.items.map((item: any, index: number) => (
              <OrderItemCard key={index} item={item} />
            ))}
          </View>
        )}

        {/* Order Price Summary */}
        {order && (
          <View style={tw`mb-6`}>
            <Price
              subTotal={subtotal}
              discount={discount}
              shipping={shippingAmount}
              total={total}
            />
          </View>
        )}

        {/* Order Rating */}
        <OrderRating />

        {/* Payment Info */}
        {order?.payment && (
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <CreditCard size={20} color="#6B7280" weight="bold" />
              <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                Informações de Pagamento
              </Text>
            </View>

            {/* Payment Method */}
            <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Método de Pagamento</Text>
              <Text style={tw`text-base text-gray-900 font-semibold`}>
                {order.payment.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                {order.payment.paymentMethod === 'debit_card' && 'Cartão de Débito'}
                {order.payment.paymentMethod === 'pix' && 'PIX'}
                {order.payment.paymentMethod === 'boleto' && 'Boleto'}
                {!['credit_card', 'debit_card', 'pix', 'boleto'].includes(order.payment.paymentMethod || '') &&
                  (order.payment.paymentMethod || 'Não informado')}
              </Text>
            </View>

            {/* Payment Status */}
            <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Status do Pagamento</Text>
              <Text style={tw`text-base ${
                order.payment.status === 'paid' ? 'text-green-600' :
                order.payment.status === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              } font-semibold`}>
                {order.payment.status === 'paid' && 'Pago'}
                {order.payment.status === 'pending' && 'Pendente'}
                {order.payment.status === 'failed' && 'Falhou'}
                {order.payment.status === 'refunded' && 'Reembolsado'}
                {!['paid', 'pending', 'failed', 'refunded'].includes(order.payment.status || '') &&
                  (order.payment.status || 'Não informado')}
              </Text>
            </View>

            {/* Payment Amount */}
            <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Valor do Pagamento</Text>
              <Text style={tw`text-base text-gray-900 font-semibold`}>
                {Number(order.payment.price || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
            </View>

            {/* Payment Provider */}
            {order.payment.paymentProvider && (
              <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
                <Text style={tw`text-xs text-gray-500 mb-1`}>Processador</Text>
                <Text style={tw`text-base text-gray-900 font-semibold capitalize`}>
                  {order.payment.paymentProvider}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Shipping Info */}
        {order?.shipping && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
              Informações de Entrega
            </Text>

            {/* Shipping Address */}
            <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Endereço</Text>
              <Text style={tw`text-base text-gray-900 font-medium`}>
                {order.shipping.address}
              </Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                {order.shipping.city} - {order.shipping.state}
              </Text>
              <Text style={tw`text-sm text-gray-600`}>
                CEP: {order.shipping.zipCode}
              </Text>
            </View>

            {/* Shipping Provider */}
            {order.shipping.provider && (
              <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
                <Text style={tw`text-xs text-gray-500 mb-1`}>Transportadora</Text>
                <Text style={tw`text-base text-gray-900 font-semibold`}>
                  {order.shipping.provider}
                </Text>
              </View>
            )}

            {/* Tracking Code */}
            {order.shipping.shippingCode && (
              <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
                <Text style={tw`text-xs text-gray-500 mb-1`}>Código de Rastreamento</Text>
                <Text style={tw`text-base text-gray-900 font-semibold`}>
                  {order.shipping.shippingCode}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Order Type */}
        {order?.type && (
          <View style={tw`mb-6`}>
            <View style={tw`bg-white border border-gray-200 rounded-xl p-4`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Tipo de Entrega</Text>
              <Text style={tw`text-base text-gray-900 font-semibold`}>
                {order.type === 'delivery' && 'Entrega em Domicílio'}
                {order.type === 'pickup' && 'Retirada no Local'}
                {!['delivery', 'pickup'].includes(order.type) && order.type}
              </Text>
            </View>
          </View>
        )}

        {/* Chat Card */}
        <View style={tw`mb-8`}>
          <ChatCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OrderDetail;