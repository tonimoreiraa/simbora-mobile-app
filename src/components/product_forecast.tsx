import {View, Text} from 'react-native';
import Fio from '../assets/Fio.svg';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import Forecast from './forecast';
import { OrderStatusBadge } from './order_status_badge';

function ProductForecast() {
  return (
    <View
      style={tw`flex-col rounded-xl mt-2 p-2 items-center w-full border border-stone-300 items-start`}>
      <View style={tw`flex flex-row w-full`}>
        <View style={tw`bg-stone-200 p-2 rounded-xl`}>
          <Fio width="100" height="100" />
        </View>
        <View style={tw`ml-2`}>
          <View style={tw`flex flex-col`}>
            <Text style={tw`text-base font-medium text-stone-900`}>Pedido</Text>
            <Text style={tw`text-base font-medium text-stone-900`}>
              #431243214141324
            </Text>
          </View>
          <OrderStatusBadge />
        </View>
      </View>
      <Forecast />
    </View>
  );
}

export default ProductForecast;
