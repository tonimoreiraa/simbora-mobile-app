import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import AccountInput from '../components/create_account_input';
import {useForm} from 'react-hook-form';
// import {useNavigation} from '@react-navigation/native';
import {zodResolver} from '@hookform/resolvers/zod';
import {SignUpPayload, signUpSchema} from '../validators/auth';
import {UserRoleSelector} from '../components/user_role_selector';
import {api} from '../services/api';
import Terms from '../components/terms';
import SocialLogin from '../components/social_login';
import { useAuth } from '../contexts/auth_provider';
import { useMutation } from 'react-query';

async function signUp(payload: SignUpPayload)
{
  const { data } = await api.post('/auth/sign-up', payload);
  return data
}

function SignUp() {
  const auth = useAuth();
  const mutation = useMutation(signUp, {
    onSuccess: ({ user, token }) => {
      auth.signInWithToken(token.token, user)
    }
  })
  // const navigation = useNavigation();
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });
  // const handleSignIn = () => navigation.navigate('SignIn');

  async function handleSubmit(payload: SignUpPayload) {
    mutation.mutate(payload)
  }

  return (
    <SafeAreaView
      style={tw`flex flex-col items-center justify-between h-full w-full px-4 mt-2 relative bg-white`}>
      <Logo style={tw`top-2`} width={100} height={60}/>
      <View>
        <Text style={tw`text-stone-500 text-center mb-1`}>
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
        autoComplete="name"
        placeholder="Nome e Sobrenome"
      />
      <AccountInput
        control={form.control}
        name="email"
        label="Seu Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="email@example.com"
      />
      <AccountInput
        control={form.control}
        name="username"
        label="Seu id person"
        autoCapitalize="none"
        autoComplete="username"
        placeholder="@seuUser"
      />
      <AccountInput
        control={form.control}
        name="password"
        label="Sua senha"
        autoComplete="password"
        placeholder="••••••••••••"
        secureTextEntry
      />
      <View style={tw`w-full`}>
        <UserRoleSelector control={form.control} name="role" />
        <View style={tw`w-full`}>
          <TouchableOpacity
            onPress={form.handleSubmit(handleSubmit)}
            style={tw`bg-blue-500 w-full py-4 rounded-md`}>
            <Text style={tw`text-white text-center font-semibold`}>
              Criar conta
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
        {mutation.isError && <Text style={tw`text-red-500 text-xs mt-0.5`}>
          {/* @ts-ignore */}
          {mutation.error.message}
        </Text>}
        <View>
          <SocialLogin />
        </View>
      </View>
      <View style={tw`py-4`}>
        <Terms />
      </View>
    </SafeAreaView>
  );
}

export default SignUp;
