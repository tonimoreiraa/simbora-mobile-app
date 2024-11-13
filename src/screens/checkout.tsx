import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import CartProduct from '../components/cart_product';
import ProductCard from '../components/product_card';
import Discount from '../components/discount';

function Checkout() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex flex-col items-center justify-start py-6 h-full`}>
          <View>
            <Text style={tw`text-2xl font-bold`}>Meu carrinho</Text>
          </View>
          <View style={tw`mt-4`}>
            <CartProduct />
            <CartProduct />
            <CartProduct />
          </View>
          <View
            style={tw`flex flex-row items-center justify-start w-full px-4 py-4`}>
            <View>
              <Text style={tw`text-xl font-bold`}>Produtos Recomendados</Text>
            </View>
            <View style={tw`border border-blue-400 p-1 rounded-lg ml-2`}>
              <Text style={tw`text-stone-500`}>Relacionados</Text>
            </View>
          </View>
          <View
            style={tw`flex flex-row flex-wrap items-center justify-between w-full px-4 mb-4`}>
            <ProductCard />
            <ProductCard />
          </View>
          <View style={tw`flex w-full px-4 mb-30`}>
            <Discount />
          </View>
        </View>
      </ScrollView>
      <View
        style={tw`absolute bottom-0 bg-white border-t border-stone-400 w-full py-8 px-4`}>
        <TouchableOpacity
          style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl`}>
          <Text style={tw`font-bold text-lg text-white`}>
            Método de pagamento
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Checkout;
