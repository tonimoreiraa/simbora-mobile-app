import {View, ScrollView, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

export default function Banner() {
  return (
    <View>
      <TouchableOpacity
        style={tw`w-68 h-36 rounded-xl mr-2 bg-stone-200`}></TouchableOpacity>
    </View>
  );
}
