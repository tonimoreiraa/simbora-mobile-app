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
import { ShoppingBag, ArrowLeft } from 'phosphor-react-native';

function Cart() {
  const cart = useCart();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex flex-col items-center justify-start py-6`}>
          <View style={tw`w-full px-4 flex-row items-center justify-between mb-4`}>
            <TouchableOpacity
              style={tw`p-2 -ml-2`}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color="#000" weight="regular" />
            </TouchableOpacity>
            
            <Text style={tw`text-2xl font-bold flex-1 text-center`}>
              Meu carrinho
            </Text>
            
            <View style={tw`w-8`} />
          </View>

          {!cart.items.length && (
            <View style={tw`items-center py-8`}>
              <ShoppingBag size={64} color="#d1d5db" weight="regular" />
              <Text style={tw`text-center mt-4 text-stone-500 text-lg`}>
                Nenhum item foi adicionado ao carrinho.
              </Text>
              <Text style={tw`text-center mt-2 text-stone-400 text-sm`}>
                Explore nossos produtos e adicione seus favoritos!
              </Text>
            </View>
          )}

          <View style={tw`mt-4 w-full px-4`}>
            {cart.items.map(item => (
              <CartProduct key={item.id} {...item} />
            ))}
          </View>

          {cart.items.length > 0 && (
            <View style={tw`flex w-full mb-4 px-4`}>
              <Price
                shipping={null}
                subTotal={cart.subTotal}
                discount={cart.discounts}
              />
            </View>
          )}

          <View style={tw`w-full px-4`}>
            {cart.items.length ? (
              <TouchableOpacity
                style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl my-4`}
                disabled={!cart.items.length}
                onPress={() => navigation.navigate('Checkout')}
              >
                <Text style={tw`font-bold text-lg text-white`}>
                  Finalizar Compra
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl my-4`}
                onPress={() => navigation.navigate('ProductsSearch')}
              >
                <Text style={tw`font-bold text-lg text-white`}>
                  Buscar produtos
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={tw`flex flex-row items-center justify-start w-full py-2 px-4`}
          >
            <View>
              <Text style={tw`text-xl font-bold`}>Produtos Recomendados</Text>
            </View>
            <View style={tw`border border-blue-400 p-2 rounded-lg ml-2`}>
              <Text style={tw`text-xs text-stone-500`}>Relacionados</Text>
            </View>
          </View>

          <View style={tw`px-4 w-full`}>
            <ForYouProducts />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Cart;