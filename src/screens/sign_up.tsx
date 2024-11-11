import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import AccountInput from '../components/create_account_input';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpPayload, signUpSchema } from '../validators/auth';
import { UserRoleSelector } from '../components/user_role_selector';
import { api } from '../services/api';

function SignUp() {
  const navigation = useNavigation()
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  })
  const handleSignIn = () => navigation.navigate('SignIn')

  async function handleSubmit(payload: SignUpPayload) {
    const { data } = await api.post('/sign-up', payload)
    console.log(data)
  }

  return (
    <View
      style={tw`flex items-center justify-center h-full w-full px-4 relative`}>
      <Logo style={tw`flex`} width={100} />
      <View style={tw`mb-4`}>
        <Text style={tw`text-stone-500 text-center mb-2`}>
          Crie sua conta gratuitamente
        </Text>
        <Text style={tw`text-xl font-bold text-center px-8`}>
          Preencha os seus dados abaixo e agilize sua rotina com a volevu.
        </Text>
      </View>
      <AccountInput
        control={form.control}
        name="name"
        label="Seu nome"
        autoComplete='name'
        placeholder="Erivaldo Cavalcante"
      />
      <AccountInput
        control={form.control}
        name="email"
        label="Seu Email"
        autoCapitalize='none'
        keyboardType='email-address'
        autoComplete='email'
        placeholder="erivaldo@dpibrasil.com"
      />
      <AccountInput
        control={form.control}
        name="username"
        label="Seu id person"
        autoCapitalize='none'
        autoComplete='username'
        placeholder="@erivaldocavalcante"
      />
      <AccountInput
        control={form.control}
        name="password"
        label="Sua senha"
        autoComplete='password'
        placeholder="*********"
        secureTextEntry
      />
      <View style={tw`w-full`}>
        <UserRoleSelector control={form.control} name="role" />
        <View style={tw`w-full gap-4`}>
          <TouchableOpacity onPress={form.handleSubmit(handleSubmit)} style={tw`bg-blue-500 w-full py-4 rounded-md`}>
            <Text style={tw`text-white text-center font-semibold`}>
              Criar conta
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignIn} style={tw`bg-stone-100 w-full py-4 rounded-md`}>
            <Text style={tw`text-stone-400 text-center`}>
              Já tenho uma conta
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={tw`flex flex-row items-center justify-between w-full py-4`}>
          <View style={tw`border border-stone-200 w-24`}></View>
          <Text style={tw`text-xs text-stone-400`}>
            Entre com uma rede social
          </Text>
          <View style={tw`border border-stone-200 w-24`}></View>
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

export default SignUp;