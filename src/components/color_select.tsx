import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';

export default function ColorSelect() {
  const [press, setPress] = useState(0);

  return (
    <TouchableOpacity
      style={tw`flex flex-col items-center justify-center border border-stone-200 py-2 px-8 rounded-lg mr-2 
      ${press === 1 ? 'bg-black text-white' : ''}`}
      onPress={() => setPress(press === 1 ? 0 : 1)}>
      <Text style={tw`text-stone-200`}>Para você</Text>
    </TouchableOpacity>
  );
}
