import React, { ComponentProps } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/Ionicons'

interface InputSearchProps extends ComponentProps<typeof TextInput> {
  hideMicrophone?: boolean
  hideImageScanner?: boolean
}

function InputSearch({ hideMicrophone, hideImageScanner, ...props }: InputSearchProps) {
  return (
    <View style={tw`flex-row items-center justify-center bg-stone-100 rounded-lg px-4 h-12`}>
      <Icon name="search-outline" size={16} color="#696969" />
      <TextInput
        style={tw`flex-1 ml-2 text-base text-stone-900`}
        placeholder="Buscar"
        placeholderTextColor="#666"
        {...props}
      />
      <View style={tw`flex-row gap-4`}>
        {!hideMicrophone && <TouchableOpacity>
          <Icon name="mic" size={20} />
        </TouchableOpacity>}
        {!hideImageScanner && <TouchableOpacity>
          <Icon name="scan" size={20} />
        </TouchableOpacity>}
      </View>
    </View>
  )
}

export default InputSearch;