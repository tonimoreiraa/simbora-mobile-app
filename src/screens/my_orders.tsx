import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';
import {useState} from 'react';
import {useGetOrders} from '../services/client/orders/orders';
import {Package} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';

function MyOrders() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {data, isLoading, error} = useGetOrders({
    page,
    perPage: 10,
  });

  const orders = data?.data || [];
  const total = data?.meta?.total || 0;

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    return String(order.id).includes(searchQuery);
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleOrderPress = (orderId: number | string, orderStatus: string) => {
    switch (orderStatus.toLowerCase()) {
      case 'shipped':
      case 'enviado':
        navigation.navigate('WithdrawOrder', { orderId });
        break;
      case 'delivered':
      case 'entregue':
        navigation.navigate('ResumeOrder', { orderId });
        break;
      case 'out for delivery':
      case 'em rota':
        navigation.navigate('ResumeOrder', { orderId });
        break;
      default:
        navigation.navigate('ResumeOrder', { orderId });
        break;
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView style={tw`h-full`}>
        <Text style={tw`text-2xl font-bold text-center mb-2`}>
          Meus Pedidos
        </Text>
        <View style={tw`w-full px-3`}>
          <InputSearch
            hideImageScanner
            hideMicrophone
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Buscar pedido por número..."
          />
        </View>
        <View style={tw`px-3`}>
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
            filteredOrders
              .filter(order => order.id !== undefined)
              .map(order => (
                <ProductForecast
                  key={order.id}
                  order={{
                    id: order.id!,
                    status: order.status || '',
                    items: (order as any).items || [],
                    shipping: (order as any).shipping || null,
                    createdAt: order.createdAt || '',
                    estimatedDelivery: (order as any).estimatedDelivery || '',
                    deliveryDate: (order as any).deliveryDate || '',
                  }}
                  onPress={() => handleOrderPress(order.id!, order.status || '')}
                />
              ))
          )}
        </View>
        {total > orders.length && (
          <View style={tw`flex-row justify-center items-center py-4`}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyOrders;