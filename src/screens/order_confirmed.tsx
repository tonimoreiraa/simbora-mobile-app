import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import tw from 'twrnc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CheckCircle,
  Package,
  MapPin,
  Clock,
} from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

type OrderConfirmedRouteParams = {
  orderNumber?: string;
  deliveryAddress?: string;
  estimatedTime?: string;
};

function OrderConfirmed() {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderNumber, deliveryAddress, estimatedTime} =
    (route.params as OrderConfirmedRouteParams) || {};

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
    navigation.navigate('MyOrders' as never);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow px-6 py-8`}
        showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <Animated.View style={[tw`items-center mb-6`, checkAnimatedStyle]}>
          <CheckCircle size={120} color="#10B981" weight="fill" />
        </Animated.View>

        {/* Title and Message */}
        <Animated.View style={[tw`items-center mb-6`, contentAnimatedStyle]}>
          <Text style={tw`text-3xl font-bold text-gray-800 text-center mb-4`}>
            Pedido Confirmado!
          </Text>

          {orderNumber && (
            <View style={tw`bg-gray-100 rounded-xl px-4 py-2 mb-4`}>
              <Text style={tw`text-sm text-gray-500`}>Número do pedido</Text>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                #{orderNumber}
              </Text>
            </View>
          )}

          <Text style={tw`text-base text-gray-600 text-center leading-6 mb-6`}>
            Seu pedido foi confirmado com sucesso e já está sendo processado!
          </Text>

          {/* Order Status Card */}
          <View style={tw`bg-white border border-gray-200 rounded-2xl p-4 mb-4 w-full shadow-sm`}>
            <View style={tw`mb-3`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Package size={24} color="#374151" weight="fill" />
                <Text style={tw`text-base font-semibold text-gray-800 ml-2`}>
                  Preparando seu pedido
                </Text>
              </View>
              <Text style={tw`text-sm text-gray-600 leading-5`}>
                Estamos separando os itens do seu pedido. Você receberá
                atualizações em tempo real sobre o status da entrega.
              </Text>
            </View>

            {deliveryAddress && (
              <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <MapPin size={20} color="#374151" weight="fill" />
                  <Text style={tw`text-sm text-gray-700 font-semibold ml-2`}>
                    Endereço de entrega
                  </Text>
                </View>
                <Text style={tw`text-sm text-gray-600 leading-5`}>
                  {deliveryAddress}
                </Text>
              </View>
            )}

            {estimatedTime && (
              <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Clock size={20} color="#374151" weight="fill" />
                  <Text style={tw`text-sm text-gray-700 font-semibold ml-2`}>
                    Previsão de entrega
                  </Text>
                </View>
                <Text style={tw`text-sm text-gray-600`}>
                  {estimatedTime}
                </Text>
              </View>
            )}
          </View>

          {/* Notification Info */}
          <View style={tw`bg-gray-50 rounded-xl p-3 w-full`}>
            <Text style={tw`text-xs text-gray-600 text-center leading-4`}>
              Você receberá notificações sobre cada etapa do seu pedido via app
              e WhatsApp
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[tw`w-full gap-3 mt-4`, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-2xl py-4 px-6 shadow-lg active:scale-98`}
            onPress={handleGoToOrders}
            activeOpacity={0.8}>
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Acompanhar Pedido
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-white border-2 border-blue-500 rounded-2xl py-4 px-6 active:scale-98`}
            onPress={handleGoHome}
            activeOpacity={0.8}>
            <Text style={tw`text-blue-500 text-center font-bold text-lg`}>
              Voltar para Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OrderConfirmed;
