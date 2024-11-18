import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import Price from '../components/price';
import ShippingMethod from '../components/shipping_method';
import DropDown from '../components/dropdown';

function Order() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={tw`flex flex-col items-center justify-center px-4 mt-06 h-full w-full`}>
          <View>
            <Text style={tw`text-2xl font-bold text-center`}>
              Resumo do pedido
            </Text>
          </View>
          <View style={tw`w-full mt-2`}>
            <Price />
          </View>
          <View style={tw`mt-4`}>
            <ShippingMethod />
          </View>
          <View style={tw`w-full mt-4`}>
            <Text style={tw`text-xl font-bold`}>Encaminhar Pedido</Text>
            <TextInput
              style={tw`bg-stone-100 rounded p-4 mt-4`}
              placeholder="Digite o ID do profissional"></TextInput>
          </View>
          <View style={tw` mt-6 w-full mb-36`}>
            <Text style={tw`text-xl font-bold`}>Pagamento</Text>
            <DropDown />
            <TextInput
              style={tw`bg-stone-100 rounded p-4 mt-4`}
              placeholder="Número do cartão"></TextInput>
            <TextInput
              style={tw`bg-stone-100 rounded p-4 mt-4`}
              placeholder="Nome do titular"></TextInput>
            <View style={tw`flex flex-row items-center justify-between w-full`}>
              <TextInput
                style={tw`bg-stone-100 rounded p-4 mt-4 w-46`}
                placeholder="Vencimento"></TextInput>
              <TextInput
                style={tw`bg-stone-100 rounded p-4 mt-4 w-46`}
                placeholder="CVV"></TextInput>
            </View>
            <DropDown />
          </View>
        </View>
      </ScrollView>
      <View
        style={tw`absolute bottom-0 bg-white border-t border-stone-400 w-full py-8 px-4`}>
        <TouchableOpacity
          style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl`}>
          <Text style={tw`font-bold text-lg text-white`}>Finalizar pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Order;
