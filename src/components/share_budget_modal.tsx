import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import tw from 'twrnc';
import {
  X,
  MagnifyingGlass,
  User,
  WhatsappLogo,  
  Export,
  LinkSimple,
  Envelope,
} from 'phosphor-react-native';
import {useGetUsers} from '../services/client/users/users';
import type {GetUsers200DataItem} from '../services/client/models';

interface ShareBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: GetUsers200DataItem) => void;
  onShareSuccess?: (userName: string) => void;
}

export function ShareBudgetModal({
  visible,
  onClose,
  onSelectUser,
  onShareSuccess,
}: ShareBudgetModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {data, isLoading, error} = useGetUsers({
    query: debouncedQuery,
    page,
    perPage: 10,
  });

  const handleSelectUser = useCallback(
    (user: GetUsers200DataItem) => {
      console.log('User selected:', user);
      onSelectUser(user);

      // Call the success callback with the user's name
      if (onShareSuccess) {
        const userName = (user as any).name || (user as any).username || 'O cliente';
        console.log('Calling onShareSuccess with:', userName);
        onShareSuccess(userName);
      }

      onClose();
      setSearchQuery('');
    },
    [onSelectUser, onShareSuccess, onClose],
  );

  const renderUserItem = ({item}: {item: GetUsers200DataItem}) => {
    console.log('Rendering user item:', item);
    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-4 border-b border-gray-100 active:bg-gray-50`}
        onPress={() => {
          console.log('TouchableOpacity pressed for:', (item as any).name);
          handleSelectUser(item);
        }}
        activeOpacity={0.7}>
        <View style={tw`mr-3`}>
          {(item as any).avatar && (item as any).avatar !== 'https://api.rapdo.app/uploads/null' ? (
            <Image
              source={{uri: (item as any).avatar}}
              style={tw`w-12 h-12 rounded-full`}
            />
          ) : (
            <View
              style={tw`w-12 h-12 rounded-full bg-gray-300 items-center justify-center`}>
              <User size={24} color="#666" weight="fill" />
            </View>
          )}
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {(item as any).name || (item as any).username}
          </Text>
          {(item as any).username && (item as any).name && (
            <Text style={tw`text-sm text-gray-500`}>@{(item as any).username}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={tw`items-center justify-center py-12`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`text-gray-500 mt-4`}>Buscando usuários...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={tw`items-center justify-center py-12 px-4`}>
          <Text style={tw`text-red-500 text-center`}>
            Erro ao carregar usuários. Tente novamente.
          </Text>
        </View>
      );
    }

    if (!searchQuery) {
      return (
        <View style={tw`items-center justify-center py-12 px-4`}>
          <MagnifyingGlass size={48} color="#9CA3AF" weight="bold" />
          <Text style={tw`text-gray-500 text-center mt-4`}>
            Digite o nome aqui
          </Text>
        </View>
      );
    }

    if (data?.data?.length === 0) {
      return (
        <View style={tw`items-center justify-center py-12 px-4`}>
          <Text style={tw`text-gray-500 text-center`}>
            Nenhum usuário encontrado com "{searchQuery}"
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      transparent={true}>
      <View style={tw`flex-1 bg-black bg-opacity-50`}>
        <View style={tw`flex-1 mt-20`}>
          <View style={tw`bg-white flex-1 rounded-t-3xl`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center p-5 border-b border-gray-200`}>
              <Text style={tw`font-bold text-2xl text-gray-800`}>
                Compartilhar orçamento
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={tw`p-2 rounded-full bg-gray-100`}>
                <X size={24} color="#000000" weight="bold" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={tw`px-5 py-4 border-b border-gray-200`}>
              <View
                style={tw`flex-row items-center bg-gray-100 rounded-2xl px-4 py-3`}>
                <MagnifyingGlass size={20} color="#6B7280" weight="bold" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={tw`flex-1 ml-3 text-base text-gray-800`}
                  placeholder="Digite o nome aqui"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={20} color="#6B7280" weight="bold" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Recent Clients Section (if no search query) */}
            {!searchQuery && (
              <View style={tw`px-5 py-3 bg-gray-50`}>
                <Text style={tw`text-sm text-gray-500 font-medium`}>
                  Cliente recentes
                </Text>
              </View>
            )}

            {/* Users List */}
            {data?.data && data.data.length > 0 ? (
              <FlatList
                data={data.data}
                renderItem={renderUserItem}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={tw`pb-4`}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              renderEmptyState()
            )}

            {/* Pagination Controls */}
            {data?.meta && data.meta.lastPage && data.meta.lastPage > 1 && (
              <View
                style={tw`flex-row justify-between items-center px-5 py-4 border-t border-gray-200`}>
                <TouchableOpacity
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={tw`px-4 py-2 rounded-lg ${
                    page === 1 ? 'bg-gray-200' : 'bg-blue-500'
                  }`}>
                  <Text
                    style={tw`font-semibold ${
                      page === 1 ? 'text-gray-400' : 'text-white'
                    }`}>
                    Anterior
                  </Text>
                </TouchableOpacity>

                <Text style={tw`text-sm text-black`}>
                  Página {page} de {data.meta.lastPage}
                </Text>

                <TouchableOpacity
                  onPress={() => setPage(p => p + 1)}
                  disabled={page === data.meta.lastPage}
                  style={tw`px-4 py-2 rounded-lg ${
                    page === data.meta.lastPage ? 'bg-gray-200' : 'bg-blue-500'
                  }`}>
                  <Text
                    style={tw`font-semibold ${
                      page === data.meta.lastPage
                        ? 'text-gray-400'
                        : 'text-white'
                    }`}>
                    Próxima
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons (Copy link, WhatsApp, Email, Share) */}
            <View
              style={tw`px-5 py-4 pb-8 border-t border-gray-200 bg-white flex-row justify-around`}>
              <TouchableOpacity
                style={tw`items-center flex-1`}
                activeOpacity={0.7}>
                <View
                  style={tw`w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-2`}>
                  <LinkSimple size={24} color="#000" weight="bold" />
                </View>
                <Text style={tw`text-xs text-black text-center`}>
                  Copiar link
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center flex-1`}
                activeOpacity={0.7}>
                <View
                  style={tw`w-16 h-16 rounded-full bg-[#45E65F] items-center justify-center mb-2`}>
                  <WhatsappLogo size={28} color="#fff" weight="regular" />
                </View>
                <Text style={tw`text-xs text-black text-center`}>
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center flex-1`}
                activeOpacity={0.7}>
                <View
                  style={tw`w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-2`}>
                  <Envelope size={28} color="#000" weight="regular" />
                </View>
                <Text style={tw`text-xs text-black text-center`}>
                  E-mail
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center flex-1`}
                activeOpacity={0.7}>
                <View
                  style={tw`w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-2`}>
                  <Export size={28} color="#000" weight="regular" />
                </View>
                <Text style={tw`text-xs text-black text-center`}>
                  Compartilhar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
