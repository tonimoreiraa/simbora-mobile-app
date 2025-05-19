import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
// Expandir a importação para incluir outros ícones do Phosphor
import {
  LinkSimple,
  MagnifyingGlass,
  WhatsappLogo,
  Envelope,
  ShareNetwork
} from 'phosphor-react-native';

const SendRequest = () => {
  return (
    <View style={tw`rounded-t-3xl bg-[#1E1E1E] px-4 py-8`}>
      <View
        style={tw`flex flex-row items-center bg-black text-white rounded-lg mb-4 w-full`}>
        <MagnifyingGlass color="white" size={14} style={tw`pl-2`} weight="regular" />
        <TextInput
          placeholder="Digite o nome aqui"
          placeholderTextColor="white"
          style={tw`flex-1 text-white pl-2 h-12`}
        />
      </View>
      <Text style={tw`text-stone-400 mb-2`}>
        Cliente recentes
      </Text>
      <View style={tw`mb-4 border-b border-b-stone-400 w-full`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}>
          {[
            'https://github.com/tonimoreiraa.png',
            'https://github.com/SandroGabryel.png',
            'https://github.com/natanielnfs.png',
          ].map((uri, index) => (
            <View key={index} style={tw`items-center mr-5`}>
              <Image source={{uri}} style={tw`w-15 h-15 rounded-full`} />
              <Text style={tw`text-white mt-2`}>
                @{uri.split('/').slice(-1)[0].slice(0, -4)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={tw`flex-row justify-around`}>
        <ActionButton
          icon={<LinkSimple size={24} color="white" weight="regular" />}
          label="Copiar link"
        />
        <ActionButton
          icon={<WhatsappLogo size={24} color="white" weight="regular" />}
          label="WhatsApp"
        />
        <ActionButton
          icon={<Envelope size={24} color="white" weight="regular" />}
          label="E-mail"
        />
        <ActionButton
          icon={<ShareNetwork size={24} color="white" weight="regular" />}
          label="Compartilhar"
        />
      </View>
    </View>
  );
};

const ActionButton = ({icon, label}: any) => (
  <TouchableOpacity style={tw`items-center`}>
    <View style={tw`bg-[#767676] p-4 rounded-full mb-2`}>{icon}</View>
    <Text style={tw`text-white`}>{label}</Text>
  </TouchableOpacity>
);

export default SendRequest;