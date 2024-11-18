import {ScrollView, Text, View} from 'react-native';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';
import OrderForecast from '../components/order_forecast';
import Icon from 'react-native-vector-icons/Ionicons';
import OrderTimeline from '../components/order_timeline';
import Forecast from '../components/forecast';

const orderEvents = [
  {
    title: 'Previsão de entrega',
    datetime: '31 de Julho às 17h12',
    isCompleted: false,
  },
  {
    title: 'Previsão de entrega',
    datetime: '31 de Julho às 17h12',
    isCompleted: false,
  },
  {
    title: 'Previsão de entrega',
    datetime: '31 de Julho às 17h12',
    isCompleted: false,
  },
];

function MyOrderDelivery() {
  return (
    <ScrollView style={tw`px-2`}>
      <View style={tw`flex flex-col justify-center w-full mt-2`}>
        <Text style={tw`text-2xl font-bold text-center mb-2`}>
          Meus Pedidos
        </Text>
        <View>
          <OrderForecast />
        </View>
        <Forecast />
        <View style={tw`mt-4`}>
          <OrderTimeline events={orderEvents} />
        </View>
        <View>
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
        </View>
      </View>
    </ScrollView>
  );
}

export default MyOrderDelivery;
