import {ComponentProps, useEffect, useState} from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import {Animated, Text, TextInput, View} from 'react-native';
import tw from 'twrnc';

interface InputProps<TFieldValues extends FieldValues>
  extends Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  defaultValue?: string;
  rules?: RegisterOptions;
}

function UsernameInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  defaultValue,
  rules,
  ...props
}: InputProps<TFieldValues>) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useState(() => new Animated.Value(0))[0];

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
                  {/* @ Prefix */}
                  <View
                    style={tw`absolute left-3 z-10 ${
                      isFocused || hasValue ? '' : 'opacity-0'
                    }`}>
                    <Text style={tw`text-base text-stone-700 font-medium`}>
                      @
                    </Text>
                  </View>

                  {/* Input */}
                  <TextInput
                    style={tw`bg-gray-50 border border-neutral-200 py-4 ${
                      isFocused || hasValue ? 'pl-7 pr-3' : 'pl-3 pr-3'
                    } w-full rounded-lg ${isFocused ? 'border-blue-500' : ''}`}
                    {...props}
                    placeholder=""
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={text => {
                      // Remove @ if user types it
                      const cleanText = text.replace(/^@/, '');
                      field.onChange(cleanText);
                    }}
                    value={field.value || ''}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                  />
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

export default UsernameInput;
