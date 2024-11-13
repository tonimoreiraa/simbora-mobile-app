import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

export default function Adress() {
  return (
    <View>
      <View>
        <Text style={tw`mb-1`}>CEP da sua casa</Text>
        <TextInput
          style={tw`flex px-2 py-4 rounded bg-stone-200 w-full`}
          placeholder="00.000-00"
        />
      </View>
      <View>
        <Text style={tw`mb-1`}>Nome da rua</Text>
        <TextInput
          style={tw`flex px-2 py-4 rounded bg-stone-200 w-full`}
          placeholder="Nome da rua"
        />
      </View>
      <View>
        <Text style={tw`mb-1`}>Número</Text>
        <TextInput
          style={tw`flex px-2 py-4 rounded bg-stone-200 w-full`}
          placeholder="Número da casa ou apartamento"
        />
      </View>
      <View style={tw`flex flex-row justify-between w-full`}>
        <View style={tw`w-46`}>
          <Text style={tw`mb-1`}>Cidade</Text>
          <TextInput
            style={tw`fl px-2 py-4 rounded-2 bg-stone-200 w-full`}
            placeholder="Cidade"
          />
        </View>
        <View style={tw`w-46`}>
          <Text style={tw`mb-1`}>Estado</Text>
          <TextInput
            style={tw`fl px-2 py-4 rounded-2 bg-stone-200 w-full`}
            placeholder="Estado"
          />
        </View>
      </View>
      <View
        style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl mt-2`}>
        <TouchableOpacity>
          <Text style={tw`font-bold text-base text-white`}>Salvar Endereço</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
