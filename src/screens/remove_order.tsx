import {ScrollView, View, Text} from 'react-native';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';

export default function RemoveOrder() {
  return (
    <ScrollView>
      <View style={tw`flex w-full px-4`}>
        <View>
          <Text style={tw`text-2xl font-bold text-center`}>
            Apresente o QR Code
          </Text>
        </View>
        <View style={tw`flex items-center justify-center w-full`}>
          <Text style={tw`text-center font-medium`}>
            Apresente o QR Code abaixco no balcão de retirada e um documento com
            foto para realizar a retirada doe seu pedido.
          </Text>
          <View>{/* QR CODE */}</View>
        </View>
        <View style={tw`mt-2`}>
          <View style={tw`w-full`}>
            <Text style={tw`py-2`}>ID do pedido</Text>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text>LZE88998875QKI</Text>
            </View>
          </View>
          <View style={tw`w-full`}>
            <Text style={tw`py-2`}>Cliente</Text>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text>Erivaldo Cavalcante</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={tw`text-xl font-bold mt-2`}>Detalhes do pedido</Text>
          <ProductForecast />
          <ProductForecast />
          <ProductForecast />
        </View>
      </View>
    </ScrollView>
  );
}
