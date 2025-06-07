import React, {ComponentProps} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import {MagnifyingGlass, Microphone, QrCode} from 'phosphor-react-native';

interface InputSearchProps extends ComponentProps<typeof TextInput> {
  hideMicrophone?: boolean;
  hideImageScanner?: boolean;
}

function InputSearch({
  hideMicrophone,
  hideImageScanner,
  ...props
}: InputSearchProps) {
  return (
    <View
      style={tw`flex-row items-center bg-stone-100 rounded-lg px-4 h-12`}>
      <MagnifyingGlass size={16} color="#696969" weight="regular" />
      <TextInput
        style={[tw`flex-1 ml-2 text-base text-stone-900`, {lineHeight: 20}]}
        placeholder="Buscar"
        placeholderTextColor="#666"
        {...props}
      />
      <View style={tw`flex-row items-center gap-4`}>
        {!hideMicrophone && (
          <TouchableOpacity>
            <Microphone size={20} color="#333" weight="regular" />
          </TouchableOpacity>
        )}
        {!hideImageScanner && (
          <TouchableOpacity>
            <QrCode size={20} color="#333" weight="regular" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default InputSearch;