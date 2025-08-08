import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import {useState} from 'react';
import {useGetOrders} from '../services/client/orders/orders';
import {useGetProductsId} from '../services/client/products/products';
import {getCorrectImageUrl} from '../utils/image';
import {
  Package,
  Lightning,
  Truck,
  CheckCircle,
  ArrowLeft,
  Cube,
} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';

function MyOrders() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {data, isLoading, error} = useGetOrders({
    page,
    perPage: 10,
    withDetails: true,
  });

  const orders = data?.data || [];
  const total = data?.meta?.total || 0;

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) {
      return true;
    }
    return String(order.id).includes(searchQuery);
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Group orders by date
  const groupOrdersByDate = (orders: any[]) => {
    const grouped: {[key: string]: any[]} = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const dateKey = date.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
        });
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(order);
      }
    });
    return grouped;
  };

  const groupedOrders = groupOrdersByDate(filteredOrders);

  // Get status display info using correct API statuses
  const getStatusInfo = (status: string, shipping?: any) => {
    switch (status) {
      case 'Shipped':
        return {
          icon: Lightning,
          text: shipping?.estimatedDelivery
            ? `Chega dia ${new Date(
                shipping.estimatedDelivery,
              ).toLocaleDateString('pt-BR', {day: 'numeric', month: 'long'})}`
            : 'Chega em breve',
          badge: 'Em rota',
          badgeStyle: 'bg-gray-100 text-gray-600',
        };
      case 'Delivered':
        return {
          icon: Lightning,
          text: 'Pronto para retirar',
          badge: 'Retirada',
          badgeStyle: 'bg-orange-100 text-orange-600',
        };
      case 'Out for Delivery':
        return {
          icon: Lightning,
          text: shipping?.estimatedDelivery
            ? `Chega dia ${new Date(
                shipping.estimatedDelivery,
              ).toLocaleDateString('pt-BR', {day: 'numeric', month: 'long'})}`
            : 'Em rota para entrega',
          badge: 'Em rota',
          badgeStyle: 'bg-gray-100 text-gray-600',
        };
      case 'Completed':
        return {
          icon: CheckCircle,
          text: shipping?.deliveryDate
            ? `Entregue ${new Date(shipping.deliveryDate).toLocaleDateString(
                'pt-BR',
                {day: 'numeric', month: 'long'},
              )}`
            : 'Pedido entregue',
          badge: 'Entregue',
          badgeStyle: 'bg-blue-100 text-blue-600',
        };
      case 'Processing':
      case 'Confirmed':
      case 'In Production':
        return {
          icon: Package,
          text: 'Processando pedido',
          badge: 'Processando',
          badgeStyle: 'bg-yellow-100 text-yellow-600',
        };
      case 'Pending':
      case 'Awaiting Payment':
        return {
          icon: Cube,
          text: 'Aguardando pagamento',
          badge: 'Pendente',
          badgeStyle: 'bg-red-50 text-red-500',
        };
      default:
        return {
          icon: Package,
          text: status || 'Status desconhecido',
          badge: status || 'Pendente',
          badgeStyle: 'bg-gray-100 text-gray-600',
        };
    }
  };

  const getItemsCount = (order: any) => {
    // Use real order items count if available, fallback to itemsCount from API
    if (order.items && Array.isArray(order.items)) {
      return order.items.length;
    }
    // Fallback to itemsCount from API response
    return order.itemsCount || 1;
  };

  const getProductText = (count: number) => {
    return count === 1 ? '1 produto' : `${count} produtos`;
  };

  // Component that fetches product details for first order item (following web pattern)
  const OrderProductImage = ({ order }: { order: any }) => {
    // Get first item's productId
    const firstItem = order.items?.[0];
    const productId = firstItem?.productId;
    
    // Fetch product details (like web version does)
    const { data: productDetails } = useGetProductsId(productId, {
      query: {
        enabled: !!productId, // Only fetch if we have productId
      },
    });
    
    // Get product image (same logic as web: images[0].path + getCorrectImageUrl)
    const productImage = productDetails && productDetails.images && productDetails.images.length > 0
      ? getCorrectImageUrl(productDetails.images[0].path || '')
      : null;
    
    return (
      <View style={tw`w-24 h-24 bg-gray-100 rounded-xl items-center justify-center mr-4`}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={tw`w-20 h-20 rounded-lg`}
            resizeMode="cover"
            onError={() => {
              // Fallback handled by showing Package icon below if productImage becomes null
              console.log('Failed to load product image:', productImage);
            }}
          />
        ) : (
          <Package size={40} color="#9ca3af" weight="regular" />
        )}
      </View>
    );
  };

  const handleOrderPress = (orderId: number | string, orderStatus?: string) => {
    // If order is ready for pickup (Delivered status), redirect to pickup screen
    if (orderStatus === 'Delivered') {
      (navigation as any).navigate('PickupOrder', {orderId});
    } else {
      // For other orders, redirect to OrderDetail screen
      (navigation as any).navigate('OrderDetail', {orderId});
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <ScrollView style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View style={tw`flex-row items-center px-4 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" weight="regular" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-semibold text-center flex-1 mr-6`}>
            Meus pedidos
          </Text>
        </View>

        {/* Search */}
        <View style={tw`px-4 mb-4`}>
          <InputSearch
            hideImageScanner
            hideMicrophone
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Buscar por produto/pedido"
          />
        </View>

        {/* Content */}
        <View style={tw`px-4`}>
          {isLoading ? (
            <View style={tw`items-center justify-center py-10`}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={tw`mt-2 text-gray-500`}>Carregando pedidos...</Text>
            </View>
          ) : error ? (
            <View style={tw`items-center justify-center py-10`}>
              <Text style={tw`text-red-500 text-center`}>
                Erro ao carregar pedidos. Tente novamente.
              </Text>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={tw`items-center justify-center py-10`}>
              <Package size={60} color="#d1d5db" weight="light" />
              <Text style={tw`mt-4 text-gray-400 text-center`}>
                {searchQuery
                  ? 'Nenhum pedido encontrado com esse número.'
                  : 'Você ainda não tem pedidos.'}
              </Text>
            </View>
          ) : (
            Object.entries(groupedOrders).map(([date, dateOrders]) => (
              <View key={date}>
                {/* Date Header */}
                <View style={tw`bg-gray-100 py-3 px-4 rounded-lg mb-3`}>
                  <Text style={tw`text-sm font-medium text-gray-700`}>
                    {date}
                  </Text>
                </View>

                {/* Orders for this date */}
                {dateOrders.map(order => {
                  const statusInfo = getStatusInfo(
                    order.status || '',
                    order.shipping,
                  );
                  const itemsCount = getItemsCount(order);

                  return (
                    <TouchableOpacity
                      key={order.id}
                      style={tw`bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm`}
                      onPress={() =>
                        handleOrderPress(order.id!, order.status)
                      }
                      activeOpacity={0.7}>
                      <View style={tw`flex-row items-start`}>
                        {/* Product Image - Following web pattern */}
                        <OrderProductImage order={order} />

                        {/* Order Info */}
                        <View style={tw`flex-1`}>
                          <View style={tw`flex-row items-center mb-1`}>
                            <Lightning
                              size={16}
                              color={
                                order.status === 'Completed'
                                  ? '#2563eb'
                                  : order.status === 'Delivered'
                                  ? '#f59e0b'
                                  : '#000000'
                              }
                              weight="fill"
                              style={tw`mr-2`}
                            />
                            <Text
                              style={tw`text-base font-semibold text-gray-900`}>
                              {statusInfo.text}
                            </Text>
                          </View>

                          <Text style={tw`text-sm text-gray-600 mb-3`}>
                            {getProductText(itemsCount)}
                          </Text>

                          {/* Status Badge */}
                          <View
                            style={tw`flex-row items-center justify-center ${
                              order.status === 'Completed'
                                ? 'bg-blue-50 border border-blue-500'
                                : order.status === 'Delivered'
                                ? 'bg-orange-50 border border-orange-500'
                                : 'bg-white border border-gray-300'
                            } px-3 py-2 rounded-full self-start`}>
                            {order.status === 'Completed' ? (
                              <CheckCircle
                                size={14}
                                color="#3b82f6"
                                weight="fill"
                                style={tw`mr-2`}
                              />
                            ) : order.status === 'Delivered' ? (
                              <Package
                                size={14}
                                color="#f97316"
                                weight="fill"
                                style={tw`mr-2`}
                              />
                            ) : (
                              <Truck
                                size={14}
                                color="#6b7280"
                                weight="fill"
                                style={tw`mr-2`}
                              />
                            )}
                            <Text
                              style={tw`text-sm font-medium ${
                                order.status === 'Completed'
                                  ? 'text-blue-600'
                                  : order.status === 'Delivered'
                                  ? 'text-orange-600'
                                  : 'text-gray-700'
                              }`}>
                              {statusInfo.badge}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </View>

        {/* Pagination */}
        {total > orders.length && (
          <View style={tw`flex-row justify-center items-center py-4 px-4`}>
            <Text
              style={tw`${
                page > 1 ? 'text-orange-500' : 'text-gray-300'
              } px-4 py-2`}
              onPress={() => page > 1 && setPage(p => p - 1)}>
              Anterior
            </Text>
            <Text style={tw`text-gray-500`}>
              Página {page} de {totalPages}
            </Text>
            <Text
              style={tw`${
                page < totalPages ? 'text-orange-500' : 'text-gray-300'
              } px-4 py-2`}
              onPress={() => page < totalPages && setPage(p => p + 1)}>
              Próxima
            </Text>
          </View>
        )}

        {/* Bottom padding to avoid tab bar overlap */}
        <View style={tw`h-20`} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyOrders;
