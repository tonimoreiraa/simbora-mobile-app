import React, {useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
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
import {useAuth} from '../contexts/auth_provider';
import {useMutation} from 'react-query';

async function signUp(payload: SignUpPayload) {
  const {data} = await api.post('/auth/sign-up', payload);
  return data;
}

function SignUp() {
  const auth = useAuth();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoAnim = useRef(new Animated.Value(0.8)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const socialAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  const mutation = useMutation(signUp, {
    onSuccess: ({user, token}) => {
      auth.signInWithToken(token.token, user);
    },
    onError: () => {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    },
  });

  // const navigation = useNavigation();
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });
  // const handleSignIn = () => navigation.navigate('SignIn');

  // Button press animation
  const createAccountBtnScale = useRef(new Animated.Value(1)).current;

  const onPressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const onPressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  // Run animations on component mount
  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      // First fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.elastic(1.2),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Then fade in the form
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      // Then fade in the buttons
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Finally fade in the social login
      Animated.timing(socialAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleSubmit(payload: SignUpPayload) {
    mutation.mutate(payload);
  }

  return (
    <SafeAreaView style={tw`bg-white`}>
      <View
        style={tw`flex flex-col items-center justify-between px-4 h-full w-full mt-2 relative bg-white`}>
        <Animated.View
          style={[
            tw`flex flex-col items-center w-full`,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}, {scale: logoAnim}],
            },
          ]}>
          <Logo style={tw`top-2`} width={100} height={60} />
          <Animated.Text
            style={[
              tw`text-stone-500 text-center mb-1 mt-5`,
              {opacity: fadeAnim},
            ]}>
            Crie sua conta gratuitamente
          </Animated.Text>
          <Animated.Text
            style={[
              tw`text-xl font-bold text-center px-4`,
              {opacity: fadeAnim},
            ]}>
            Preencha os seus dados abaixo e agilize sua rotina com a Volevu.
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[tw`w-full`, {opacity: formAnim}]}>
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
            isPassword
          />
          <View style={tw`w-full`}>
            <UserRoleSelector control={form.control} name="role" />

            <Animated.View style={[tw`w-full`, {opacity: buttonsAnim}]}>
              <Animated.View
                style={{transform: [{scale: createAccountBtnScale}]}}>
                <TouchableOpacity
                  onPress={form.handleSubmit(handleSubmit)}
                  onPressIn={() => onPressIn(createAccountBtnScale)}
                  onPressOut={() => onPressOut(createAccountBtnScale)}
                  style={tw`bg-blue-500 w-full py-4 rounded-md`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Criar conta
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={[
                tw`flex flex-row items-center justify-between w-full py-4`,
                {opacity: socialAnim},
              ]}>
              <View style={tw`border border-stone-200 w-24`}></View>
              <Text style={tw`text-xs text-stone-400`}>
                Entre com uma rede social
              </Text>
              <View style={tw`border border-stone-200 w-24`}></View>
            </Animated.View>

            {mutation.isError && (
              <Animated.Text
                style={[
                  tw`text-red-500 text-xs mt-0.5`,
                  {transform: [{translateX: errorAnim}]},
                ]}>
                {/* @ts-ignore */}
                {mutation.error.message}
              </Animated.Text>
            )}

            <Animated.View style={{opacity: socialAnim}}>
              <SocialLogin />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View style={[tw`py-4`, {opacity: socialAnim}]}>
          <Terms />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;
