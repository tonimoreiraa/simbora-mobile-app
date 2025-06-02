import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

export default function terms() {
  return (
    <View>
      <View style={tw`flex items-center justify-center w-full px-12`}>
        <View style={tw`flex-row flex-wrap justify-center`}>
          <Text style={tw`text-neutral-500 text-xs`}>
            Ao entrar, você concorda com os{' '}
          </Text>
          <TouchableOpacity>
            <Text style={tw`underline text-neutral-500 text-xs`}>
              termos de uso
            </Text>
          </TouchableOpacity>
          <Text style={tw`text-neutral-500 text-xs`}> e com a </Text>
          <TouchableOpacity>
            <Text style={tw`underline text-neutral-500 text-xs`}>
              política de privacidade
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
