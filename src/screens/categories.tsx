import React from 'react';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import Category from '../components/category';
import {useSearch} from '../helpers/search';
import {useGetCategories} from '../services/client/categories/categories'; // Usando a API gerada
import {useNavigation} from '@react-navigation/native';

export default function Categories() {
  const navigation = useNavigation<any>();

  // Usando a função da API gerada em vez da customizada
  const {
    data: categoriesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategories();

  // Extrair categorias da resposta da API
  const categories = categoriesResponse || [];

  const {setSearchTerm, searchTerm, filteredResults} = useSearch(
    categories,
    'name',
  );

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-500 text-lg font-bold mb-2`}>
          Não foi possível carregar as categorias
        </Text>
        <Text style={tw`text-gray-600 mb-4 text-center`}>
          {error instanceof Error
            ? error.message
            : 'Ocorreu um erro desconhecido'}
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
          onPress={() => refetch()}>
          <Text style={tw`text-white font-semibold`}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoriesToShow =
    filteredResults && filteredResults.length > 0
      ? filteredResults
      : categories;

  return (
    <ScrollView style={tw`px-4`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mt-4 mb-2`}>
        <Text style={tw`text-2xl font-bold text-black`}>Categorias</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-gray-500 text-base`}>
            Voltar <Text style={tw`text-lg`}>‹</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <InputSearch
        hideImageScanner
        onChangeText={value => setSearchTerm(value)}
        value={searchTerm}
        placeholder="Buscar categorias"
      />

      {/* Categories Grid */}
      <View style={tw`mt-4`}>
        {isLoading ? (
          // Loading Skeletons
          <View style={tw`flex-row flex-wrap justify-between`}>
            {[...Array(8).keys()].map(index => (
              <View style={tw`w-[106px] mb-4`} key={`skeleton-${index}`}>
                <View style={tw`w-24 h-24 bg-gray-200 rounded-xl mb-2`} />
                <View style={tw`w-full h-4 bg-gray-200 rounded`} />
              </View>
            ))}
          </View>
        ) : categoriesToShow.length > 0 ? (
          // Categories usando o componente Category
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`flex-row flex-wrap justify-between`}>
            {categoriesToShow.map(category => (
              <Category
                key={`category-${category.id}`}
                id={category.id!}
                name={category.name!}
                image={category.image}
                description={category.description}
                onPress={() =>
                  navigation.navigate('CategoryProducts', {
                    categoryId: category.id,
                    categoryName: category.name,
                  })
                }
              />
            ))}
          </ScrollView>
        ) : searchTerm ? (
          // No results message
          <View style={tw`w-full p-6 items-center`}>
            <Text style={tw`text-gray-500 text-center text-lg`}>
              Nenhuma categoria encontrada para "{searchTerm}"
            </Text>
            <TouchableOpacity
              style={tw`mt-4 px-4 py-2 bg-gray-200 rounded-lg`}
              onPress={() => setSearchTerm('')}>
              <Text style={tw`text-gray-700`}>Limpar busca</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Empty state
          <View style={tw`w-full p-6 items-center`}>
            <Text style={tw`text-gray-500 text-center text-lg`}>
              Nenhuma categoria disponível
            </Text>
          </View>
        )}
      </View>

      {/* Loading indicator when already has categories */}
      {isLoading && categories.length > 0 && (
        <View style={tw`w-full py-4 items-center`}>
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      )}

      {/* Bottom spacing */}
      <View style={tw`h-20`} />
    </ScrollView>
  );
}
