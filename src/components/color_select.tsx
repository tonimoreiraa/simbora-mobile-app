import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';

export default function ColorSelect() {
  const [press, setPress] = useState(0);

  return (
    <TouchableOpacity
      style={tw`flex flex-col items-center justify-center border-[0.5px] border-stone-600 py-1 px-6 rounded-lg mr-2 
      ${press === 1 ? 'bg-black' : ''}`}
      onPress={() => setPress(press === 1 ? 0 : 1)}>
      <Text style={tw`text-[#696969] text-lg ${press === 1 ? 'text-white' : ''}`}>
        Preto
      </Text>
    </TouchableOpacity>
  );
}
