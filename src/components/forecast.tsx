import {TouchableOpacity, Text} from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Forecast() {
  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center border border-stone-300 w-full rounded-2xl px-16 py-1 mt-2`}>
      <Text style={tw`text-lg mr-2 text-stone-300`}>Toque para retirar o pedido</Text>
      <Icon name="chevron-forward" size={20} color="#d3d3d3"/>
    </TouchableOpacity>
  );
}
