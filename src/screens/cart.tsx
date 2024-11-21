import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import CartProduct from '../components/cart_product';
import Price from '../components/price';
import { useCart } from '../contexts/cart_provider';
import { useNavigation } from '@react-navigation/native';
import { ForYouProducts } from '../components/for_you_products';

function Cart() {
  const cart = useCart()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <ScrollView>
        <View style={tw`flex flex-col items-center justify-start py-6 h-full`}>
          <View>
            <Text style={tw`text-2xl font-bold`}>Meu carrinho</Text>
          </View>
          {!cart.items.length && <Text style={tw`text-center mt-4 text-stone-500`}>
            Nenhum item foi adicionado ao carrinho.
          </Text>}
          <View style={tw`mt-4 w-full px-4`}>
            {cart.items.map(item => (
              <CartProduct
                key={item.id}
                {...item}
              />
            ))}
          </View>
          <View style={tw`flex w-full mb-4 px-4`}>
            <Price
              shipping={null}
              subTotal={cart.subTotal}
              discount={cart.discounts}
            />
          </View>
          <View style={tw`w-full px-4`}>
            {cart.items.length ? <TouchableOpacity
              style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl my-4`}
              disabled={!cart.items.length}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={tw`font-bold text-lg text-white`}>
                Continuar
              </Text>
            </TouchableOpacity> : <TouchableOpacity
              style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl my-4`}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={tw`font-bold text-lg text-white`}>
                Buscar produtos
              </Text>
            </TouchableOpacity>}
          </View>
          <View
            style={tw`flex flex-row items-center justify-start w-full py-2`}>
            <View>
              <Text style={tw`text-xl font-bold ml-4`}>
                Produtos Recomendados
              </Text>
            </View>
            <View style={tw`border border-blue-400 p-2 rounded-lg ml-2`}>
              <Text style={tw`text-xs text-stone-500`}>Relacionados</Text>
            </View>
          </View>
          <ForYouProducts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Cart;
