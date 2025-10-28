import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import tw from 'twrnc';
import {useRoute} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import ShippingMethod from '../components/shipping_method';
import DropDown from '../components/dropdown';
import SendRequest from '../components/send_request';
import AccountInput from '../components/create_account_input';
import {useCart} from '../contexts/cart_provider';
import {CreditCard, ShareNetwork, MapPin} from 'phosphor-react-native';
import {ShareBudgetModal} from '../components/share_budget_modal';
import type {GetUsers200DataItemOneOf} from '../services/client/models';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

type PaymentFormData = {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
};

function OrderResume() {
  const route = useRoute();
  const {selectedAddress} = (route.params as {selectedAddress?: any}) || {};
  const cart = useCart();

  const form = useForm<PaymentFormData>();

  const [isEnabled, setIsEnabled] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const translateY = useSharedValue(400);

  const onGestureEvent = (event: any) => {
    translateY.value = event.translationY;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
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

  const handlePayment = () => {
    console.log('Iniciando pagamento...');
    // Navegar para tela de pagamento
  };

  const handleShareBudget = () => {
    setShareModalVisible(true);
  };

  const handleSelectUser = (user: GetUsers200DataItemOneOf) => {
    console.log('Usuário selecionado:', user);
    // TODO: Implementar lógica para compartilhar o orçamento com o usuário selecionado
  };

  const shippingCost = 0; // Pode ser calculado ou vindo dos parâmetros

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <ScrollView
          contentContainerStyle={tw`px-5 py-6 pb-8`}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>
              Resumo do Pedido
            </Text>
            <Text style={tw`text-sm text-gray-500`}>
              Confira os detalhes antes de prosseguir
            </Text>
          </View>

          {/* Endereço de Entrega */}
          {selectedAddress && (
            <View style={tw`bg-white border-neutral-100 border p-4 rounded-xl shadow-sm mb-4`}>
              <View style={tw`flex-row items-center mb-2`}>
                <MapPin size={20} color="#1F2937" weight="fill" style={tw`mr-2`} />
                <Text style={tw`text-lg font-semibold text-gray-800`}>
                  Endereço de Entrega
                </Text>
              </View>
              <Text style={tw`text-sm text-gray-600 leading-5`}>
                {selectedAddress.streetName}
                {selectedAddress.number && `, ${selectedAddress.number}`}
              </Text>
              {selectedAddress.complement && (
                <Text style={tw`text-sm text-gray-500 mt-1`}>
                  {selectedAddress.complement}
                </Text>
              )}
              {selectedAddress.city && selectedAddress.state && (
                <Text style={tw`text-sm text-gray-600 mt-1`}>
                  {selectedAddress.city} - {selectedAddress.state}
                </Text>
              )}
            </View>
          )}

          {/* Itens do Pedido */}
          <View style={tw`bg-white rounded-xl border border-neutral-100 mb-4 overflow-hidden`}>
            <View style={tw`bg-neutral-100 px-4 py-3 border-b border-gray-200`}>
              <Text style={tw`font-semibold text-gray-800`}>
                Itens do Pedido ({cart.quantity})
              </Text>
            </View>

            {cart.items.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                style={tw`px-4 py-3 ${
                  index < cart.items.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View style={tw`flex-row justify-between items-start`}>
                  <View style={tw`flex-1 pr-3`}>
                    <Text style={tw`text-sm font-medium text-gray-800 mb-1`}>
                      {item.name}
                    </Text>
                    {item.variant && (
                      <Text style={tw`text-xs text-gray-500 mb-1`}>
                        {item.variant.value} {item.variant.unit}
                      </Text>
                    )}
                    <Text style={tw`text-xs text-gray-500`}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>
                  <View style={tw`items-end`}>
                    <Text style={tw`text-sm font-semibold text-gray-800`}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                    {item.quantity > 1 && (
                      <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {formatPrice(item.price)} cada
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Resumo de Valores */}
          <View style={tw`bg-white border border-neutral-100 rounded-xl shadow-sm mb-6 p-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-sm text-gray-600`}>Subtotal</Text>
              <Text style={tw`text-sm font-medium text-gray-800`}>
                {formatPrice(cart.subTotal)}
              </Text>
            </View>

            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-sm text-gray-600`}>Frete</Text>
              {shippingCost === 0 ? (
                <Text style={tw`text-sm font-medium text-green-600`}>
                  Grátis
                </Text>
              ) : (
                <Text style={tw`text-sm font-medium text-gray-800`}>
                  {formatPrice(shippingCost)}
                </Text>
              )}
            </View>

            {cart.discounts > 0 && (
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-sm text-gray-600`}>Descontos</Text>
                <Text style={tw`text-sm font-medium text-green-600`}>
                  -{formatPrice(cart.discounts)}
                </Text>
              </View>
            )}

            <View style={tw`border-t border-gray-200 mt-3 pt-3`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>Total</Text>
                <Text style={tw`text-xl font-bold text-gray-800`}>
                  {formatPrice(cart.total + shippingCost)}
                </Text>
              </View>
            </View>
          </View>

          {/* Cards de Ação */}
          <View style={tw`gap-4`}>
            {/* Card: Eu vou pagar */}
            <TouchableOpacity
              style={tw`bg-green-500 rounded-2xl p-6 shadow-lg active:scale-98`}
              onPress={handlePayment}
              activeOpacity={0.8}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-2xl font-bold text-white mb-2`}>
                    Eu vou pagar
                  </Text>
                  <Text style={tw`text-sm text-green-50 leading-5`}>
                    Prosseguir para finalizar a compra e realizar o pagamento
                  </Text>
                </View>
                <View style={tw`bg-white bg-opacity-20 rounded-full p-3`}>
                  <CreditCard size={32} color="#FFFFFF" weight="bold" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Card: Compartilhar Orçamento */}
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-2xl p-6 shadow-lg active:scale-98`}
              onPress={handleShareBudget}
              activeOpacity={0.8}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-2xl font-bold text-white mb-2`}>
                    Compartilhar orçamento
                  </Text>
                  <Text style={tw`text-sm text-blue-50 leading-5`}>
                    Enviar para outro usuário aprovar e pagar. Será entregue no endereço escolhido
                  </Text>
                </View>
                <View style={tw`bg-white bg-opacity-20 rounded-full p-3`}>
                  <ShareNetwork size={32} color="#FFFFFF" weight="bold" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Share Budget Modal */}
        <ShareBudgetModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          onSelectUser={handleSelectUser}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default OrderResume;
