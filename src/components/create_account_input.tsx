import {ComponentProps, useEffect, useState} from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import {Animated, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Eye, EyeSlash} from 'phosphor-react-native';
import tw from 'twrnc';

interface InputProps<TFieldValues extends FieldValues>
  extends Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'> {
  label?: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  isPassword?: boolean;
  defaultValue?: string;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

function AccountInput<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  isPassword = false,
  defaultValue,
  rules,
  ...props
}: InputProps<TFieldValues>) {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useState(
    () => new Animated.Value(0),
  )[0];

  return (
    <View style={tw`w-full`}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as any}
        rules={rules}
        render={({field, fieldState}) => {
          const hasValue = field.value && field.value.length > 0;
          const shouldFloat = isFocused || hasValue;

          // Update animation value when field value changes
          useEffect(() => {
            if (hasValue && !isFocused) {
              Animated.timing(animatedIsFocused, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false,
              }).start();
            }
          }, [hasValue]);

          const handleFocus = () => {
            setIsFocused(true);
            Animated.timing(animatedIsFocused, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }).start();
          };

          const handleBlur = () => {
            if (!hasValue) {
              setIsFocused(false);
              Animated.timing(animatedIsFocused, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start();
            }
          };

          const labelStyle = {
            position: 'absolute' as const,
            left: 12,
            top: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [16, -8],
            }),
            fontSize: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 12],
            }),
            color: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: ['#737373', '#525252'],
            }),
            backgroundColor: shouldFloat ? '#ffffff' : 'transparent',
            paddingHorizontal: shouldFloat ? 4 : 0,
            zIndex: 1,
          };

          return (
            <>
              <View style={tw``}>
                <Animated.Text style={labelStyle}>{label}</Animated.Text>
                <View style={tw`relative flex-row items-center`}>
                  <TextInput
                    style={tw`bg-gray-50 border border-neutral-200 py-4 px-3 w-full rounded-lg ${
                      isPassword ? 'pr-12' : ''
                    } ${isFocused ? 'border-blue-500' : ''}`}
                    secureTextEntry={isPassword && hiddenPassword}
                    {...props}
                    placeholder=""
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={field.onChange}
                    value={field.value || ''}
                  />
                  {isPassword && (
                    <TouchableOpacity
                      onPress={() => setHiddenPassword(!hiddenPassword)}
                      style={tw`absolute right-3`}>
                      {hiddenPassword ? (
                        <EyeSlash size={20} color="#737373" weight="light" />
                      ) : (
                        <Eye size={20} color="#737373" weight="light" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {fieldState.error && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
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
