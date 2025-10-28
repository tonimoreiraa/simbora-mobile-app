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
import {useCart} from '../contexts/cart_provider';
import {useNavigation} from '@react-navigation/native';
import {ForYouProducts} from '../components/for_you_products';
import {ShoppingBag, CaretLeft, Tag, Sparkle} from 'phosphor-react-native';

function Cart() {
  const cart = useCart();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-stone-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}>
          <CaretLeft size={24} color="#000000" weight="bold" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold`}>Meu Carrinho</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}>
        {/* Empty Cart State */}
        {!cart.items.length && (
          <View style={tw`items-center justify-center px-6 py-16`}>
            <View style={tw`bg-gray-100 rounded-full p-8 mb-4`}>
              <ShoppingBag size={64} color="#9CA3AF" weight="regular" />
            </View>
            <Text style={tw`text-center text-gray-900 text-xl font-semibold mb-2`}>
              Seu carrinho está vazio
            </Text>
            <Text style={tw`text-center text-gray-500 text-base mb-8 px-4`}>
              Explore nossos produtos e adicione seus favoritos ao carrinho!
            </Text>
            <TouchableOpacity
              style={tw`bg-blue-500 px-8 py-4 rounded-xl shadow-sm`}
              onPress={() => navigation.navigate('ProductsSearch')}>
              <Text style={tw`font-semibold text-base text-white`}>
                Buscar Produtos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cart Items Section */}
        {cart.items.length > 0 && (
          <View style={tw`px-6 py-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <ShoppingBag size={20} color="#6B7280" weight="bold" />
              <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                Itens no Carrinho ({cart.items.length})
              </Text>
            </View>

            <View style={tw`mb-4`}>
              {cart.items.map(item => (
                <CartProduct key={item.id} {...item} />
              ))}
            </View>

            {/* Price Summary */}
            <View style={tw`mb-6 mt-2`}>
              <View style={tw`flex-row items-center mb-4`}>
                <Tag size={20} color="#6B7280" weight="bold" />
                <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                  Resumo do Pedido
                </Text>
              </View>
              <Price
                shipping={null}
                subTotal={cart.subTotal}
                discount={cart.discounts}
              />
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={tw`bg-blue-500 p-4 rounded-xl shadow-sm items-center`}
              disabled={!cart.items.length}
              onPress={() => navigation.navigate('Checkout')}>
              <Text style={tw`font-semibold text-lg text-white`}>
                Finalizar Compra
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recommended Products Section */}
        <View style={tw`px-6 py-6 ${cart.items.length > 0 ? 'border-t border-stone-100 mt-4' : ''}`}>
          <View style={tw`flex-row items-center mb-4`}>
            <Sparkle size={20} color="#6B7280" weight="bold" />
            <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
              Produtos Recomendados
            </Text>
            <View style={tw`bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg ml-2`}>
              <Text style={tw`text-xs text-blue-600 font-medium`}>Para Você</Text>
            </View>
          </View>

          <ForYouProducts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Cart;
