import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import {useCart} from '../contexts/cart_provider';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft} from 'phosphor-react-native';
import {usePostOrders} from '../services/client/orders/orders';
import {useGetUserAddresses} from '../services/client/user-addresses/user-addresses';

interface RouteParams {
  addressId: number;
}

function OrderResume() {
  const [isForwardEnabled, setIsForwardEnabled] = useState(false);
  const [professionalId, setProfessionalId] = useState('');

  const cart = useCart();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {addressId} = (route.params as RouteParams) || {};

  // Buscar endereços do usuário
  const {data: addresses, isLoading: isLoadingAddresses} = useGetUserAddresses();

  // Encontrar o endereço selecionado
  const selectedAddress = addresses?.find((addr: any) => addr.id === addressId);

  const createOrderMutation = usePostOrders({
    mutation: {
      onSuccess: () => {
        // Limpar carrinho e navegar imediatamente
        cart.clear();
        navigation.navigate('MyOrders');

        // Mostrar mensagem de sucesso após navegar
        setTimeout(() => {
          Alert.alert('Sucesso', 'Pedido criado com sucesso!');
        }, 300);
      },
      onError: (error: any) => {
        console.error('Erro ao criar pedido:', error);
        Alert.alert(
          'Erro',
          error?.response?.data?.message || 'Não foi possível criar o pedido. Tente novamente.',
        );
      },
    },
  });

  // Cálculos do pedido
  const subtotal = Number(cart.subTotal) || 0;
  const discount = Number(cart.discounts) || 0;
  const shipping = 0; // Pode ser calculado baseado no endereço ou método de envio
  const total = subtotal - discount + shipping;

  const handleCreateOrder = () => {
    if (!addressId) {
      Alert.alert('Erro', 'Endereço não selecionado');
      return;
    }

    if (cart.items.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio');
      return;
    }

    if (isForwardEnabled && !professionalId) {
      Alert.alert('Erro', 'Digite o ID do profissional para encaminhar o pedido');
      return;
    }

    const orderData = {
      items: cart.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_variant_id: item.variant?.id,
      })),
      addressId: addressId,
      type: 'delivery' as const,
    };
    createOrderMutation.mutate({data: orderData});
  };

  if (isLoadingAddresses) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`mt-2 text-gray-500`}>Carregando informações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex flex-col px-4 py-6`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity
              style={tw`p-2 -ml-2`}
              onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#000" weight="regular" />
            </TouchableOpacity>
            <Text style={tw`text-2xl font-bold flex-1 text-center`}>
              Resumo do Pedido
            </Text>
            <View style={tw`w-8`} />
          </View>

          {/* Endereço de Entrega */}
          {selectedAddress && (
            <View style={tw`w-full mb-4`}>
              <Text style={tw`text-xl font-bold mb-3`}>Endereço de Entrega</Text>
              <View style={tw`bg-stone-100 rounded-lg p-4`}>
                <Text style={tw`font-semibold text-base mb-1`}>
                  {selectedAddress.name}
                </Text>
                <Text style={tw`text-gray-600 text-sm`}>
                  {selectedAddress.streetName}, {selectedAddress.number}
                  {selectedAddress.complement ? `, ${selectedAddress.complement}` : ''}
                </Text>
                <Text style={tw`text-gray-600 text-sm`}>
                  {selectedAddress.neighborhood}, {selectedAddress.city} - {selectedAddress.state}
                </Text>
                <Text style={tw`text-gray-600 text-sm`}>
                  CEP: {selectedAddress.zipCode}
                </Text>
              </View>
            </View>
          )}

          {/* Resumo de Preços */}
          <View style={tw`w-full mt-2`}>
            <View style={tw`flex w-full border border-stone-300 p-4 rounded-lg`}>
              <View style={tw`flex flex-row items-center justify-between py-2`}>
                <Text>Subtotal</Text>
                <View style={tw`flex flex-row items-center justify-between`}>
                  <Text style={tw`font-bold`}>
                    {subtotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </View>
              </View>
              <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Frete</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                  <Text style={tw`font-bold`}>
                    {shipping === 0 ? 'Grátis' : shipping.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </View>
              </View>
              {discount > 0 && (
                <View style={tw`flex flex-row items-center justify-between`}>
                  <Text>Desconto</Text>
                  <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>
                      {discount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                </View>
              )}
              <View style={tw`border-t border-gray-200 mt-3 pt-3`}>
                <View style={tw`flex flex-row items-center justify-between`}>
                  <Text style={tw`text-lg font-bold`}>Valor total</Text>
                  <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`text-xl font-bold`}>
                      {total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Encaminhar Pedido */}
          <View style={tw`w-full mt-6`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-xl font-bold`}>Encaminhar Pedido</Text>
              <Switch
                trackColor={{false: '#767577', true: '#3183FF'}}
                thumbColor="white"
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsForwardEnabled}
                value={isForwardEnabled}
              />
            </View>

            {isForwardEnabled && (
              <View
                style={tw`bg-stone-100 rounded-lg p-4`}>
                <Text style={tw`text-sm text-gray-600 mb-2`}>
                  ID do Profissional
                </Text>
                <TextInput
                  style={tw`bg-white rounded-lg p-3 text-base`}
                  placeholder="Digite o ID do profissional"
                  value={professionalId}
                  onChangeText={setProfessionalId}
                  keyboardType="numeric"
                />
                <Text style={tw`text-xs text-gray-500 mt-2`}>
                  O pedido será encaminhado para o profissional especificado
                </Text>
              </View>
            )}
          </View>

          {/* Informações do Carrinho */}
          <View style={tw`w-full mt-6`}>
            <Text style={tw`text-xl font-bold mb-3`}>Itens do Pedido</Text>
            <View style={tw`bg-stone-100 rounded-lg p-4`}>
              {cart.items.map((item, index) => (
                <View
                  key={item.id}
                  style={tw`${
                    index !== 0 ? 'border-t border-gray-300 pt-3' : ''
                  } ${index !== cart.items.length - 1 ? 'pb-3' : ''}`}>
                  <View style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-semibold text-base`}>
                        {item.name}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm mt-1`}>
                        Quantidade: {item.quantity}
                      </Text>
                    </View>
                    <Text style={tw`font-bold text-base`}>
                      {(item.price * item.quantity).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão de Finalizar */}
      <View style={tw`px-4 pb-6 pt-4 border-t border-gray-200`}>
        <TouchableOpacity
          style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl ${
            createOrderMutation.isLoading ? 'opacity-50' : ''
          }`}
          onPress={handleCreateOrder}
          disabled={createOrderMutation.isLoading}>
          {createOrderMutation.isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={tw`font-bold text-lg text-white`}>
              {isForwardEnabled ? 'Encaminhar Pedido' : 'Criar Pedido'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default OrderResume;
