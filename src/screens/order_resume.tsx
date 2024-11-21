import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch } from 'react-native';
import tw from 'twrnc';
import Price from '../components/price';
import ShippingMethod from '../components/shipping_method';
import DropDown from '../components/dropdown';
import SendRequest from '../components/send_request';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

function OrderResume() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const translateY = useSharedValue(400);

  // Define pan gesture handler
  const onGestureEvent = (event: any) => {
    translateY.value = event.translationY;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const toggleDrawer = () => {
    if (isEnabled) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 1,
        overshootClamping: true,
      });
    } else {
      translateY.value = withSpring(400, {
        damping: 20,
        stiffness: 90,
        mass: 1,
        overshootClamping: true,
      });
    }
  };

  React.useEffect(() => {
    toggleDrawer();
  }, [isEnabled]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <ScrollView>
          <View style={tw`flex flex-col items-center justify-center px-4 h-full w-full`}>
            <View style={tw`w-full mt-2`}>
              <Price subTotal={39} discount={3} shipping={1} total={2} />
            </View>
            <View style={tw`mt-4`}>
              <ShippingMethod />
            </View>
            <View style={tw`w-full mt-4`}>
              <Text style={tw`text-xl font-bold`}>Encaminhar Pedido</Text>
              <View style={tw`flex flex-row items-center justify-between bg-stone-100 rounded p-2 mt-4 w-full`}>
                <TextInput
                  style={tw``}
                  placeholder="Digite o ID do profissional"
                />
                <Switch
                  trackColor={{ false: '#767577', true: '#3183FF' }}
                  thumbColor="white"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={tw`ml--12`}
                />
              </View>
            </View>
            <View style={tw` mt-6 w-full`}>
              <Text style={tw`text-xl font-bold`}>Pagamento</Text>
              <DropDown />
              <TextInput
                style={tw`bg-stone-100 rounded p-4 mt-4`}
                placeholder="Número do cartão"
              />
              <TextInput
                style={tw`bg-stone-100 rounded p-4 mt-4`}
                placeholder="Nome do titular"
              />
              <View style={tw`flex flex-row items-center justify-between w-full`}>
                <TextInput
                  style={tw`bg-stone-100 rounded p-4 mt-4 w-46`}
                  placeholder="Vencimento"
                />
                <TextInput
                  style={tw`bg-stone-100 rounded p-4 mt-4 w-46`}
                  placeholder="CVV"
                />
              </View>
              <DropDown />
            </View>
            <View style={tw`mb-26 w-full mt-4`}>
              <TouchableOpacity
                style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl`}
              >
                <Text style={tw`font-bold text-lg text-white`}>Finalizar pedido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Drawer */}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            tw`absolute bottom-0 left-0 w-full bg-white rounded-tl-lg rounded-tr-lg`,
            animatedStyle,
          ]}
        >
          <View style={tw`p-4`}>
            <SendRequest />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

export default OrderResume;
