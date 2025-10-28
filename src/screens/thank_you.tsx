import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CheckCircle, Bell, WhatsappLogo, Package} from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

type ThankYouRouteParams = {
  userName?: string;
};

function ThankYou() {
  const navigation = useNavigation();
  const route = useRoute();
  const {userName} = (route.params as ThankYouRouteParams) || {};

  // Animations
  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    // Animate check icon
    checkScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Animate content
    contentOpacity.value = withDelay(
      200,
      withSpring(1, {
        damping: 20,
        stiffness: 90,
      }),
    );

    // Animate button
    buttonScale.value = withDelay(
      400,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      }),
    );
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: checkScale.value}],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: buttonScale.value}],
    };
  });

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
  };

  const handleGoToOrders = () => {
    navigation.navigate('Account' as never);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 items-center justify-center px-6`}>
        {/* Success Icon */}
        <Animated.View style={[tw`mb-8`, checkAnimatedStyle]}>
          <CheckCircle size={120} color="#10B981" weight="fill" />
        </Animated.View>

        {/* Title and Message */}
        <Animated.View style={[tw`items-center mb-8`, contentAnimatedStyle]}>
          <Text style={tw`text-3xl font-bold text-gray-800 text-center mb-4`}>
            Orçamento Compartilhado!
          </Text>

          <Text style={tw`text-base text-gray-600 text-center leading-6 mb-6`}>
            {userName
              ? `${userName} recebeu uma notificação via app e WhatsApp`
              : 'O seu cliente recebeu uma notificação via app e WhatsApp'}
          </Text>

          {/* Notification Icons */}
          <View style={tw`flex-row items-center gap-4 mb-6`}>
            <View style={tw`items-center`}>
              <View
                style={tw`w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-2`}>
                <Bell size={32} color="#3B82F6" weight="fill" />
              </View>
              <Text style={tw`text-xs text-gray-500`}>Notificação App</Text>
            </View>

            <View style={tw`items-center`}>
              <View
                style={tw`w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-2`}>
                <WhatsappLogo size={32} color="#25D366" weight="fill" />
              </View>
              <Text style={tw`text-xs text-gray-500`}>WhatsApp</Text>
            </View>
          </View>

          {/* Additional Info Card */}
          <View style={tw`bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4`}>
            <View style={tw`flex-row mb-3`}>
              <Package size={24} color="#3B82F6" weight="fill" style={tw`mr-2`} />
              <Text style={tw`text-base font-semibold text-blue-800 flex-1`}>
                O cliente recebeu o orçamento e já pode finalizar o pagamento.
              </Text>
            </View>
            <Text style={tw`text-sm text-blue-700 leading-5`}>
              Assim que o pagamento for confirmado, você será notificado e o pedido será entregue no endereço selecionado!
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[tw`w-full gap-3`, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-2xl py-4 px-6 shadow-lg active:scale-98`}
            onPress={handleGoHome}
            activeOpacity={0.8}>
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Voltar para Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export default ThankYou;
