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
import {useGetOrderShippingsId} from '../services/client/order-shippings/order-shippings';
import {useGetProductsId} from '../services/client/products/products';
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
  const { data: productDetails } = useGetProductsId(item.productId, {
    query: {
      enabled: !!item.productId,
    },
  });

  const productImage = productDetails && productDetails.images && productDetails.images.length > 0
    ? getCorrectImageUrl(productDetails.images[0].path || '')
    : null;

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
        {item.variant && (
          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-xs text-gray-500 mr-1`}>
              {item.variant.type}:
            </Text>
            <Text style={tw`text-xs font-semibold text-gray-700`}>
              {item.variant.value}
              {item.variant.unit && ` (${item.variant.unit})`}
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text style={tw`text-sm text-gray-600`}>Qtd: {item.quantity || 1}</Text>
          <Text style={tw`text-lg text-gray-900 font-bold`}>
            {((parseFloat(item.product?.price || '0')) * (item.quantity || 1)).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
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
  const {data: shipping} = useGetOrderShippingsId(Number(orderId));

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
    const itemsCount = order.items?.length || 0;
    const itemsText = itemsCount === 1 ? '1 Item' : `${itemsCount} Itens`;
    
    // Just return items count for now since shipping fields don't exist
    return itemsText;
  };

  // Create timeline with shipping logs + default order created log
  const renderTimeline = () => {
    const logs = [];

    // Add shipping activity logs if they exist
    if (shipping?.activityLogs && shipping.activityLogs.length > 0) {
      shipping.activityLogs.forEach(log => {
        if (log.title && log.createdAt) {
          logs.push({
            title: log.title,
            date: log.createdAt,
            isShipping: true
          });
        }
      });
    }

    // Always add "Pedido feito" log with order creation date
    if (order?.createdAt) {
      logs.push({
        title: 'Pedido feito',
        date: order.createdAt,
        isShipping: false
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
        {logs.map((log, index) => (
          <View key={index} style={tw`flex-row items-start ${index < logs.length - 1 ? 'mb-5' : ''}`}>
            {/* Timeline dot */}
            <View style={tw`w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4`} />

            {/* Content */}
            <View style={tw`flex-1`}>
              <Text style={tw`text-base text-gray-900 font-semibold mb-1`}>
                {log.title}
              </Text>
              <Text style={tw`text-sm text-gray-500`}>
                {formatLogDate(log.date)}
              </Text>
            </View>

            {/* Vertical line connecting dots */}
            {index < logs.length - 1 && (
              <View style={tw`absolute left-1.5 top-6 w-0.5 h-10 bg-gray-300`} />
            )}
          </View>
        ))}
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
      case 'Shipped':
        return 'Em rota';
      case 'Out for Delivery':
        return 'Em rota';
      case 'Processing':
        return 'Processando';
      case 'Pending':
      case 'Awaiting Payment':
        return 'Pendente';
      default:
        return status || 'Pendente';
    }
  };

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
              subTotal={parseFloat(String(order.total || '0'))}
              discount={0}
              shipping={0}
              total={parseFloat(String(order.total || '0'))}
            />
          </View>
        )}

        {/* Order Rating */}
        <OrderRating />

        {/* Payment Info */}
        <View style={tw`mb-8`}>
          <View style={tw`flex-row items-center mb-4`}>
            <CreditCard size={20} color="#6B7280" weight="bold" />
            <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
              Informações de Pagamento
            </Text>
          </View>

          {/* Card */}
          <View style={tw`bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 mb-3 shadow-md`}>
            <Text style={tw`text-white text-xs mb-2 opacity-70`}>
              Sandro G Silva
            </Text>
            <Text style={tw`text-white text-lg font-bold tracking-wider`}>
              5558 8991 **** 6998
            </Text>
          </View>

          {/* Installments */}
          <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-1`}>Parcelamento</Text>
            <Text style={tw`text-base text-gray-900 font-semibold`}>
              2x sem juros
            </Text>
          </View>

          <View style={tw`mt-4`}>
            <ChatCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OrderDetail;