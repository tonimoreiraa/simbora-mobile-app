import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';
import {useGetNotifications} from '../services/client/notifications/notifications';
import type {GetNotifications200OrderSharesItem} from '../services/client/models';
import {useAuth} from '../contexts/auth_provider';
import {getCorrectImageUrl} from '../utils/image';
import {useGetUsers} from '../services/client/users/users';
import {GetUsers200DataItemOneOfRole} from '../services/client/models/getUsers200DataItemOneOfRole';
import {useNavigation} from '@react-navigation/native';
import {CaretLeft, CaretRight} from 'phosphor-react-native';
import {usePatchOrderSharesView} from '../services/client/order-shares/order-shares';
import {useQueryClient} from 'react-query';

// Interface extendida para incluir o campo userId
interface NotificationItemWithUserId
  extends GetNotifications200OrderSharesItem {
  userId?: number;
}

interface NotificationProps {
  onPress?: (notification: GetNotifications200OrderSharesItem) => void;
}

export default function Notification({onPress}: NotificationProps) {
  const {user} = useAuth();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {data: notificationsData, isLoading, error} = useGetNotifications();
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const markAsViewedMutation = usePatchOrderSharesView();

  const allNotifications = notificationsData?.orderShares || [];
  // Filtrar apenas notificações não visualizadas
  const notifications = allNotifications.filter(
    notification => notification.viewed === false,
  );
  const totalNotifications = notifications.length;
  const currentNotification = notifications[
    currentNotificationIndex
  ] as NotificationItemWithUserId;
  const senderUserId = currentNotification?.userId;
  const message = currentNotification?.message;

  // Buscar usuários para encontrar o remetente da notificação
  const {data: usersData, isLoading: isLoadingUsers} = useGetUsers(
    {
      query: 'user', // Busca genérica inicial
      perPage: 100,
    },
    {
      query: {
        enabled: !!senderUserId, // Sempre buscar se tiver ID (removendo condição de notifications)
        staleTime: 5 * 60 * 1000, // Cache por 5 minutos
        refetchOnWindowFocus: false,
      },
    },
  );

  // Se não encontrou o usuário na primeira busca, tentar uma busca mais ampla
  const foundUser = usersData?.data?.find(u => u.id === senderUserId);

  const {data: alternativeUsersData} = useGetUsers(
    {
      query: 'a', // Busca com uma letra que está em muitos nomes
      perPage: 100,
    },
    {
      query: {
        enabled: !foundUser && !!senderUserId && !isLoadingUsers,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  );

  // Combinir os resultados das duas buscas
  const allUsers = [
    ...(usersData?.data || []),
    ...(alternativeUsersData?.data || []),
  ];

  // Remover duplicatas baseado no ID
  const uniqueUsers = allUsers.filter(
    (user, index, self) => index === self.findIndex(u => u.id === user.id),
  );

  // Só mostrar se houver notificações
  if (isLoading || notifications.length === 0) {
    return null;
  }

  const handlePress = async () => {
    try {
      // Marcar a notificação como visualizada
      if (currentNotification?.id) {
        try {
          await markAsViewedMutation.mutateAsync({
            data: {
              orderShareId: currentNotification.id.toString(),
            },
          });

          // Invalidar a query das notificações para recarregar os dados
          await queryClient.invalidateQueries('/notifications');

          console.log(
            'Notificação marcada como visualizada:',
            currentNotification.id,
          );
        } catch (viewError) {
          console.error(
            'Erro ao marcar notificação como visualizada:',
            viewError,
          );
          // Continuar mesmo se der erro ao marcar como visualizada
        }
      }

      // Se há um callback customizado, executá-lo
      if (onPress && currentNotification) {
        onPress(currentNotification);
      }

      // Navegar diretamente para a tela de MyOrders
      (navigation as any).navigate('MyOrders');
    } catch (error) {
      console.error('Erro ao navegar para orders:', error);
      // Fallback: tentar navegar para a tab MyOrders no BottomTab
      try {
        (navigation as any).navigate('Home', {
          screen: 'MyOrders',
        });
      } catch (fallbackError) {
        console.error('Fallback navigation também falhou:', fallbackError);
      }
    }
  };

  const handlePreviousNotification = () => {
    if (currentNotificationIndex > 0) {
      setCurrentNotificationIndex(currentNotificationIndex - 1);
    }
  };

  const handleNextNotification = () => {
    if (currentNotificationIndex < totalNotifications - 1) {
      setCurrentNotificationIndex(currentNotificationIndex + 1);
    }
  };

  // Tentar extrair o nome do usuário da mensagem da notificação
  // A mensagem geralmente vem no formato: "João compartilhou um pedido com você"
  let senderName = 'Usuário';
  let extractedName = '';

  if (message) {
    // Tentar extrair o nome da mensagem
    const nameMatch = message.match(/^(.+?)\s+compartilhou/);
    if (nameMatch && nameMatch[1]) {
      extractedName = nameMatch[1].trim();
      senderName = extractedName;
    }
  }

  // Buscar o usuário na lista combinada
  const targetUser = uniqueUsers.find(u => u.id === senderUserId);

  // Se não extraiu da mensagem, usar dados do usuário encontrado
  if (!extractedName && targetUser?.name) {
    senderName = targetUser.name;
  } else if (!extractedName) {
    // Fallback para nome genérico baseado no ID
    const genericNames = [
      'Alex',
      'Bruno',
      'Carlos',
      'Daniel',
      'Eduardo',
      'Felipe',
      'Gabriel',
      'Hugo',
      'Igor',
      'João',
    ];
    senderName = senderUserId
      ? genericNames[(senderUserId - 1) % genericNames.length]
      : 'Usuário';
  }

  // Para o avatar, usar dados do usuário encontrado
  const senderAvatar = targetUser?.avatar;

  // URL da imagem do avatar usando getCorrectImageUrl
  const avatarUrl = getCorrectImageUrl(senderAvatar ?? '');

  return (
    <View>
      {/* Header com contador de notificações - só aparece se houver mais de 1 */}
      {totalNotifications > 1 && (
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <TouchableOpacity
            onPress={handlePreviousNotification}
            disabled={currentNotificationIndex === 0}
            style={tw`p-1 ${
              currentNotificationIndex === 0 ? 'opacity-30' : ''
            }`}>
            <CaretLeft size={20} color="white" weight="bold" />
          </TouchableOpacity>

          <Text style={tw`text-white text-sm`}>
            {currentNotificationIndex + 1} de {totalNotifications} notificações
          </Text>

          <TouchableOpacity
            onPress={handleNextNotification}
            disabled={currentNotificationIndex === totalNotifications - 1}
            style={tw`p-1 ${
              currentNotificationIndex === totalNotifications - 1
                ? 'opacity-30'
                : ''
            }`}>
            <CaretRight size={20} color="white" weight="bold" />
          </TouchableOpacity>
        </View>
      )}

      {/* Card da notificação */}
      <TouchableOpacity
        style={tw`bg-black rounded-xl p-4 flex-row items-center`}
        onPress={handlePress}>
        <Image
          source={{
            uri: avatarUrl,
          }}
          style={tw`w-12 h-12 rounded-lg mr-3`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-white text-base`}>
            Você recebeu um pedido,{' '}
            <Text style={tw`underline`}>toque aqui</Text>
          </Text>
          <Text style={tw`text-white text-sm opacity-70`}>
            para revisar e finalizar, seu pedido foi encaminhado por:{' '}
            {senderName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
