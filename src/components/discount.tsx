import {useState} from 'react';
import {TextInput, View, Text} from 'react-native';
import tw from 'twrnc';

export default function Discount() {
  const [discount, setDiscount] = useState(false);
  const handleTextChange = (text: string) => setDiscount(text === 'APP10');

  return (
    <View
      style={tw`flex flex-row w-full items-center justify-between bg-stone-100 p-2 rounded-lg`}>
      <View>
        <TextInput
          placeholder="Digite o cupom de desconto"
          onChangeText={handleTextChange}
        />
      </View>
      {discount && (
        <View style={tw`bg-blue-500 p-2 rounded-lg`}>
          <Text style={tw`text-xs text-white`}>-10% aplicado</Text>
        </View>
      )}
    </View>
  );
}
