import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/Ionicons'

function InputSearch() {
  return (
    <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-4`}>
      <Icon name="search-outline" size={20} />
      <TextInput
        style={tw`flex-1 ml-2 text-base text-gray-900`}
        placeholder="Search"
        placeholderTextColor="#666"
      />
      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity>
          <Icon name="mic-outline" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="scan-outline" size={20}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default InputSearch;