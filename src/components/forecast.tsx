import {TouchableOpacity, Text} from 'react-native';
import tw from 'twrnc';
import {CaretRight} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  WithdrawOrder: undefined;
  OrderDetails: {orderId: number};
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ForecastProps {
  data?: any;
  message?: string;
  onPress?: () => void;
}

export default function Forecast({message, onPress}: ForecastProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = onPress || (() => navigation.navigate('WithdrawOrder'));

  const displayMessage = message || 'Toque para retirar o pedido';

  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center border border-stone-300 w-full rounded-2xl px-16 py-1 mt-2`}
      onPress={handlePress}>
      <Text style={tw`text-lg mr-2 text-neutral-500`}>{displayMessage}</Text>
      <CaretRight size={20} color="#696969" weight="bold" />
    </TouchableOpacity>
  );
}
