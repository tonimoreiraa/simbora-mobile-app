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
import {useNavigation} from '@react-navigation/native';
import {CaretLeft} from 'phosphor-react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import AccountInput from '../components/create_account_input';
import UsernameInput from '../components/username_input';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {SignUpPayload, signUpSchema} from '../validators/auth';
import {UserRoleSelector} from '../components/user_role_selector';
import {api} from '../services/api';
import Terms from '../components/terms';
import SocialLogin from '../components/social_login';
import {useAuth} from '../contexts/auth_provider';
import {useMutation} from 'react-query';

async function signUp(payload: SignUpPayload) {
  const {data} = await api.post('/auth/sign-up', payload);
  return data;
}

function SignUp() {
  const auth = useAuth();
  const navigation = useNavigation();

  const mutation = useMutation(signUp, {
    onSuccess: ({user, token}) => {
      auth.signInWithToken(token.token, user);
    },
  });

  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });

  async function handleSubmit(payload: SignUpPayload) {
    mutation.mutate(payload);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-6 py-8 justify-between min-h-full`}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`absolute top-8 left-6 z-10 bg-white rounded-full p-2`}>
            <CaretLeft size={24} color="#000000" weight="bold" />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={tw`flex-1 justify-center`}>
            <View style={tw`items-center mb-8 mt-12`}>
              <Logo width={100} height={60} />
              <Text style={tw`text-stone-500 text-center mt-6 text-base`}>
                Crie sua conta gratuitamente
              </Text>
              <Text style={tw`text-xl font-bold text-center px-4 mt-2`}>
                Preencha os seus dados abaixo e agilize sua rotina com a Rapdo.
              </Text>
            </View>

            {/* Form Section */}
            <View style={tw`gap-4`}>
              <AccountInput
                control={form.control}
                name="name"
                label="Nome completo"
                autoComplete="name"
              />
              <AccountInput
                control={form.control}
                name="email"
                label="E-mail"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <UsernameInput
                control={form.control}
                name="username"
                label="Seu id person"
              />
              <AccountInput
                control={form.control}
                name="password"
                label="Senha"
                autoComplete="password"
                isPassword
              />

              <UserRoleSelector
                control={form.control}
                name="role"
                professionalTypeName="professionalType"
              />

              {mutation.isError && (
                <Text style={tw`text-red-500 text-sm`}>
                  {/* @ts-ignore */}
                  {mutation.error?.message || 'Erro ao criar conta'}
                </Text>
              )}

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={form.handleSubmit(handleSubmit)}
                disabled={mutation.isLoading}
                style={tw`bg-blue-500 w-full py-4 rounded-lg mt-2 ${
                  mutation.isLoading ? 'opacity-70' : ''
                }`}>
                {mutation.isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={tw`text-white text-center font-semibold text-base`}>
                    Criar conta
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms Footer */}
          <View style={tw`py-4 mt-6`}>
            <Terms />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignUp;
