import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import {NavigationArrow, Trash, X, Check} from 'phosphor-react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useForm, Controller} from 'react-hook-form';
import {
  useGetUserAddresses,
  usePostUserAddresses,
  useDeleteUserAddressesId,
} from '../services/client/user-addresses/user-addresses';

type RootStackParamList = {
  Home: undefined;
  ResumeOrder: {selectedAddress?: any};
  WithdrawOrder: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface AddressFormData {
  name: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isMain?: boolean;
}

interface UserAddressesProps {
  onContinue?: (addressId: number) => void;
}

export function UserAddresses({onContinue}: UserAddressesProps) {
  const [selectedAddressId, setSelectedAddressId] = React.useState<
    number | null
  >(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<AddressFormData>();

  // Hooks do Orval
  const {data: addresses, isLoading, isError, refetch} = useGetUserAddresses();

  const createAddressMutation = usePostUserAddresses({
    mutation: {
      onSuccess: () => {
        Alert.alert('Sucesso', 'Endereço adicionado com sucesso!');
        refetch();
        closeModal();
      },
      onError: error => {
        console.error('Erro ao criar endereço:', error);
        Alert.alert(
          'Erro',
          'Não foi possível adicionar o endereço. Tente novamente.',
        );
      },
    },
  });

  const deleteAddressMutation = useDeleteUserAddressesId({
    mutation: {
      onSuccess: () => {
        Alert.alert('Sucesso', 'Endereço removido com sucesso!');
        refetch();
      },
      onError: error => {
        console.error('Erro ao deletar endereço:', error);
        Alert.alert(
          'Erro',
          'Não foi possível remover o endereço. Tente novamente.',
        );
      },
    },
  });

  const applyCepMask = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{5})(\d)/, '$1-$2');
  };

  const removeCepMask = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const fetchAddressFromCep = async (cep: string) => {
    const cleanCep = removeCepMask(cep);

    if (cleanCep.length !== 8) {
      return;
    }

    setIsLoadingCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        return;
      }

      // Preencher os campos com os dados do ViaCEP
      setValue('streetName', data.logradouro || '');
      setValue('neighborhood', data.bairro || '');
      setValue('city', data.localidade || '');
      setValue('state', data.uf || '');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert(
        'Erro',
        'Não foi possível buscar o CEP. Verifique sua conexão.',
      );
    } finally {
      setIsLoadingCep(false);
    }
  };

  const openModal = () => {
    reset();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    reset();
  };

  const onSubmit = (data: AddressFormData) => {
    const formattedData = {
      ...data,
      zipCode: removeCepMask(data.zipCode),
    };

    createAddressMutation.mutate({data: formattedData});
  };

  const handleDeleteAddress = (addressId: number, addressName: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o endereço "${addressName}"?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteAddressMutation.mutate({id: addressId}),
        },
      ],
    );
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      Alert.alert('Atenção', 'Selecione um endereço para continuar.');
      return;
    }

    const selectedAddress = addresses?.find(
      addr => addr.id === selectedAddressId,
    );
    navigation.navigate('ResumeOrder', {selectedAddress});
  };

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`px-4 flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`mt-2 text-gray-500`}>Carregando endereços...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`px-4 flex-1 justify-center items-center`}>
          <Text style={tw`text-red-500 text-center mb-4`}>
            Erro ao carregar endereços
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
            onPress={() => refetch()}>
            <Text style={tw`text-white`}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4`}>
          <Text style={tw`text-2xl font-bold text-center mb-4`}>
            Selecionar Endereço
          </Text>

          {!addresses || addresses.length === 0 ? (
            <View style={tw`py-10`}>
              <Text style={tw`text-sm text-stone-600 text-center mb-4`}>
                Nenhum endereço cadastrado.
              </Text>
              <TouchableOpacity
                style={tw`bg-blue-500 rounded-lg py-3 px-4 items-center`}
                onPress={openModal}>
                <Text style={tw`text-white font-semibold`}>
                  Adicionar primeiro endereço
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {addresses.map((address: any) => (
                <TouchableOpacity
                  key={address.id}
                  style={tw`bg-stone-200 px-4 py-3 flex-row rounded-lg mb-2 ${
                    selectedAddressId === address.id
                      ? 'border-2 border-blue-500'
                      : ''
                  }`}
                  onPress={() => setSelectedAddressId(address.id)}>
                  <BouncyCheckbox
                    size={16}
                    fillColor="#3B82F6"
                    isChecked={selectedAddressId === address.id}
                    onPress={() => setSelectedAddressId(address.id)}
                  />

                  <View style={tw`flex-1 ml-2`}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <View style={tw`flex-1`}>
                        <View style={tw`flex-row items-center`}>
                          <Text style={tw`font-semibold`}>{address.name}</Text>
                          {address.isMain && (
                            <View
                              style={tw`bg-blue-100 px-2 py-1 rounded ml-2`}>
                              <Text
                                style={tw`text-blue-700 text-xs font-medium`}>
                                Principal
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={tw`flex items-start mt-1`}>
                          <NavigationArrow
                            size={16}
                            color="#000000"
                            weight="regular"
                          />
                          <Text style={tw`text-sm text-gray-600 ml-1`}>
                            {address.streetName}, {address.number}
                            {address.complement
                              ? `, ${address.complement}`
                              : ''}
                          </Text>
                          <Text style={tw`text-sm text-gray-600 ml-1`}>
                            {address.neighborhood}, {address.city} -{' '}
                            {address.state}
                          </Text>
                          <Text style={tw`text-sm text-gray-600 ml-1`}>
                            CEP: {address.zipCode}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteAddress(address.id, address.name)
                        }
                        style={tw`p-2`}>
                        <Trash size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={tw`bg-stone-200 px-4 py-3 rounded-lg mb-4 flex-row items-center justify-center`}
                onPress={openModal}>
                <Text style={tw`text-base font-medium`}>
                  + Adicionar novo endereço
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <View style={tw`px-4 pb-4 pt-2 border-t border-gray-200`}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedAddressId}
          style={tw`bg-blue-500 rounded-2xl py-3 px-3 flex-row items-center justify-center ${
            !selectedAddressId ? 'opacity-50' : ''
          }`}>
          <Text style={tw`text-lg text-white font-semibold`}>Continuar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}>
        <View style={tw`bg-white flex-1`}>
          <View
            style={tw`flex-row items-center justify-between px-4 py-4 border-b border-gray-100`}>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text style={tw`text-xl font-bold`}>Adicionar endereço</Text>
            <View style={tw`w-6`} />
          </View>

          <ScrollView
            style={tw`flex-1 px-4 py-6`}
            showsVerticalScrollIndicator={false}>
            <Text style={tw`text-xl font-bold mb-4`}>Endereço</Text>

            <View style={tw`mb-4`}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Nome é obrigatório',
                  maxLength: {value: 50, message: 'Máximo 50 caracteres'},
                }}
                render={({field: {onChange, value}}) => (
                  <View>
                    <Text style={tw`text-sm text-gray-500 mb-1`}>
                      Nome do endereço
                    </Text>
                    <TextInput
                      style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                      placeholder="Casa, Trabalho, etc."
                      value={value}
                      onChangeText={onChange}
                      maxLength={50}
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Controller
                name="zipCode"
                control={control}
                rules={{
                  required: 'CEP é obrigatório',
                  pattern: {value: /^\d{5}-?\d{3}$/, message: 'CEP inválido'},
                }}
                render={({field: {onChange, value}}) => (
                  <View>
                    <View style={tw`flex-row items-center mb-1`}>
                      <Text style={tw`text-sm text-gray-500`}>CEP</Text>
                      {isLoadingCep && (
                        <ActivityIndicator
                          size="small"
                          color="#6B7280"
                          style={tw`ml-2`}
                        />
                      )}
                    </View>
                    <TextInput
                      style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                      placeholder="00000-000"
                      value={value}
                      onChangeText={text => {
                        const maskedValue = applyCepMask(text);
                        onChange(maskedValue);

                        // Buscar endereço automaticamente quando CEP estiver completo
                        const cleanCep = removeCepMask(maskedValue);
                        if (cleanCep.length === 8) {
                          fetchAddressFromCep(maskedValue);
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={9}
                      editable={!isLoadingCep}
                    />
                  </View>
                )}
              />
              {errors.zipCode && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.zipCode.message}
                </Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Controller
                name="streetName"
                control={control}
                rules={{
                  required: 'Rua é obrigatória',
                  maxLength: {value: 100, message: 'Máximo 100 caracteres'},
                }}
                render={({field: {onChange, value}}) => (
                  <View>
                    <Text style={tw`text-sm text-gray-500 mb-1`}>Endereço</Text>
                    <TextInput
                      style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                      placeholder="Rua das Flores"
                      value={value}
                      onChangeText={onChange}
                      maxLength={100}
                    />
                  </View>
                )}
              />
              {errors.streetName && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.streetName.message}
                </Text>
              )}
            </View>

            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-1 mr-2`}>
                <Controller
                  name="number"
                  control={control}
                  rules={{
                    required: 'Número é obrigatório',
                    maxLength: {value: 10, message: 'Máximo 10 caracteres'},
                  }}
                  render={({field: {onChange, value}}) => (
                    <View>
                      <Text style={tw`text-sm text-gray-500 mb-1`}>Número</Text>
                      <TextInput
                        style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                        placeholder="123"
                        value={value}
                        onChangeText={onChange}
                        maxLength={10}
                      />
                    </View>
                  )}
                />
                {errors.number && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.number.message}
                  </Text>
                )}
              </View>

              <View style={tw`flex-1 ml-2`}>
                <Controller
                  name="complement"
                  control={control}
                  rules={{
                    maxLength: {value: 50, message: 'Máximo 50 caracteres'},
                  }}
                  render={({field: {onChange, value}}) => (
                    <View>
                      <Text style={tw`text-sm text-gray-500 mb-1`}>
                        Complemento
                      </Text>
                      <TextInput
                        style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                        placeholder="Apto 101"
                        value={value}
                        onChangeText={onChange}
                        maxLength={50}
                      />
                    </View>
                  )}
                />
                {errors.complement && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.complement.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={tw`mb-4`}>
              <Controller
                name="neighborhood"
                control={control}
                rules={{
                  required: 'Bairro é obrigatório',
                  maxLength: {value: 50, message: 'Máximo 50 caracteres'},
                }}
                render={({field: {onChange, value}}) => (
                  <View>
                    <Text style={tw`text-sm text-gray-500 mb-1`}>Bairro</Text>
                    <TextInput
                      style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                      placeholder="Centro"
                      value={value}
                      onChangeText={onChange}
                      maxLength={50}
                    />
                  </View>
                )}
              />
              {errors.neighborhood && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.neighborhood.message}
                </Text>
              )}
            </View>

            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-2 mr-2`}>
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: 'Cidade é obrigatória',
                    maxLength: {value: 50, message: 'Máximo 50 caracteres'},
                  }}
                  render={({field: {onChange, value}}) => (
                    <View>
                      <Text style={tw`text-sm text-gray-500 mb-1`}>Cidade</Text>
                      <TextInput
                        style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                        placeholder="São Paulo"
                        value={value}
                        onChangeText={onChange}
                        maxLength={50}
                      />
                    </View>
                  )}
                />
                {errors.city && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.city.message}
                  </Text>
                )}
              </View>

              <View style={tw`flex-1 ml-2`}>
                <Controller
                  name="state"
                  control={control}
                  rules={{
                    required: 'Estado é obrigatório',
                    maxLength: {value: 2, message: 'Use a sigla (ex: SP)'},
                    minLength: {value: 2, message: 'Use a sigla (ex: SP)'},
                  }}
                  render={({field: {onChange, value}}) => (
                    <View>
                      <Text style={tw`text-sm text-gray-500 mb-1`}>Estado</Text>
                      <TextInput
                        style={tw`bg-gray-100 rounded-lg p-4 text-base`}
                        placeholder="SP"
                        value={value}
                        onChangeText={text => onChange(text.toUpperCase())}
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>
                  )}
                />
                {errors.state && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.state.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={tw`mb-20`}>
              <Controller
                name="isMain"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TouchableOpacity
                    style={tw`flex-row items-center p-4 bg-gray-100 rounded-lg`}
                    onPress={() => onChange(!value)}>
                    <View
                      style={tw`w-5 h-5 rounded border-2 mr-3 ${
                        value
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                      {value && (
                        <Check size={12} color="#fff" style={tw`m-auto`} />
                      )}
                    </View>
                    <Text style={tw`text-base`}>
                      Definir como endereço principal
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </ScrollView>

          <View style={tw`px-4 pb-6 pt-4 border-t border-gray-100 bg-white`}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={createAddressMutation.isLoading}
              style={tw`bg-blue-500 rounded-lg p-4 items-center ${
                createAddressMutation.isLoading ? 'opacity-50' : ''
              }`}>
              {createAddressMutation.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={tw`text-white text-base font-semibold`}>
                  Salvar endereço
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
