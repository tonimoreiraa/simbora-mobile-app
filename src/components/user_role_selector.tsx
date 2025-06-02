import {
  Control,
  FieldValues,
  FieldPath,
  Controller,
  useFormContext,
} from 'react-hook-form';
import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';

interface InputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

export function UserRoleSelector<T extends FieldValues>({
  name,
  control,
}: InputProps<T>) {
  return (
    <View style={tw`flex-col justify-between w-full py-2`}>
      <Controller
        name={name}
        control={control}
        render={({field, fieldState}) => {
          return (
            <>
              <View style={tw`flex-row justify-between w-full`}>
                <TouchableOpacity
                  style={tw`flex px-4 justify-center border border-blue-500 py-3 w-46 rounded-lg ${
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
                  style={tw`flex px-4 justify-center border border-blue-500 py-3 w-46 rounded-lg ${
                    field.value === 'professional'
                      ? 'bg-blue-500 border-transparent'
                      : ''
                  }`}
                  onPress={() => field.onChange('professional')}>
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
                    Sou eletricista
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
    </View>
  );
}
