import {View, Text} from 'react-native';
import tw from 'twrnc';
import Forecast from './forecast';
import { OrderStatusBadge } from './order_status_badge';
import { Truck } from 'phosphor-react-native';

function ProductForecast() {
  return (
    <View
      style={tw`flex-col rounded-xl mt-2 p-2 w-full border-[0.5px] border-stone-300 items-start`}>
      <View style={tw`flex flex-row w-full`}>
        <View style={tw`bg-stone-100 p-2 rounded-xl w-28 h-28 items-center justify-center`}>
          <Truck weight="fill" size={60} />
        </View>
        <View style={tw`ml-3`}>
          <View style={tw`flex flex-col pt-2`}>
            <Text style={tw`text-lg font-normal text-stone-900`}>Pedido</Text>
            <Text style={tw`text-lg font-normal text-stone-900`}>
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
