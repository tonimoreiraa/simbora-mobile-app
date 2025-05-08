import React from 'react';
import {Image, ScrollView, Text, View, ActivityIndicator, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import { useSearch } from '../helpers/search';
import { useGetAllCategories } from '../services/category/useCategories';

export default function Categories() {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllCategories();
  
  const {
    setSearchTerm,
    searchTerm,
    filteredResults
  } = useSearch(categories, 'name');
  
  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-500 text-lg font-bold mb-2`}>
          Não foi possível carregar as categorias
        </Text>
        <Text style={tw`text-gray-600 mb-4 text-center`}>
          {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
          onPress={() => refetch()}
        >
          <Text style={tw`text-white font-semibold`}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const categoriesToShow = filteredResults && filteredResults.length > 0 ? filteredResults : [];
  
  return (
    <ScrollView style={tw`px-4`}>
      <View style={tw`flex-row justify-between items-center mt-4 mb-2`}>
        <Text style={tw`text-2xl font-bold text-black`}>Categorias</Text>
        <TouchableOpacity>
          <Text style={tw`text-gray-500 text-base`}>Ver todas <Text style={tw`text-lg`}>›</Text></Text>
        </TouchableOpacity>
      </View>
      
      <InputSearch
        hideImageScanner
        onChangeText={(value) => setSearchTerm(value)}
        value={searchTerm}
      />
      
      <View style={tw`mt-4 flex-wrap flex-row flex-1`}>
        {isLoading ? (
          [...Array(8).keys()].map((index) => (
            <View style={tw`p-1 w-1/4`} key={`skeleton-${index}`}>
              <View style={tw`bg-neutral-200 rounded-3xl aspect-square w-full`} />
            </View>
          ))
        ) : categoriesToShow.length > 0 ? (
          categoriesToShow.map((category) => (
            <View style={tw`p-1 w-1/4`} key={`category-${category.id}`}>
              <TouchableOpacity>
                <View style={tw`rounded-3xl aspect-square w-full overflow-hidden relative`}>
                  <Image
                    source={{ uri: category.image }}
                    style={tw`w-full h-full absolute`}
                    resizeMode='cover'
                  />
                  
                  <View style={tw`absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-35`} />
                  
                  <View style={tw`absolute bottom-1.5 left-0 right-0 px-2`}>
                    <Text 
                      style={tw`text-white text-center font-semibold text-xs`} 
                      numberOfLines={2}
                    >
                      {category.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : searchTerm ? (
          <View style={tw`w-full p-6 items-center`} key="no-results">
            <Text style={tw`text-gray-500 text-center`}>
              Nenhuma categoria encontrada para "{searchTerm}"
            </Text>
          </View>
        ) : null}
      </View>
      
      {isLoading && categories.length > 0 && (
        <View style={tw`w-full py-4 items-center`} key="loading-indicator">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
}