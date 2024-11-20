import { ComponentProps, useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';

interface InputProps<TFieldValues extends FieldValues> extends ComponentProps<typeof TextInput> {
  label?: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  isPassword?: boolean;
}

function AccountInput<TFieldValues extends FieldValues>({ 
  label, 
  name, 
  control, 
  isPassword = false,
  ...props 
}: InputProps<TFieldValues>) {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  
  return (
    <View style={tw`w-full mt-2`}>
      <Text style={tw`text-xs mb-1`}>
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <>
              <View style={tw`relative flex-row items-center`}>
                <TextInput
                  style={tw`bg-stone-100 py-4 px-3 w-full rounded-md ${isPassword ? 'pr-12' : ''}`}
                  secureTextEntry={isPassword && hiddenPassword}
                  {...props}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {isPassword && (
                  <TouchableOpacity 
                    onPress={() => setHiddenPassword(!hiddenPassword)}
                    style={tw`absolute right-3`}
                  >
                    {hiddenPassword ? (
                      <Icon name='eye-off' size={24} />
                    ) : (
                     <Icon name='eye' size={24}/>
                    )}
                  </TouchableOpacity>
                )}
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

export default AccountInput;