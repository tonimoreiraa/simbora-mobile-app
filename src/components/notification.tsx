import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

export default function Notification() {
  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center justify-between bg-stone-100 w-full p-3 mt-4 bg-black rounded-xl`}>
      <View style={tw`flex flex-row items-center justify-center`}>
        <View
          style={tw`w-12 h-12 bg-stone-200 rounded-lg border border-blue-500`}></View>
        <View style={tw`flex flex-row items-center flex-wrap w-72 ml-4`}>
          <Text style={tw`text-white`}>
            <Text style={tw`font-bold`}>Você recebeu um pedido, </Text>
            <Text style={tw`underline`}>toque aqui </Text>
            para revisar e finalizar, seu pedido foi encaminhado por:
            <Text style={tw``}> Sandro</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
