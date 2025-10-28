import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import {useForm, Controller} from 'react-hook-form';
import {Trash, X, Check, MapPin} from 'phosphor-react-native';
import {
  useGetUserAddresses,
  usePostUserAddresses,
  useDeleteUserAddressesId,
} from '../services/client/user-addresses/user-addresses';

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

function AddressManager() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<AddressFormData>();

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

  if (isLoading) {
    return (
      <View style={tw`w-full`}>
        <View style={tw`bg-white border border-gray-200 rounded-xl p-4`}>
          <View style={tw`flex-row items-center`}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={tw`text-base text-gray-700 ml-3`}>
              Carregando endereços...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`w-full`}>
        <TouchableOpacity
          style={tw`bg-white border border-red-200 rounded-xl p-4`}
          onPress={() => refetch()}>
          <Text style={tw`text-xs text-red-500 mb-1`}>Erro ao carregar</Text>
          <Text style={tw`text-base text-gray-900`}>
            Toque para tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`w-full`}>
      {addresses && addresses.length > 0 ? (
        <>
          {addresses.map((address: any, index: number) => (
            <View
              key={address.id || index}
              style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <MapPin size={16} color="#3B82F6" weight="bold" />
                    <Text style={tw`text-xs text-gray-500 ml-2 font-medium`}>
                      {address.name || 'Endereço sem nome'}
                    </Text>
                    {address.isMain && (
                      <View style={tw`bg-blue-100 px-2 py-0.5 rounded-full ml-2`}>
                        <Text style={tw`text-blue-700 text-xs font-semibold`}>
                          Principal
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={tw`text-base text-gray-900 leading-6`}>
                    {address.streetName}, {address.number}
                    {address.complement ? `, ${address.complement}` : ''}
                  </Text>
                  <Text style={tw`text-sm text-gray-600 mt-1`}>
                    {address.neighborhood}, {address.city} - {address.state}
                  </Text>
                  <Text style={tw`text-xs text-gray-500 mt-1`}>
                    CEP: {address.zipCode}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteAddress(address.id, address.name)
                  }
                  style={tw`ml-3 p-2`}>
                  <Trash size={20} color="#EF4444" weight="bold" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={tw`border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center`}
            onPress={() => openModal()}>
            <View style={tw`bg-blue-500 rounded-full w-8 h-8 items-center justify-center mr-3`}>
              <Text style={tw`text-white text-xl font-bold`}>+</Text>
            </View>
            <Text style={tw`text-gray-600 font-semibold text-base`}>
              Adicionar novo endereço
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={tw`border-2 border-dashed border-gray-300 rounded-xl p-5 flex-row items-center justify-center`}
          onPress={() => openModal()}>
          <View style={tw`bg-blue-500 rounded-full w-8 h-8 items-center justify-center mr-3`}>
            <Text style={tw`text-white text-xl font-bold`}>+</Text>
          </View>
          <Text style={tw`text-gray-600 font-semibold text-base`}>
            Adicionar primeiro endereço
          </Text>
        </TouchableOpacity>
      )}

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
                    <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>
                      Nome do endereço
                    </Text>
                    <TextInput
                      style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                      placeholder="Casa, Trabalho, etc."
                      placeholderTextColor="#9CA3AF"
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
                    <View style={tw`flex-row items-center mb-2`}>
                      <Text style={tw`text-xs text-gray-600 font-medium`}>CEP</Text>
                      {isLoadingCep && (
                        <ActivityIndicator
                          size="small"
                          color="#3B82F6"
                          style={tw`ml-2`}
                        />
                      )}
                    </View>
                    <TextInput
                      style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                      placeholder="00000-000"
                      placeholderTextColor="#9CA3AF"
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
                    <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>Endereço</Text>
                    <TextInput
                      style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                      placeholder="Rua das Flores"
                      placeholderTextColor="#9CA3AF"
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
                      <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>Número</Text>
                      <TextInput
                        style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                        placeholder="123"
                      placeholderTextColor="#9CA3AF"
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
                      <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>
                        Complemento
                      </Text>
                      <TextInput
                        style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                        placeholder="Apto 101"
                      placeholderTextColor="#9CA3AF"
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
                    <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>Bairro</Text>
                    <TextInput
                      style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                      placeholder="Centro"
                      placeholderTextColor="#9CA3AF"
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
                      <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>Cidade</Text>
                      <TextInput
                        style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                        placeholder="São Paulo"
                      placeholderTextColor="#9CA3AF"
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
                      <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>Estado</Text>
                      <TextInput
                        style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                        placeholder="SP"
                      placeholderTextColor="#9CA3AF"
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
                    style={tw`flex-row items-center p-4 bg-gray-50 border border-gray-200 rounded-xl`}
                    onPress={() => onChange(!value)}>
                    <View
                      style={tw`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                        value
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                      {value && (
                        <Check size={14} color="#fff" weight="bold" />
                      )}
                    </View>
                    <Text style={tw`text-base text-gray-900`}>
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
              style={tw`bg-blue-500 rounded-xl p-4 items-center shadow-md ${
                createAddressMutation.isLoading ? 'opacity-70' : ''
              }`}>
              {createAddressMutation.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={tw`text-white text-base font-bold`}>
                  Salvar endereço
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default AddressManager;
