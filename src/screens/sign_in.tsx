import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg'
import AccountInput from '../components/create_account_input';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInPayload, signInSchema } from '../validators/auth';
import { useAuth } from '../contexts/auth_provider';
import { useMutation } from 'react-query'
import { useNavigation } from '@react-navigation/native';

async function signIn({ email, password }: SignInPayload)
{
  await new Promise(r => setTimeout(r, 1000))

  if (Math.random() > 0.5) {
    throw new Error('Simulando erro: Email invalido: ' + email)
  } else {
    return {message: 'Deu certo.', email, password}
  }
}

function SignIn() {
  const navigation = useNavigation()
  const auth = useAuth()
  const mutation = useMutation(signIn)
  console.log(mutation.error)

  const form = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSubmit({ email, password }: SignInPayload)
  {
    mutation.mutate({ email, password })
    console.log(1)
  }

  const handleSignUp = () => navigation.navigate('SignUp')

  return (
    <View style={tw`flex items-center justify-center h-full w-full px-4 relative`}>
        <Logo style={tw`mt-20 mb-6`}/>
      <Text style={tw`text-stone-500 text-center mb-6`}>
        Crie sua conta ou entre agora mesmo
      </Text>
      <View style={tw`w-full`}>
        <AccountInput
          control={form.control}
          name="email"
          label="Seu Login"
          placeholder="voce@exemplo.com"
          keyboardType='email-address'
          autoCapitalize='none'
        />
        <AccountInput
          control={form.control}
          label="Sua Senha"
          name="password"
          placeholder="••••••••"
          secureTextEntry
        />
        {mutation.isError && <Text style={tw`text-red-500 mt-2`}>
          {/* @ts-ignore */}
          {mutation.error?.message}
        </Text>}
        <View style={tw`flex-row justify-between w-full py-2`}>
          <Text>Lembrar login</Text>
          <Text style={tw`text-red-500`}>Esqueci a senha</Text>
        </View>
        <View style={tw`w-full gap-4`}>
          <TouchableOpacity
            disabled={mutation.isLoading || mutation.isSuccess}
            onPress={form.handleSubmit(handleSubmit)}
            style={tw`bg-blue-500 w-full py-4 rounded-md items-center justify-center flex-row gap-2`}
          >
            {mutation.isLoading && <ActivityIndicator color="white" />}
            <Text style={tw`text-white text-center`}>Entre com e-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp} style={tw`bg-stone-100 w-full py-4 rounded-md`}>
            <Text style={tw`text-stone-400 text-center`}>Criar conta</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-row items-center justify-between w-full py-4`}>
          <View style={tw`border border-stone-200 w-24`}></View>
          <Text style={tw`text-xs text-stone-400`}>
            Entre com uma rede social
          </Text>
          <View style={tw`border border-stone-200 w-24`}></View>
        </View>
      </View>

      <View style={tw`mt-36`}>
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

export default SignIn;