import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import {MapPin} from 'phosphor-react-native';

export default function Location() {
  return (
    <View style={tw`flex flex-row items-center py-4`}>
      <MapPin size={26} color="gray" weight="fill" />
      <View style={tw`flex flex-row items-center px-2`}>
        <Text style={tw`text-stone-300`}>Enviar para </Text>
        <TouchableOpacity>
          <Text style={tw`text-stone-500 underline`}>
            Av. Marechal Deodoro, 256
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
