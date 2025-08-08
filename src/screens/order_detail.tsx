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
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  Star,
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
    <View style={tw`px-4 mt-4 mb-8`}>
      <Text style={tw`text-xl font-bold text-center text-black mb-6`}>
        O que achou desse pedido?
      </Text>
      
      <View style={tw`bg-white border border-gray-200 rounded-2xl p-6`}>
        <View style={tw`flex-row justify-center items-center gap-2 mb-4`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={tw`px-2 py-2`}
            >
              <Star
                size={32}
                color={star <= rating ? "#3b82f6" : "#d1d5db"}
                weight={star <= rating ? "fill" : "regular"}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={tw`flex-row justify-between items-center px-4`}>
          <Text style={tw`text-gray-500`}>Ruim</Text>
          <Text style={tw`text-gray-500`}>Excelente</Text>
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
      style={tw`flex-row rounded-xl mt-2 py-2 p-2 items-center w-full border border-stone-300`}>
      <View style={tw`bg-stone-200 p-2 rounded-xl`}>
        <Image
          source={{uri: productImage || undefined}}
          width={100}
          height={100}
          resizeMode="contain"
        />
      </View>
      <View style={tw`ml-4`}>
        <View style={tw`flex flex-row justify-between`}>
          <Text style={tw`text-base font-medium text-stone-900 w-50`}>
            {item.product?.name || 'Carregando...'}
          </Text>
        </View>
        {item.variant && (
          <View style={tw`flex flex-row items-center`}>
            <Text style={tw`font-light text-sm text-stone-500 mt-1 mr-1`}>
              {item.variant.type}:
            </Text>
            <Text style={tw`text-sm font-bold mt-1`}>
              {item.variant.value}
              {item.variant.unit && ` (${item.variant.unit})`}
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={tw`text-stone-800 font-semibold`}>Qtd: {item.quantity || 1}</Text>
          </View>
          <Text style={tw`text-lg text-stone-900 font-medium`}>
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
      <View>
        {logs.map((log, index) => (
          <View key={index} style={tw`flex-row items-start ${index < logs.length - 1 ? 'mb-6' : ''}`}>
            {/* Timeline dot */}
            <View style={tw`w-3 h-3 bg-black rounded-full mt-1 mr-4`} />
            
            {/* Content */}
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg text-black font-medium mb-1`}>
                {log.title}
              </Text>
              <Text style={tw`text-base text-gray-500`}>
                {formatLogDate(log.date)}
              </Text>
            </View>

            {/* Vertical line connecting dots */}
            {index < logs.length - 1 && (
              <View style={tw`absolute left-1.5 top-5 w-0.5 h-12 bg-black`} />
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
      <View style={tw`flex-row items-center px-4 py-3`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" weight="regular" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold text-center flex-1 mr-6`}>
          Meu Pedido
        </Text>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Order Info Card */}
        <View style={tw`px-4 mt-4`}>
          <View style={tw`bg-white border border-gray-200 rounded-3xl p-4 shadow-sm`}>
            <View style={tw`flex-row items-center justify-between`}>
              {/* Order ID */}
              <Text style={tw`text-base text-gray-900`}>
                {formatOrderId(order.id)}
              </Text>

              {/* Status Badge */}
              <View
                style={tw`flex-row items-center justify-center ${statusBadge.style} px-3 py-2 rounded-full`}>
                <StatusIcon
                  size={14}
                  color={statusBadge.iconColor}
                  weight="fill"
                  style={tw`mr-2`}
                />
                <Text style={tw`text-sm font-medium ${statusBadge.textColor}`}>
                  {getStatusText(order.status || '')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={tw`px-4 mt-4`}>
          <View style={tw`bg-white border border-gray-400 rounded-full py-4 px-6 shadow-sm`}>
            <Text style={tw`text-center text-gray-600 text-base`}>
              {getOrderDetailsText()}
            </Text>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={tw`px-4 mt-6`}>
          {renderTimeline()}
        </View>

        {/* Product Cards */}
        {order.items && order.items.length > 0 && (
          <View style={tw`mt-4 w-full px-4`}>
            {order.items.map((item: any, index: number) => (
              <OrderItemCard key={index} item={item} />
            ))}
          </View>
        )}

        {/* Order Price Summary */}
        {order && (
          <View style={tw`px-4 mb-8`}>
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
        <View style={tw`px-4 mt-4 mb-8`}>
          <Text style={tw`text-xl font-bold text-black mb-4`}>
            Pagamento
          </Text>
          
          <View style={tw`bg-gray-100 rounded-xl p-4 mb-4`}>
            <Text style={tw`text-gray-600 text-base mb-1`}>
              Sandro G Silva
            </Text>
            <Text style={tw`text-gray-600 text-base`}>
              5558 8991 **** 6998
            </Text>
          </View>
          
          <View style={tw`bg-gray-100 rounded-xl p-4`}>
            <Text style={tw`text-black text-base font-medium`}>
              Parcelado em 2x
            </Text>
          </View>
          <View style={tw`mt-4`}>
            <ChatCard
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OrderDetail;