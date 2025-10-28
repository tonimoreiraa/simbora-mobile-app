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

// Função para extrair mensagem de erro amigável
function getErrorMessage(error: any): string {
  // Tentar pegar a mensagem do backend primeiro
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Verificar se há erros de validação
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return errors[0].message || errors[0];
    }
    if (typeof errors === 'object') {
      const firstError = Object.values(errors)[0];
      if (typeof firstError === 'string') return firstError;
      if (Array.isArray(firstError)) return firstError[0];
    }
  }

  // Mensagens de erro baseadas no status code
  if (error?.response?.status === 409) {
    return 'Este e-mail ou nome de usuário já está em uso. Tente outro.';
  }
  if (error?.response?.status === 400) {
    return 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  if (error?.response?.status === 422) {
    return 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  if (error?.response?.status >= 500) {
    return 'Erro no servidor. Tente novamente em alguns instantes.';
  }

  // Mensagens para erros de rede
  if (error?.message === 'Network Error' || !error?.response) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }

  // Mensagem genérica
  return 'Não foi possível criar a conta. Tente novamente.';
}

function SignUp() {
  const auth = useAuth();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const mutation = useMutation(signUp, {
    onSuccess: ({user, token}) => {
      setErrorMessage('');
      auth.signInWithToken(token.token, user);
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      setErrorMessage(message);
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
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag">
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

              {errorMessage && (
                <View style={tw`bg-red-50 border border-red-200 rounded-lg p-3`}>
                  <Text style={tw`text-red-600 text-sm`}>
                    {errorMessage}
                  </Text>
                </View>
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
