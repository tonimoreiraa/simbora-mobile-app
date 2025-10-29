import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {useForm, Controller} from 'react-hook-form';
import {
  PencilSimple,
  Check,
  X,
  Camera,
  CaretLeft,
  User,
  CreditCard,
  MapPin,
  Phone,
} from 'phosphor-react-native';
import {useGetProfile, usePutProfile} from '../services/client/profile/profile';
import AddressManager from '../components/address_manager';

interface FormData {
  email: string;
  phone: string;
  username: string;
  name: string;
}

interface UpdateData {
  email?: string;
  phoneNumber?: string;
  username?: string;
  name?: string;
}

const applyPhoneMask = (value: string) => {
  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length <= 10) {
    return numericValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return numericValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

const removePhoneMask = (value: string) => {
  return value.replace(/\D/g, '');
};

function MyAccount() {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<FormData>();
  const [isEditingPhone, setIsEditingPhone] = React.useState(false);
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);

  const handleSelectAvatar = () => {
    Alert.alert('Selecionar foto', 'Escolha uma opção', [
      {text: 'Câmera', onPress: () => console.log('Câmera selecionada')},
      {text: 'Galeria', onPress: () => console.log('Galeria selecionada')},
      {text: 'Cancelar', style: 'cancel'},
    ]);
  };

  const {data: profileData, isLoading, isError, refetch} = useGetProfile();

  const putProfileMutation = usePutProfile({
    mutation: {
      onSuccess: () => {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        refetch();
        setIsEditingPhone(false);
        setIsEditingUsername(false);
        setIsEditingName(false);
      },
      onError: error => {
        console.error('Erro ao atualizar perfil:', error);
        Alert.alert(
          'Erro',
          'Não foi possível atualizar o perfil. Tente novamente.',
        );
      },
    },
  });

  React.useEffect(() => {
    if (profileData) {
      setValue('email', profileData.email || '');
      setValue(
        'phone',
        profileData.phoneNumber ? applyPhoneMask(profileData.phoneNumber) : '',
      );
      setValue('username', profileData.username || '');
      setValue('name', profileData.name || '');
    }
  }, [profileData, setValue]);

  const updateProfile = (data: Partial<FormData>) => {
    const updateData: UpdateData = {};

    if (data.email || profileData?.email) {
      updateData.email = data.email || profileData?.email || '';
    }
    if (data.phone || profileData?.phoneNumber) {
      const cleanPhone = data.phone
        ? removePhoneMask(data.phone)
        : profileData?.phoneNumber || '';
      updateData.phoneNumber = cleanPhone;
    }
    if (data.username || profileData?.username) {
      updateData.username = data.username || profileData?.username || '';
    }
    if (data.name || profileData?.name) {
      updateData.name = data.name || profileData?.name || '';
    }

    putProfileMutation.mutate({
      data: updateData,
    });
  };

  const handleSaveField = (field: keyof FormData) => {
    const formValues = getValues();
    const updateData: Partial<FormData> = {
      [field]: formValues[field],
    };
    updateProfile(updateData);
  };

  const handleCancelEdit = (field: keyof FormData) => {
    if (profileData) {
      switch (field) {
        case 'phone':
          setValue(
            'phone',
            profileData.phoneNumber
              ? applyPhoneMask(profileData.phoneNumber)
              : '',
          );
          setIsEditingPhone(false);
          break;
        case 'username':
          setValue('username', profileData.username || '');
          setIsEditingUsername(false);
          break;
        case 'name':
          setValue('name', profileData.name || '');
          setIsEditingName(false);
          break;
      }
    }
  };

  const ValidationRules = ({
    field,
    currentLength,
  }: {
    field: 'name' | 'username' | 'phone';
    currentLength?: number;
  }) => {
    const rules = {
      name: {text: 'Nome completo (2-100 caracteres)', max: 100},
      username: {
        text: 'Apenas letras, números, pontos, hífens e underscores (3-50 caracteres)',
        max: 50,
      },
      phone: {text: 'Apenas números, 10 ou 11 dígitos', max: 15},
    };

    const rule = rules[field];

    return (
      <View style={tw`flex-row justify-between items-center mt-1`}>
        <Text style={tw`text-xs text-gray-500 flex-1`}>{rule.text}</Text>
        {currentLength !== undefined &&
          (field === 'name' || field === 'username') && (
            <Text
              style={tw`text-xs ${
                currentLength > rule.max * 0.9
                  ? 'text-orange-500'
                  : 'text-gray-400'
              } ml-2`}>
              {currentLength}/{rule.max}
            </Text>
          )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={tw`bg-white flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={tw`mt-2`}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={tw`bg-white flex-1 justify-center items-center px-4`}>
        <Text style={tw`text-red-500 text-center`}>
          Erro ao carregar perfil. Tente novamente.
        </Text>
        <TouchableOpacity
          style={tw`mt-4 bg-stone-200 px-4 py-2 rounded`}
          onPress={() => refetch()}>
          <Text>Recarregar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const profile = profileData;

  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-stone-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}>
          <CaretLeft size={24} color="#000000" weight="bold" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold`}>Minha Conta</Text>
        <View style={tw`w-10`} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1 mb-6`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
        {/* Profile Header */}
        <View style={tw`items-center pt-8 pb-6 px-6`}>
          <TouchableOpacity
            onPress={handleSelectAvatar}
            style={tw`relative w-24 h-24`}>
            <View style={tw`w-24 h-24 bg-blue-500 rounded-full items-center justify-center shadow-lg`}>
              {profile?.name ? (
                <Text style={tw`text-white text-3xl font-bold`}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <User size={40} color="#ffffff" weight="bold" />
              )}
            </View>
            <View style={tw`absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2 shadow-md z-10`}>
              <Camera size={16} color="#ffffff" weight="bold" />
            </View>
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold mt-4`}>
            {profile?.name || 'Sem nome'}
          </Text>
          <Text style={tw`text-gray-500 text-base mt-1`}>
            @{profile?.username || 'username'}
          </Text>
        </View>

        <View style={tw`px-6 pb-6`}>
          {/* Personal Info Section */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center mb-3`}>
              <User size={20} color="#6B7280" weight="bold" />
              <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                Informações Pessoais
              </Text>
            </View>

            {/* Nome Field */}
            {isEditingName ? (
              <View>
                <View style={tw`flex flex-row items-end mt-2`}>
                  <View style={tw`flex-1`}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: 'Nome é obrigatório',
                        minLength: {
                          value: 2,
                          message: 'Nome deve ter pelo menos 2 caracteres',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Nome deve ter no máximo 100 caracteres',
                        },
                      }}
                      render={({field: {onChange, value}}) => (
                        <View>
                          <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>
                            Nome completo
                          </Text>
                          <TextInput
                            style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                            placeholder="Digite seu nome completo"
                            placeholderTextColor="#9CA3AF"
                            value={value}
                            onChangeText={(text: string) => {
                              if (text.length <= 100) {
                                onChange(text);
                              }
                            }}
                            maxLength={100}
                          />
                        </View>
                      )}
                    />
                  </View>
                  <View style={tw`flex flex-row ml-2`}>
                    <TouchableOpacity
                      onPress={() => handleSaveField('name')}
                      style={tw`bg-green-500 p-3 rounded-lg mr-2 shadow-sm`}
                      disabled={putProfileMutation.isLoading}>
                      {putProfileMutation.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Check size={18} color="#fff" weight="bold" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelEdit('name')}
                      style={tw`bg-red-500 p-3 rounded-lg shadow-sm`}>
                      <X size={18} color="#fff" weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>
                <ValidationRules
                  field="name"
                  currentLength={watch('name')?.length || 0}
                />
                {errors.name && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.name.message}
                  </Text>
                )}
              </View>
            ) : (
              <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>
                      Nome completo
                    </Text>
                    <Text style={tw`text-base text-gray-900`}>
                      {profile?.name || 'Nome não definido'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsEditingName(true)}
                    style={tw`ml-3 p-2`}>
                    <PencilSimple size={20} color="#3B82F6" weight="bold" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Username Field */}
            {isEditingUsername ? (
              <View>
                <View style={tw`flex flex-row items-end mt-2`}>
                  <View style={tw`flex-1`}>
                    <Controller
                      name="username"
                      control={control}
                      rules={{
                        required: 'Username é obrigatório',
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+$/,
                          message:
                            'Username deve conter apenas letras, números, pontos, hífens e underscores',
                        },
                        minLength: {
                          value: 3,
                          message: 'Username deve ter pelo menos 3 caracteres',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Username deve ter no máximo 50 caracteres',
                        },
                      }}
                      render={({field: {onChange, value}}) => (
                        <View>
                          <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>
                            ID Person
                          </Text>
                          <View style={tw`bg-white border border-gray-300 rounded-xl flex-row items-center px-4`}>
                            <Text style={tw`text-base text-gray-700 font-medium`}>@</Text>
                            <TextInput
                              style={tw`flex-1 py-4 pl-2 text-base`}
                              placeholder="username123"
                              placeholderTextColor="#9CA3AF"
                              value={value}
                              onChangeText={(text: string) => {
                                const cleanText = text.replace(
                                  /[^a-zA-Z0-9._-]/g,
                                  '',
                                );
                                if (cleanText.length <= 50) {
                                  onChange(cleanText);
                                }
                              }}
                              maxLength={50}
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                  <View style={tw`flex flex-row ml-2`}>
                    <TouchableOpacity
                      onPress={() => handleSaveField('username')}
                      style={tw`bg-green-500 p-3 rounded-lg mr-2 shadow-sm`}
                      disabled={putProfileMutation.isLoading}>
                      {putProfileMutation.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Check size={18} color="#fff" weight="bold" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelEdit('username')}
                      style={tw`bg-red-500 p-3 rounded-lg shadow-sm`}>
                      <X size={18} color="#fff" weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>
                <ValidationRules
                  field="username"
                  currentLength={watch('username')?.length || 0}
                />
                {errors.username && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {errors.username.message}
                  </Text>
                )}
              </View>
            ) : (
              <View style={tw`bg-white border border-gray-200 rounded-xl p-4 mb-3`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>
                      Username (ID Person)
                    </Text>
                    <Text style={tw`text-base text-gray-900`}>
                      @{profile?.username || 'username_nao_definido'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsEditingUsername(true)}
                    style={tw`ml-3 p-2`}>
                    <PencilSimple size={20} color="#3B82F6" weight="bold" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Email Field (Read-only) */}
            <View style={tw`bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>E-mail</Text>
              <Text style={tw`text-base text-gray-700`}>
                {profile?.email || 'email@exemplo.com'}
              </Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={tw`mb-6 mt-6`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Phone size={20} color="#6B7280" weight="bold" />
              <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                Contato
              </Text>
            </View>

            {/* Phone Field */}
            <View>
              {isEditingPhone ? (
                <View>
                  <View style={tw`flex flex-row items-end`}>
                    <View style={tw`flex-1`}>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: 'Telefone é obrigatório',
                          validate: value => {
                            const cleanValue = removePhoneMask(value);
                            if (!/^[0-9]{10,11}$/.test(cleanValue)) {
                              return 'Telefone deve ter 10 ou 11 dígitos';
                            }
                            return true;
                          },
                        }}
                        render={({field: {onChange, value}}) => (
                          <View>
                            <Text style={tw`text-xs text-gray-600 mb-2 font-medium`}>
                              Telefone
                            </Text>
                            <TextInput
                              style={tw`bg-white border border-gray-300 rounded-xl p-4 text-base`}
                              placeholder="(XX) XXXXX-XXXX"
                              placeholderTextColor="#9CA3AF"
                              value={value}
                              onChangeText={(text: string) => {
                                const maskedValue = applyPhoneMask(text);
                                if (maskedValue.length <= 15) {
                                  onChange(maskedValue);
                                }
                              }}
                              keyboardType="numeric"
                              maxLength={15}
                            />
                          </View>
                        )}
                      />
                    </View>
                    <View style={tw`flex flex-row ml-2`}>
                      <TouchableOpacity
                        onPress={() => handleSaveField('phone')}
                        style={tw`bg-green-500 p-3 rounded-lg mr-2 shadow-sm`}
                        disabled={putProfileMutation.isLoading}>
                        {putProfileMutation.isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Check size={18} color="#fff" weight="bold" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleCancelEdit('phone')}
                        style={tw`bg-red-500 p-3 rounded-lg shadow-sm`}>
                        <X size={18} color="#fff" weight="bold" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <ValidationRules field="phone" />
                  {errors.phone && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={tw`bg-white border border-gray-200 rounded-xl p-4`}>
                  <View style={tw`flex-row items-center justify-between`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>Telefone</Text>
                      <Text style={tw`text-base text-gray-900`}>
                        {profile?.phoneNumber
                          ? applyPhoneMask(profile.phoneNumber)
                          : 'Não cadastrado'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setIsEditingPhone(true)}
                      style={tw`ml-3 p-2`}>
                      <PencilSimple size={20} color="#3B82F6" weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Address Section */}
          <View style={tw`mb-6 mt-6`}>
            <View style={tw`flex-row items-center mb-3`}>
              <MapPin size={20} color="#6B7280" weight="bold" />
              <Text style={tw`text-base font-semibold text-gray-700 ml-2`}>
                Gerenciar Endereços
              </Text>
            </View>
            <AddressManager />
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default MyAccount;
