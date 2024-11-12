import { ComponentProps } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';
import tw from 'twrnc';
interface InputProps<TFieldValues extends FieldValues> extends ComponentProps<typeof TextInput> {
  label?: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

function AccountInput<TFieldValues extends FieldValues>({ label, name, control, ...props }: InputProps<TFieldValues>) {
  return (
    <View style={tw`w-full mt-3`}>
      <Text style={tw`text-xs mb-1`}>
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return <>
            <TextInput
              style={tw`bg-stone-100 py-4 px-3 w-full rounded-md`}
              {...props}
              onChangeText={field.onChange}
              value={field.value}
            />
            {fieldState.error && <Text style={tw`text-red-500 text-xs mt-0.5`}>
              {fieldState.error.message}
            </Text>}
          </>
        }}
      />
    </View>
  );
};

export default AccountInput;