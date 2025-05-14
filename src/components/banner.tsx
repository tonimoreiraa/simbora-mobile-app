import {View, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';

export default function Banner({imageUrl}: {imageUrl: string}) {
  return (
    <View>
      <TouchableOpacity style={tw`w-68 h-36 rounded-2xl mr-2 overflow-hidden`}>
        <Image 
          source={{uri: imageUrl}} 
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}