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
} from 'react-native';
import tw from 'twrnc';
import {useForm, Controller} from 'react-hook-form';
import {
  PencilSimple,
  Check,
  X,
  FolderSimple,
  ArrowLeft,
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

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <TouchableOpacity></TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Minha conta</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 pb-6`}>
          <View
            style={tw`flex flex-row items-center justify-between bg-stone-100 w-full p-2 mt-4 rounded-xl`}>
            <View style={tw`flex flex-row items-center justify-center`}>
              <View style={tw`w-14 h-14 bg-stone-200 rounded-lg`}></View>
              <View style={tw`ml-4`}>
                <Text style={tw`text-lg font-bold`}>Foto de perfil</Text>
                <Text style={tw`text-xs text-gray-500`}>
                  JPG, PNG ou JPEG - máximo 2MB
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSelectAvatar}>
              <FolderSimple size={20} weight="fill" color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={tw`w-full mt-6`}>
            <Text style={tw`text-xl font-bold mb-2`}>Nome</Text>

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
                          <TextInput
                            style={tw`bg-stone-100 rounded-lg p-4`}
                            placeholder="Digite seu nome completo"
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
              <View
                style={tw`flex flex-row items-center bg-stone-100 rounded-lg p-4`}>
                <Text style={tw`flex-1 text-base`}>
                  {profile?.name || 'Nome não definido'}
                </Text>
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <PencilSimple size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={tw`w-full mt-4`}>
            <Text style={tw`text-xl font-bold mb-2`}>Seu id person</Text>

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
                          <TextInput
                            style={tw`bg-stone-100 rounded-lg p-4`}
                            placeholder="username123"
                            value={value}
                            onChangeText={(text: string) => {
                              // Remove caracteres inválidos e limita a 50 caracteres
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
              <View
                style={tw`flex flex-row items-center bg-stone-100 rounded-lg p-4`}>
                <Text style={tw`flex-1 text-base`}>
                  {profile?.username
                    ? `@${profile.username}`
                    : '@username_nao_definido'}
                </Text>
                <TouchableOpacity onPress={() => setIsEditingUsername(true)}>
                  <PencilSimple size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={tw` mt-4 w-full`}>
            <Text style={tw`text-xl font-bold`}>Seu login</Text>
            <View style={tw`mt-2`}>
              <View style={tw`bg-stone-100 rounded-lg p-4`}>
                <Text style={tw`text-sm text-gray-500`}>E-mail cadastrado</Text>
                <Text style={tw`text-base`}>
                  {profile?.email || 'email@exemplo.com'}
                </Text>
              </View>
            </View>

            <View style={tw`mt-4`}>
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
                            <TextInput
                              style={tw`bg-stone-100 rounded-lg p-4`}
                              placeholder="(XX) XXXXX-XXXX"
                              value={value}
                              onChangeText={(text: string) => {
                                const maskedValue = applyPhoneMask(text);
                                // Limita a 15 caracteres (máscara completa)
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
                <View
                  style={tw`flex flex-row items-center bg-stone-100 rounded-lg p-4`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm text-gray-500`}>
                      Número cadastrado
                    </Text>
                    <Text style={tw`text-base`}>
                      {profile?.phoneNumber
                        ? applyPhoneMask(profile.phoneNumber)
                        : 'Telefone não cadastrado'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsEditingPhone(true)}>
                    <PencilSimple size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <AddressManager />

          <View style={tw`mt-4 w-full`}>
            <Text style={tw`text-xl font-bold`}>Cartões cadastrados</Text>
            <View style={tw`w-full mt-2`}>
              <View style={tw`bg-stone-100 rounded-lg p-4 mb-2`}>
                <Text style={tw`text-sm text-gray-500`}>Sandro G Silva</Text>
                <Text style={tw`font-medium text-base`}>
                  5558 8991 **** 6998
                </Text>
              </View>

              <View style={tw`bg-stone-100 rounded-lg p-4 mb-2`}>
                <Text style={tw`text-sm text-gray-500`}>Sandro G Silva</Text>
                <Text style={tw`font-medium text-base`}>
                  5558 8991 **** 6998
                </Text>
              </View>

              <TouchableOpacity
                style={tw`bg-stone-100 rounded-lg p-4 flex-row items-center justify-between`}>
                <View>
                  <Text style={tw`text-sm text-gray-500`}>
                    Adicionar cartão
                  </Text>
                  <Text style={tw`font-medium text-base`}>
                    0000 0000 0000 0000
                  </Text>
                </View>
                <View
                  style={tw`bg-black rounded-full w-6 h-6 items-center justify-center`}>
                  <Text style={tw`text-white text-lg font-bold pb-7.5`}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyAccount;
