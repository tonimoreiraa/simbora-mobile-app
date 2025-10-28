import {useState} from 'react';
import {
  Control,
  FieldValues,
  FieldPath,
  Controller,
  useWatch,
} from 'react-hook-form';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import {X} from 'phosphor-react-native';
import tw from 'twrnc';
import {PROFESSIONAL_TYPES} from '../constants/professional-types';

interface InputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  professionalTypeName?: FieldPath<TFieldValues>;
}

export function UserRoleSelector<T extends FieldValues>({
  name,
  control,
  professionalTypeName,
}: InputProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const roleValue = useWatch({control, name});

  return (
    <View style={tw`flex-col justify-between w-full py-2`}>
      <Controller
        name={name}
        control={control}
        render={({field, fieldState}) => {
          return (
            <>
              <View style={tw`flex-row justify-between w-full gap-3`}>
                <TouchableOpacity
                  style={tw`flex-1 px-3 justify-center border border-blue-500 py-3 rounded-lg ${
                    field.value === 'customer'
                      ? 'bg-blue-500 border-transparent'
                      : ''
                  }`}
                  onPress={() => field.onChange('customer')}>
                  <Text
                    style={tw`font-light text-xs ${
                      field.value === 'customer' ? 'text-white' : ''
                    }`}>
                    Selecione se:
                  </Text>
                  <Text
                    style={tw`text-base ${
                      field.value === 'customer' ? 'text-white' : ''
                    }`}>
                    Sou cliente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`flex-1 px-3 justify-center border border-blue-500 py-3 rounded-lg ${
                    field.value === 'professional'
                      ? 'bg-blue-500 border-transparent'
                      : ''
                  }`}
                  onPress={() => {
                    field.onChange('professional');
                    if (professionalTypeName) {
                      setModalVisible(true);
                    }
                  }}>
                  <Text
                    style={tw`font-light text-xs ${
                      field.value === 'professional' ? 'text-white' : ''
                    }`}>
                    Selecione se:
                  </Text>
                  <Text
                    style={tw`text-base ${
                      field.value === 'professional' ? 'text-white' : ''
                    }`}>
                    Sou profissional
                  </Text>
                </TouchableOpacity>
              </View>
              {fieldState.error && (
                <Text style={tw`text-red-500 text-xs mt-0.5`}>
                  {fieldState.error.message}
                </Text>
              )}
            </>
          );
        }}
      />

      {professionalTypeName && roleValue === 'professional' && (
        <Controller
          name={professionalTypeName}
          control={control}
          render={({field: professionalField, fieldState: professionalFieldState}) => {
            return (
              <>
                <TouchableOpacity
                  style={tw`mt-3 border border-neutral-200 bg-gray-50 py-4 px-3 rounded-lg`}
                  onPress={() => setModalVisible(true)}>
                  <Text style={tw`text-xs text-stone-500 mb-1`}>
                    Tipo de profissional
                  </Text>
                  <Text
                    style={tw`text-base ${
                      professionalField.value ? 'text-black' : 'text-stone-400'
                    }`}>
                    {professionalField.value || 'Selecione sua área'}
                  </Text>
                </TouchableOpacity>

                {professionalFieldState.error && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>
                    {professionalFieldState.error.message}
                  </Text>
                )}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}>
                  <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                    <Pressable
                      style={tw`flex-1`}
                      onPress={() => setModalVisible(false)}
                    />
                    <View style={tw`bg-white rounded-t-3xl max-h-[70%]`}>
                      <View
                        style={tw`flex-row items-center justify-between px-6 py-4 border-b border-stone-200`}>
                        <Text style={tw`text-lg font-semibold`}>
                          Selecione sua área
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <X size={24} color="#000000" weight="bold" />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={tw`px-6 py-2`}>
                        {PROFESSIONAL_TYPES.map(type => (
                          <TouchableOpacity
                            key={type}
                            style={tw`py-4 border-b border-stone-100 ${
                              professionalField.value === type
                                ? 'bg-blue-50'
                                : ''
                            }`}
                            onPress={() => {
                              professionalField.onChange(type);
                              setModalVisible(false);
                            }}>
                            <Text
                              style={tw`text-base ${
                                professionalField.value === type
                                  ? 'text-blue-500 font-semibold'
                                  : 'text-black'
                              }`}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              </>
            );
          }}
        />
      )}
    </View>
  );
}
