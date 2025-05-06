import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import AccountInput from '../components/create_account_input';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {SignInPayload, signInSchema} from '../validators/auth';
import {useAuth} from '../contexts/auth_provider';
import {useMutation} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import SocialLogin from '../components/social_login';
import Terms from '../components/terms';
import CheckBox from '../components/check_box';

function SignIn() {
  const navigation = useNavigation();
  const auth = useAuth();
  
  const signIn = async ({email, password}: SignInPayload) =>
    await auth.signIn(email, password);
  
  const form = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });
  const mutation = useMutation(signIn);

  async function handleSubmit(payload: SignInPayload) {
    mutation.mutate(payload);
  }

  {/* @ts-ignore */}
  const handleSignUp = () => navigation.navigate('SignUp');

  return (
    <View
      style={tw`flex items-center justify-between h-full w-full px-4 relative py-2 bg-white`}>
      <View style={tw`w-full mt-22`}>
        <View style={tw`flex flex-col items-center justify-center w-full`}>
          <Logo />
          <Text style={tw`text-stone-500 text-center mt-10`}>
            Crie sua conta ou entre agora mesmo
          </Text>
        </View>
        <AccountInput
          control={form.control}
          name="email"
          label="Seu Login"
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
          <AccountInput
            control={form.control}
            label="Sua Senha"
            name="password"
            placeholder="••••••••"
            isPassword
          />
        {mutation.isError && (
          <Text style={tw`text-red-500 mt-2`}>
            {/* @ts-ignore */}
            {mutation.error?.message}
          </Text>
        )}
        <View style={tw`flex-row justify-between w-full py-2`}>
          <View style={tw`flex flex-row items-center`}>
            <CheckBox />
            <Text style={tw`text-gray-300`}>Lembrar login</Text>
          </View>
          <TouchableOpacity>
            <Text style={tw`text-red-500`}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-full gap-4`}>
          <TouchableOpacity
            disabled={mutation.isLoading || mutation.isSuccess}
            onPress={form.handleSubmit(handleSubmit)}
            style={tw`bg-blue-500 w-full py-4 rounded-md items-center justify-center flex-row gap-2`}>
            {mutation.isLoading && <ActivityIndicator color="white" />}
            <Text style={tw`text-white text-center`}>Entre com e-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={tw`border border-stone-300 w-full py-4 rounded-md`}>
            <Text style={tw`text-stone-600 text-center`}>Criar conta</Text>
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
        <View>
          <SocialLogin></SocialLogin>
        </View>
      </View>
      <View>
        <Terms />
      </View>
    </View>
  );
}

export default SignIn;
