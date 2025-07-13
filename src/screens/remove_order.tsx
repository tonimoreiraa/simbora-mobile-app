import {ScrollView, View, Text} from 'react-native';
import tw from 'twrnc';
import CartProduct from '../components/cart_product';
import {useCart} from '../contexts/cart_provider';
import QrCode from '../assets/qrcode.svg';

export default function RemoveOrder() {
  const cart = useCart();

  return (
    <ScrollView>
      <View style={tw`flex w-full px-4 bg-white`}>
        <View style={tw`flex items-center justify-center w-full py-6`}>
          <Text style={tw`text-center font-medium text-base`}>
            Apresente o QR Code abaixo no balcão de retirada e um documento com
            foto para realizar a retirada doe seu pedido.
          </Text>
          <View style={tw`border border-blue-500 rounded-xl mt-6`}>
            <QrCode width={300} height={300} />
          </View>
        </View>
        <View>
          <View style={tw`w-full`}>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text style={tw`text-xs text-stone-400 mb-0.5`}>
                ID do pedido
              </Text>
              <Text>LZE88998875QKI</Text>
            </View>
          </View>
          <View style={tw`w-full mt-2`}>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text style={tw`text-xs text-stone-400 mb-0.5`}>Cliente</Text>
              <Text>Toni Moreira</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={tw`text-xl font-bold mt-2`}>Detalhes do pedido</Text>
          {cart.items.map(item => (
            <CartProduct key={item.id} {...item} />
          ))}{' '}
        </View>
      </View>
    </ScrollView>
  );
}
