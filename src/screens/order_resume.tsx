import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useCart} from '../contexts/cart_provider';
import {CreditCard, ShareNetwork, MapPin, Tag, X, Check} from 'phosphor-react-native';
import {ShareBudgetModal} from '../components/share_budget_modal';
import type {GetUsers200DataItem} from '../services/client/models';
import {usePostOrders} from '../services/client/orders/orders';
import {useGetUserAddresses} from '../services/client/user-addresses/user-addresses';
import {getCouponsVerifyCode} from '../services/client/coupons/coupons';

interface RouteParams {
  addressId: number;
}

function OrderResume() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {addressId} = (route.params as RouteParams) || {};
  const cart = useCart();

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isFetchingCoupon, setIsFetchingCoupon] = useState(false);

  // Buscar endereços do usuário
  const {data: addresses, isLoading: isLoadingAddresses} =
    useGetUserAddresses();

  // Encontrar o endereço selecionado
  const selectedAddress = addresses?.find((addr: any) => addr.id === addressId);

  const createOrderMutation = usePostOrders({
    mutation: {
      onError: (error: any) => {
        Alert.alert(
          'Erro',
          error?.response?.data?.message ||
            'Não foi possível criar o pedido. Tente novamente.',
        );
      },
    },
  });

  const handlePayment = () => {
    if (!addressId) {
      Alert.alert('Erro', 'Endereço não selecionado');
      return;
    }

    if (cart.items.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio');
      return;
    }

    const orderData: any = {
      items: cart.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_variant_id: item.variant?.id,
      })),
      addressId: addressId,
      type: 'delivery' as const,
    };

    // Adicionar couponId se houver cupom aplicado
    if (appliedCoupon?.id) {
      orderData.couponId = appliedCoupon.id;
    }


    createOrderMutation.mutate(
      {data: orderData},
      {
        onSuccess: response => {
          cart.clear();
          (navigation.navigate as any)('OrderConfirmed', {
            orderNumber: response?.id,
            deliveryAddress: selectedAddress
              ? `${selectedAddress.streetName}, ${selectedAddress.number || 'S/N'} - ${selectedAddress.city}, ${selectedAddress.state}`
              : 'Endereço não informado',
            estimatedTime: '30-45 minutos',
          });
        },
      },
    );
  };

  const handleShareBudget = () => {
    setShareModalVisible(true);
  };

  const handleSelectUser = (user: GetUsers200DataItem) => {
    if (!addressId) {
      Alert.alert('Erro', 'Endereço não selecionado');
      return;
    }

    if (cart.items.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio');
      return;
    }

    const orderData: any = {
      items: cart.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_variant_id: item.variant?.id,
      })),
      addressId: addressId,
      type: 'delivery' as const,
      shareWithUserId: user.id, // Adiciona o ID do usuário para compartilhar
    };

    // Adicionar couponId se houver cupom aplicado
    if (appliedCoupon?.id) {
      orderData.couponId = appliedCoupon.id;
    }


    // Fechar modal antes de criar
    setShareModalVisible(false);

    createOrderMutation.mutate(
      {data: orderData},
      {
        onSuccess: response => {
          cart.clear();
          (navigation.navigate as any)('ThankYou', {
            orderId: response?.id,
          });
        },
      },
    );
  };

  const handleShareSuccess = (userName: string) => {
    // Esta função não é mais necessária pois o fluxo é tratado pelo handleSelectUser
    // Mas mantenho por compatibilidade com o modal
  };

  const shippingCost = 0; // Pode ser calculado ou vindo dos parâmetros

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Aplicar cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Alert.alert('Erro', 'Digite um código de cupom');
      return;
    }

    setIsFetchingCoupon(true);

    try {
      const response = await getCouponsVerifyCode(couponCode.trim().toUpperCase());

      if (response) {
        setAppliedCoupon(response);
        setCouponModalVisible(false);
        Alert.alert('Sucesso', `Cupom ${response.code} aplicado com sucesso!`);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Cupom inválido ou expirado';
      Alert.alert('Erro', errorMsg);
    } finally {
      setIsFetchingCoupon(false);
    }
  };

  // Remover cupom
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calcular desconto do cupom
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = cart.subTotal;

    if (appliedCoupon.type === 'percent') {
      // Desconto percentual
      return (subtotal * Number(appliedCoupon.value)) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      // Desconto fixo
      return Number(appliedCoupon.value);
    } else if (appliedCoupon.type === 'shipping') {
      // Frete grátis
      return shippingCost;
    }

    return 0;
  };

  const couponDiscount = calculateCouponDiscount();
  const totalWithCoupon = Math.max(0, cart.total + shippingCost - couponDiscount);

  if (isLoadingAddresses) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`mt-2 text-gray-500`}>Carregando informações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        contentContainerStyle={tw`px-5 py-6 pb-8`}
        showsVerticalScrollIndicator={false}>
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
          <View
            style={tw`bg-white border-neutral-100 border p-4 rounded-xl shadow-sm mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <MapPin
                size={20}
                color="#1F2937"
                weight="fill"
                style={tw`mr-2`}
              />
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
        <View
          style={tw`bg-white rounded-xl border border-neutral-100 mb-4 overflow-hidden`}>
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
              }`}>
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

        {/* Cupom de Desconto */}
        <View style={tw`mb-4`}>
          {appliedCoupon ? (
            <View style={tw`bg-green-50 border border-green-200 rounded-xl p-4`}>
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <View style={tw`flex-row items-center`}>
                  <Tag size={20} color="#16A34A" weight="fill" />
                  <Text style={tw`text-base font-semibold text-green-700 ml-2`}>
                    Cupom Aplicado
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <X size={20} color="#16A34A" weight="bold" />
                </TouchableOpacity>
              </View>
              <Text style={tw`text-sm text-green-600 font-medium mb-1`}>
                {appliedCoupon.code}
              </Text>
              <Text style={tw`text-xs text-green-600`}>
                {appliedCoupon.description}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={tw`bg-white border border-neutral-200 rounded-xl p-4 flex-row items-center justify-between`}
              onPress={() => setCouponModalVisible(true)}>
              <View style={tw`flex-row items-center`}>
                <Tag size={20} color="#6B7280" weight="fill" />
                <Text style={tw`text-base font-medium text-gray-700 ml-2`}>
                  Adicionar Cupom
                </Text>
              </View>
              <Text style={tw`text-blue-600 font-medium`}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Resumo de Valores */}
        <View
          style={tw`bg-white border border-neutral-100 rounded-xl shadow-sm mb-6 p-4`}>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`text-sm text-gray-600`}>Subtotal</Text>
            <Text style={tw`text-sm font-medium text-gray-800`}>
              {formatPrice(cart.subTotal)}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`text-sm text-gray-600`}>Frete</Text>
            {shippingCost === 0 ? (
              <Text style={tw`text-sm font-medium text-green-600`}>Grátis</Text>
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

          {couponDiscount > 0 && (
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-sm text-green-600 font-medium`}>
                Cupom ({appliedCoupon?.code})
              </Text>
              <Text style={tw`text-sm font-medium text-green-600`}>
                -{formatPrice(couponDiscount)}
              </Text>
            </View>
          )}

          <View style={tw`border-t border-gray-200 mt-3 pt-3`}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>Total</Text>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                {formatPrice(totalWithCoupon)}
              </Text>
            </View>
          </View>
        </View>

        {/* Cards de Ação */}
        <View style={tw`gap-4`}>
          {/* Card: Eu vou pagar */}
          <TouchableOpacity
            style={tw`bg-green-500 rounded-2xl p-6 shadow-lg active:scale-98 ${
              createOrderMutation.isLoading ? 'opacity-50' : ''
            }`}
            onPress={handlePayment}
            activeOpacity={0.8}
            disabled={createOrderMutation.isLoading}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-2xl font-bold text-white mb-2`}>
                  Eu vou pagar
                </Text>
                <Text style={tw`text-sm text-green-50 leading-5`}>
                  {createOrderMutation.isLoading
                    ? 'Criando pedido...'
                    : 'Prosseguir para finalizar a compra e realizar o pagamento'}
                </Text>
              </View>
              <View style={tw`bg-white bg-opacity-20 rounded-full p-3`}>
                {createOrderMutation.isLoading ? (
                  <ActivityIndicator size={32} color="#FFFFFF" />
                ) : (
                  <CreditCard size={32} color="#FFFFFF" weight="bold" />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Compartilhar Orçamento */}
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-2xl p-6 shadow-lg active:scale-98`}
            onPress={handleShareBudget}
            activeOpacity={0.8}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-2xl font-bold text-white mb-2`}>
                  Compartilhar orçamento
                </Text>
                <Text style={tw`text-sm text-blue-50 leading-5`}>
                  Enviar para outro usuário aprovar e pagar. Será entregue no
                  endereço escolhido
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
        onShareSuccess={handleShareSuccess}
      />

      {/* Coupon Modal */}
      <Modal
        visible={couponModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCouponModalVisible(false)}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-8`}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                Adicionar Cupom
              </Text>
              <TouchableOpacity onPress={() => setCouponModalVisible(false)}>
                <X size={24} color="#6B7280" weight="bold" />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={tw`text-sm text-gray-600 mb-4`}>
              Digite o código do cupom de desconto
            </Text>

            {/* Input */}
            <View style={tw`flex-row items-center gap-2 mb-4`}>
              <View style={tw`flex-1`}>
                <TextInput
                  style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
                  placeholder="Ex: DESCONTO10"
                  placeholderTextColor="#9CA3AF"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity
                style={tw`bg-blue-600 rounded-xl px-6 py-3 ${
                  isFetchingCoupon ? 'opacity-50' : ''
                }`}
                onPress={handleApplyCoupon}
                disabled={isFetchingCoupon}>
                {isFetchingCoupon ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Check size={24} color="#FFFFFF" weight="bold" />
                )}
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={tw`bg-blue-50 border border-blue-200 rounded-xl p-3`}>
              <Text style={tw`text-xs text-blue-600`}>
                Os cupons são aplicados automaticamente no valor total do pedido
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default OrderResume;
