import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import tw from 'twrnc';
import {
  LinkSimple,
  MagnifyingGlass,
  WhatsappLogo,
  Envelope,
  ShareNetwork,
} from 'phosphor-react-native';
import {useGetUsers} from '../services/client/users/users';
import {usePostOrderSharesShare} from '../services/client/order-shares/order-shares';
import {usePostOrders} from '../services/client/orders/orders';
import {GetUsers200DataItemOneOfRole} from '../services/client/models/getUsers200DataItemOneOfRole';
import {useCart} from '../contexts/cart_provider';
import {useNavigation} from '@react-navigation/native';
import {getCorrectImageUrl} from '../utils/image';
import Toast from 'react-native-toast-message';

interface SendRequestProps {
  // Component props
}

const SendRequest = ({}: SendRequestProps) => {
  const [searchText, setSearchText] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // Hooks com tratamento de erro
  let cart, navigation, usersResponse, isLoading, isError;
  let shareOrderMutation, createOrderMutation;

  try {
    cart = useCart();
    navigation = useNavigation();

    const usersQuery = useGetUsers({
      search: searchText || undefined,
      role: GetUsers200DataItemOneOfRole.customer,
      limit: 20,
    });

    usersResponse = usersQuery.data;
    isLoading = usersQuery.isLoading;
    isError = usersQuery.isError;

    shareOrderMutation = usePostOrderSharesShare();
    createOrderMutation = usePostOrders();
  } catch (error) {
    console.error('Erro ao inicializar hooks:', error);
    return (
      <View style={tw`rounded-t-3xl bg-[#1E1E1E] px-4 py-8`}>
        <Text style={tw`text-red-400 text-center`}>
          Erro ao carregar componente
        </Text>
      </View>
    );
  }

  if (!cart || !navigation) {
    return (
      <View style={tw`rounded-t-3xl bg-[#1E1E1E] px-4 py-8`}>
        <Text style={tw`text-white text-center`}>Carregando...</Text>
      </View>
    );
  }

  const filteredCustomers = useMemo(() => {
    try {
      const customers = usersResponse?.data || [];
      if (!searchText) {
        return customers;
      }

      return customers.filter(customer => {
        const name = customer?.name?.toLowerCase() || '';
        const username = customer?.username?.toLowerCase() || '';
        const email = customer?.email?.toLowerCase() || '';
        const search = searchText.toLowerCase();

        return (
          name.includes(search) ||
          username.includes(search) ||
          email.includes(search)
        );
      });
    } catch (error) {
      console.error('Erro ao filtrar clientes:', error);
      return [];
    }
  }, [usersResponse?.data, searchText]);

  const handleShareOrder = async (userId: number, userName: string) => {
    try {
      if (cart.items.length === 0) {
        Alert.alert(
          'Erro',
          'Carrinho vazio. Adicione produtos antes de compartilhar.',
        );
        return;
      }

      setIsSharing(true);

      // 1. Calcular valores do pedido
      const subtotalPrice = cart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const discountPrice = 0; // Sem desconto por enquanto
      const shippingPrice = 0; // Sem frete por enquanto (pode ser calculado depois)
      const totalPrice = subtotalPrice - discountPrice + shippingPrice;

      // 2. Criar o pedido com os itens do carrinho e valores obrigatórios
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotalPrice,
        totalPrice,
        discountPrice,
        shippingPrice,
        status: 'Pending',
        type: 'delivery' as const,
        // Não incluir payment para que fique pendente de pagamento
      };

      const createdOrder = await createOrderMutation.mutateAsync({
        data: orderData,
      });

      if (!createdOrder?.id) {
        throw new Error('Erro ao criar pedido - ID não retornado');
      }

      // 3. Compartilhar o pedido criado
      await shareOrderMutation.mutateAsync({
        data: {
          orderId: createdOrder.id,
          sharedWithUserId: userId,
        },
      });

      // 4. Limpar o carrinho
      cart.clear();

      // 5. Mostrar sucesso e redirecionar
      const formattedTotal = totalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      Toast.show({
        type: 'success',
        text1: 'Pedido compartilhado!',
        text2: `${formattedTotal} enviado para ${userName}. Status: Pendente de pagamento`,
      });

      // 6. Redirecionar para aba de pedidos após um delay
      setTimeout(() => {
        try {
          // Navegar para a aba MyOrders dentro do Home
          navigation.navigate(
            'Home' as never,
            {
              screen: 'MyOrders',
            } as never,
          );
        } catch (navError) {
          console.error('Erro na navegação:', navError);
        }
      }, 2000);
    } catch (error) {
      console.error('Erro ao compartilhar pedido:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível compartilhar o pedido. Tente novamente.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={tw`rounded-t-3xl bg-[#1E1E1E] px-4 py-8`}>
      {/* Campo de busca com lupa alinhada */}
      <View
        style={tw`flex flex-row items-center bg-black text-white rounded-lg mb-4 w-full px-3`}>
        <MagnifyingGlass color="white" size={16} weight="regular" />
        <TextInput
          placeholder="Digite o nome aqui"
          placeholderTextColor="white"
          style={tw`flex-1 text-white pl-3 h-12`}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Text style={tw`text-stone-400 mb-2`}>
        Clientes ({cart.items.length}{' '}
        {cart.items.length === 1 ? 'item' : 'itens'} no carrinho)
      </Text>

      <View style={tw`mb-4 border-b border-b-stone-400 w-full`}>
        {isLoading ? (
          <View style={tw`items-center py-8`}>
            <ActivityIndicator size="small" color="white" />
            <Text style={tw`text-white mt-2`}>Carregando clientes...</Text>
          </View>
        ) : isError ? (
          <View style={tw`items-center py-8`}>
            <Text style={tw`text-red-400`}>Erro ao carregar clientes</Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={tw`items-center py-8`}>
            <Text style={tw`text-stone-400`}>
              {searchText
                ? 'Nenhum cliente encontrado'
                : 'Nenhum cliente disponível'}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mb-4`}
            contentContainerStyle={tw`px-1`}>
            {filteredCustomers.map((customer, index) => {
              try {
                const safeName = customer?.name || customer?.username || 'User';
                const customerAvatar = customer?.avatar
                  ? getCorrectImageUrl(customer.avatar)
                  : null;
                const avatarUri =
                  customerAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    safeName,
                  )}&background=3b82f6`;
                const displayName =
                  customer?.name || customer?.username || 'Usuário';
                const customerId = customer?.id;

                if (!customerId) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={`customer-${customerId}-${index}`}
                    style={tw`items-center mr-5 ${
                      isSharing ? 'opacity-50' : ''
                    }`}
                    onPress={() => {
                      if (!isSharing) {
                        handleShareOrder(customerId, displayName);
                      }
                    }}
                    disabled={isSharing}>
                    <Image
                      source={{uri: avatarUri}}
                      style={tw`w-15 h-15 rounded-full border-2 border-gray-600`}
                      onError={() =>
                        console.log('Erro ao carregar avatar:', avatarUri)
                      }
                    />
                    <Text
                      style={tw`text-white mt-2 text-center w-16`}
                      numberOfLines={1}>
                      {displayName}
                    </Text>
                    {customer?.username && (
                      <Text
                        style={tw`text-stone-400 text-xs`}
                        numberOfLines={1}>
                        @{customer.username}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              } catch (error) {
                console.error('Erro ao renderizar cliente:', error);
                return null;
              }
            })}
          </ScrollView>
        )}
      </View>

      {/* Botões de ação */}
      <View style={tw`flex-row justify-around`}>
        <ActionButton
          icon={<LinkSimple size={24} color="white" weight="regular" />}
          label="Copiar link"
          onPress={() => {
            try {
              Toast.show({
                type: 'info',
                text1: 'Funcionalidade em desenvolvimento',
              });
            } catch (error) {
              console.log('Toast não disponível:', error);
            }
          }}
        />
        <ActionButton
          icon={<WhatsappLogo size={24} color="white" weight="regular" />}
          label="WhatsApp"
          onPress={() => {
            try {
              Toast.show({
                type: 'info',
                text1: 'Funcionalidade em desenvolvimento',
              });
            } catch (error) {
              console.log('Toast não disponível:', error);
            }
          }}
        />
        <ActionButton
          icon={<Envelope size={24} color="white" weight="regular" />}
          label="E-mail"
          onPress={() => {
            try {
              Toast.show({
                type: 'info',
                text1: 'Funcionalidade em desenvolvimento',
              });
            } catch (error) {
              console.log('Toast não disponível:', error);
            }
          }}
        />
        <ActionButton
          icon={<ShareNetwork size={24} color="white" weight="regular" />}
          label="Compartilhar"
          onPress={() => {
            try {
              Toast.show({
                type: 'info',
                text1: 'Funcionalidade em desenvolvimento',
              });
            } catch (error) {
              console.log('Toast não disponível:', error);
            }
          }}
        />
      </View>
    </View>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

const ActionButton = ({icon, label, onPress}: ActionButtonProps) => {
  const handlePress = () => {
    try {
      if (onPress && typeof onPress === 'function') {
        onPress();
      }
    } catch (error) {
      console.error('Erro ao executar ação do botão:', error);
    }
  };

  return (
    <TouchableOpacity style={tw`items-center`} onPress={handlePress}>
      <View style={tw`bg-[#767676] p-4 rounded-full mb-2`}>{icon}</View>
      <Text style={tw`text-white`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SendRequest;
