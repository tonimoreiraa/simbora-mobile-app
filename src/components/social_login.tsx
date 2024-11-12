import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import tw from 'twrnc';

export default function social_login() {
  return (
    <View style={tw`flex flex-row items-center justify-center w-full`}>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1' ml-1`}>
        <Icon name='logo-facebook' size={36}></Icon>
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1 ml-1`}>
        <Icon name='logo-apple' size={36}></Icon>
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1 ml-1`}>
        <Icon name='logo-google' size={36}></Icon>
      </TouchableOpacity>
    </View>
  );
}
