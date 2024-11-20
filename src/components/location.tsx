import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';

export default function Location() {
  return (
    <View style={tw`flex flex-row items-center py-4`}>
      <Icon name="location" size={26} />
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
