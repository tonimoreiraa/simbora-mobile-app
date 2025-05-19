import {TouchableOpacity, View} from 'react-native';
import { FacebookLogo, AppleLogo, GoogleLogo } from 'phosphor-react-native';
import tw from 'twrnc';

export default function social_login() {
  return (
    <View style={tw`flex flex-row items-center justify-center w-full`}>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1' ml-1`}>
        <FacebookLogo size={36} weight="fill" color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1 ml-1`}>
        <AppleLogo size={36} weight="fill" color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex items-center justify-center border border-black rounded-full p-2 mr-1 ml-1`}>
        <GoogleLogo size={36} weight="fill" color="#000000" />
      </TouchableOpacity>
    </View>
  );
}