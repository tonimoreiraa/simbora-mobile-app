import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  /** @ts-ignore **/
  const handleSignUp = () => navigation.navigate('SignUp');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-6 py-8 justify-between min-h-full`}>
          {/* Header Section */}
          <View style={tw`flex-1 justify-center`}>
            <View style={tw`items-center mb-8`}>
              <Logo />
              <Text style={tw`text-stone-500 text-center mt-6 text-base`}>
                Crie sua conta ou entre agora mesmo
              </Text>
            </View>

            {/* Form Section */}
            <View style={tw`gap-4`}>
              <AccountInput
                control={form.control}
                name="email"
                label="E-mail/Nome de usuário"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AccountInput
                control={form.control}
                label="Senha"
                name="password"
                isPassword
              />

              {mutation.isError && (
                <Text style={tw`text-red-500 text-sm`}>
                  {/** @ts-ignore **/}
                  {mutation.error?.message}
                </Text>
              )}

              <View style={tw`flex-row justify-between items-center py-2`}>
                <View style={tw`flex-row items-center`}>
                  <CheckBox />
                  <Text style={tw`text-gray-600 text-sm`}>Lembrar login</Text>
                </View>
                <TouchableOpacity>
                  <Text style={tw`text-blue-500 text-sm font-medium`}>
                    Esqueci a senha
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`gap-3 mt-6`}>
              <TouchableOpacity
                disabled={mutation.isLoading || mutation.isSuccess}
                onPress={form.handleSubmit(handleSubmit)}
                style={tw`bg-blue-500 w-full py-4 rounded-lg items-center justify-center flex-row gap-2 ${
                  mutation.isLoading || mutation.isSuccess
                    ? 'opacity-70'
                    : 'opacity-100'
                }`}>
                {mutation.isLoading && <ActivityIndicator color="white" />}
                <Text style={tw`text-white text-center font-semibold text-base`}>
                  Entre com e-mail
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignUp}
                style={tw`bg-gray-100 w-full py-4 rounded-lg`}>
                <Text style={tw`text-gray-700 text-center font-semibold text-base`}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section */}
          <View style={tw`mt-8`}>
            <Terms />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignIn;
