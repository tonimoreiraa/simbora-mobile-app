import {View, Text} from 'react-native';
import tw from 'twrnc';
import ShippingCheckBox from './shipping_check_box';

export default function ShippingMethod() {
  return (
    <View
      style={tw`flex flex-row items-center justify-between w-full p-4 rounded-lg border border-black mt-4`}>
      <View style={tw`flex flex-row items-center`}>
        <ShippingCheckBox />
        <View style={tw`flex flex-col`}>
          <Text style={tw`text-base font-semibold`}>Envio Padrão</Text>
          <Text style={tw`text-xs`}>Entrega em 1 dia útil</Text>
        </View>
      </View>
      <View style={tw``}>
        <Text style={tw`text-lg`}>Grátis</Text>
      </View>
    </View>
  );
}
