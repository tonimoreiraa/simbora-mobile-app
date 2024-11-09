import { ComponentProps } from 'react';
import { Control, Controller, FieldPath, FieldValues, PathString } from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';
import tw from 'twrnc';
interface InputProps<TFieldValues extends FieldValues> extends ComponentProps<typeof TextInput> {
  label?: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

function AccountInput<TFieldValues extends FieldValues>({ label, name, control, ...props }: InputProps<TFieldValues>) {
  return (
    <View style={tw`w-full`}>
      <Text style={tw`text-xs mb-1`}>
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return <TextInput
            style={tw`bg-stone-100 py-4 px-3 w-full rounded-md`}
            {...props}
            onChangeText={field.onChange}
            value={field.value}
          />
        }}
      />
    </View>
  );
};

export default AccountInput;