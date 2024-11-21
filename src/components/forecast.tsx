import {TouchableOpacity, Text} from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Forecast() {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center border border-stone-300 w-full rounded-2xl px-16 py-1 mt-2`}
      onPress={() => navigation.navigate('WithdrawOrder')}
    >
      <Text style={tw`text-lg mr-2 text-neutral-500`}>
        Toque para retirar o pedido
      </Text>
      <Icon name="chevron-forward" size={20} color="#696969" />
    </TouchableOpacity>
  );
}