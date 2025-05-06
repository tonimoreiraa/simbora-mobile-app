import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import tw from 'twrnc';
import Logo from '../assets/LOGO.svg';
import AccountInput from '../components/create_account_input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInPayload, signInSchema } from '../validators/auth';
import { useAuth } from '../contexts/auth_provider';
import { useMutation } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import SocialLogin from '../components/social_login';
import Terms from '../components/terms';
import CheckBox from '../components/check_box';

function SignIn() {
  const navigation = useNavigation();
  const auth = useAuth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoAnim = useRef(new Animated.Value(0.8)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const socialAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  
  const signIn = async ({ email, password }: SignInPayload) =>
    await auth.signIn(email, password);
    
  const form = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });
  
  const mutation = useMutation(signIn, {
    onError: () => {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(errorAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  });
  
  async function handleSubmit(payload: SignInPayload) {
    mutation.mutate(payload);
  }
  
  /** @ts-ignore **/
  const handleSignUp = () => navigation.navigate('SignUp');
  
  // Button press animation
  const emailBtnScale = useRef(new Animated.Value(1)).current;
  const signUpBtnScale = useRef(new Animated.Value(1)).current;
  
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

  return (
    <View style={tw`flex items-center justify-between h-full w-full px-4 relative py-2 bg-white`}>
      <View style={tw`w-full mt-22`}>
        <Animated.View 
          style={[
            tw`flex flex-col items-center justify-center w-full`,
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: logoAnim }
              ] 
            }
          ]}>
          <Logo />
          <Animated.Text 
            style={[
              tw`text-stone-500 text-center mt-10`,
              { opacity: fadeAnim }
            ]}>
            Crie sua conta ou entre agora mesmo
          </Animated.Text>
        </Animated.View>
        
        <Animated.View style={{ opacity: formAnim }}>
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
            <Animated.Text 
              style={[
                tw`text-red-500 mt-2`,
                { transform: [{ translateX: errorAnim }] }
              ]}>
              {/** @ts-ignore **/}
              {mutation.error?.message}
            </Animated.Text>
          )}
          
          <View style={tw`flex-row justify-between w-full py-2`}>
            <View style={tw`flex flex-row items-center`}>
              {/* Using original CheckBox without props */}
              <CheckBox />
              <Text style={tw`text-gray-300`}>Lembrar login</Text>
            </View>
            <TouchableOpacity>
              <Text style={tw`text-red-500`}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View style={[tw`w-full gap-4`, { opacity: buttonsAnim }]}>
          <Animated.View style={{ transform: [{ scale: emailBtnScale }] }}>
            <TouchableOpacity
              disabled={mutation.isLoading || mutation.isSuccess}
              onPress={form.handleSubmit(handleSubmit)}
              onPressIn={() => onPressIn(emailBtnScale)}
              onPressOut={() => onPressOut(emailBtnScale)}
              style={tw`bg-blue-500 w-full py-4 rounded-md items-center justify-center flex-row gap-2`}>
              {mutation.isLoading && <ActivityIndicator color="white" />}
              <Text style={tw`text-white text-center`}>Entre com e-mail</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: signUpBtnScale }] }}>
            <TouchableOpacity
              onPress={handleSignUp}
              onPressIn={() => onPressIn(signUpBtnScale)}
              onPressOut={() => onPressOut(signUpBtnScale)}
              style={tw`border border-stone-300 w-full py-4 rounded-md`}>
              <Text style={tw`text-stone-600 text-center`}>Criar conta</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        
        <Animated.View
          style={[
            tw`flex flex-row items-center justify-between w-full py-4`,
            { opacity: socialAnim }
          ]}>
          <View style={tw`border border-stone-200 w-24`}></View>
          <Text style={tw`text-xs text-stone-400`}>
            Entre com uma rede social
          </Text>
          <View style={tw`border border-stone-200 w-24`}></View>
        </Animated.View>
        
        <Animated.View style={{ opacity: socialAnim }}>
          <SocialLogin></SocialLogin>
        </Animated.View>
      </View>
      
      <Animated.View style={{ opacity: socialAnim }}>
        <Terms />
      </Animated.View>
    </View>
  );
}

export default SignIn;