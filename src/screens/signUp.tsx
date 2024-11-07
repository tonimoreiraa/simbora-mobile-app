import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import {useState} from 'react';
import AccountInput from '../components/create_account_input';

function signUp() {
  const [selected, setSelected] = useState(0);
  return (
    <View
      style={tw`flex items-center justify-center h-full w-full px-4 relative`}>
      <Logo style={tw`flex`} width={100} />
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-500 text-center mb-2`}>
          Crie sua conta gratuitamente
        </Text>
        <Text style={tw`text-xl font-bold text-center px-8`}>
          Preencha os seus dados abaixo e agilize sua rotina com a volevu.
        </Text>
      </View>
      <AccountInput description="Seu nome" placeholder="Erivaldo Cavalcante"/>
      <AccountInput description="Seu Email" placeholder="erivaldo@dpibrasil.com" />
      <AccountInput description="Seu id person" placeholder="@erivaldocavalcante" />
      <AccountInput description="Sua senha" placeholder="*********" secureTextEntry/>
      <View style={tw`w-full`}>
        <View style={tw`flex-row items-center justify-between w-full py-2`}>
          <TouchableOpacity
            style={tw`flex items-center justify-center border border-black py-5 w-46 rounded ${selected === 1 ? 'bg-blue-500 border-transparent' : ''}`}
            onPress={() => setSelected(1)}>
            <Text>Sou cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex items-center justify-center border border-black py-5 w-46 rounded ${selected === 2 ? 'bg-blue-500 border-transparent' : ''}`}
            onPress={() => setSelected(2)}>
            <Text>Sou eletricista</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-full gap-4`}>
          <TouchableOpacity style={tw`bg-blue-500 w-full py-4 rounded-md`}>
            <Text style={tw`text-white text-center font-semibold`}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={tw`flex flex-row items-center justify-between w-full py-4`}>
          <View style={tw`border border-gray-200 w-24`}></View>
          <Text style={tw`text-xs text-gray-400`}>
            Entre com uma rede social
          </Text>
          <View style={tw`border border-gray-200 w-24`}></View>
        </View>
      </View>
      <View style={tw`flex mt-20`}>
        <View style={tw`flex items-center justify-center w-full`}>
          <View style={tw`flex-row flex-wrap justify-center`}>
            <Text>Ao entrar, você concorda com os </Text>
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
    </View>
  );
}

export default signUp;