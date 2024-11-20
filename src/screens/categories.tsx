import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import { api } from '../services/api';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { useSearch } from '../helpers/search';
import { Category } from '../components/category';

const getCategories = async () => {
  const { data } = await api.get<Category[]>('/categories')
  return data
}

export default function Categories() {
  const {
    data,
    isLoading,
  } = useQuery('@categories', getCategories)

  const {
    setSearchTerm,
    searchTerm,
    filteredResults
  } = useSearch(data, 'name')

  return (
    <ScrollView style={tw`px-4`}>
      <InputSearch
        hideImageScanner
        onChangeText={(value) => setSearchTerm(value)}
        value={searchTerm}
      />
      <View style={tw`mt-4 flex-wrap flex-row flex-1`}>
        {filteredResults && filteredResults.map((category: any) => (
          <View style={tw`p-1 w-1/2`} key={category.id}>
             <View style={tw`bg-neutral-200 flex-row rounded-xl p-2 px-3 items-center gap-4`}>
              <Image
                source={{ uri: category.image }}
                width={50}
                height={50}
                resizeMode='contain'
              />
              <Text style={tw`text-base font-semibold`}>
                {category.name}
              </Text>
            </View>
          </View>
        ))}
        {isLoading && [...Array(10).keys()].map(c => (
          <View style={tw`p-1 w-1/2`} key={c}>
            <View style={tw`bg-neutral-200 flex-row rounded-xl p-2 px-3 items-center gap-4`} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
