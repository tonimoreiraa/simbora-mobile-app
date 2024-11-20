import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/Ionicons'

function InputSearch() {
  return (
    <View style={tw`flex-row items-center justify-center bg-stone-200 rounded-lg px-4 h-12`}>
      <Icon name="search-outline" size={16} color="#696969" />
      <TextInput
        style={tw`flex-1 ml-2 text-base text-stone-900`}
        placeholder="Buscar"
        placeholderTextColor="#666"
      />
      <View style={tw`flex-row gap-4`}>
        <TouchableOpacity>
          <Icon name="mic" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="scan" size={20}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default InputSearch;