import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import tw from "twrnc";

export function OrderStatusBadge() {
  return (
    <View
      style={tw`flex flex-row items-center justify-center rounded-3xl border border-orange-300 mt-2 py-1 w-36`}>
      <Icon name="cube" size={14} color="#ffa500"/>
      <Text style={tw`ml-1 text-orange-300 text-lg`}>Retirada</Text>
    </View>
  );
}
