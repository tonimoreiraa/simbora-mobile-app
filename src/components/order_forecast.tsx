import {View, Text} from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderForecast() {
  return (
    <View
      style={tw`flex flex-row items-center justify-between rounded-2xl border border-stone-300 w-full mt-2 p-4`}>
      <Text>LZE88998875QKI</Text>
      <View
        style={tw`flex flex-row items-center justify-center rounded-2xl border border-orange-300 w-26`}>
        <Icon name="cube" size={14} />
        <Text style={tw`ml-1 text-orange-300 text-lg`}>Retirada</Text>
      </View>
    </View>
  );
}
