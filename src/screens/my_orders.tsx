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
import {useGetAllOrders} from '../services/orders/use-orders';
import {Package} from 'phosphor-react-native';

function MyOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {data, isLoading, error} = useGetAllOrders({
    page,
    perPage: 10,
  });

  const filteredOrders =
    data?.orders.filter(order => {
      if (!searchQuery) return true;
      return String(order.id).includes(searchQuery);
    }) || [];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

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
            filteredOrders.map(order => (
              <ProductForecast
                key={order.id}
                order={{
                  id: order.id,
                  status: order.status,
                  items: order.items,
                  shipping: order.shipping,
                  createdAt: order.createdAt,
                }}
              />
            ))
          )}
        </View>

        {data && data.total > data.orders.length && (
          <View style={tw`flex-row justify-center items-center py-4`}>
            <Text
              style={tw`${
                page > 1 ? 'text-orange-500' : 'text-gray-300'
              } px-4 py-2`}
              onPress={() => page > 1 && setPage(p => p - 1)}>
              Anterior
            </Text>
            <Text style={tw`text-gray-500`}>
              Página {page} de {Math.ceil(data.total / 10)}
            </Text>
            <Text
              style={tw`${
                page < Math.ceil(data.total / 10)
                  ? 'text-orange-500'
                  : 'text-gray-300'
              } px-4 py-2`}
              onPress={() =>
                page < Math.ceil(data.total / 10) && setPage(p => p + 1)
              }>
              Próxima
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyOrders;
