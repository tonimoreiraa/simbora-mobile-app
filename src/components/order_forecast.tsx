import {View, Text} from 'react-native';
import tw from 'twrnc';
import {OrderStatusBadge} from './order_status_badge';

export default function OrderForecast() {
  return (
    <View
      style={tw`flex flex-row items-center justify-between rounded-2xl border border-stone-300 w-full mt-2 p-4`}>
      <Text>LZE88998875QKI</Text>
      <OrderStatusBadge />
    </View>
  );
}
