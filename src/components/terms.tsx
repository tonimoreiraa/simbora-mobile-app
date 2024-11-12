import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

export default function terms() {
  return (
    <View>
      <View style={tw`flex items-center justify-center w-full`}>
        <View style={tw`flex-row flex-wrap justify-center`}>
          6<Text>Ao entrar, você concorda com os </Text>
          <TouchableOpacity>
            <Text style={tw`underline`}>termos de uso</Text>
          </TouchableOpacity>
          <Text> e com a </Text>
          <TouchableOpacity>
            <Text style={tw`underline`}>política de privacidade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
