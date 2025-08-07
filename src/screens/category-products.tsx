import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useGetProducts} from '../services/client/products/products';
import {
  ArrowLeft,
  Microphone,
  XCircle,
  WarningCircle,
  MagnifyingGlass,
  ShoppingBag,
} from 'phosphor-react-native';
import ProductCard, {
  Product as ProductCardProps,
} from '../components/product_card';

interface CategoryProductsRouteParams {
  categoryId: number;
  categoryName?: string;
}

const CategoryProducts = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {categoryId, categoryName} =
    route.params as CategoryProductsRouteParams;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Buscar produtos da categoria com busca opcional
  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProducts({
    categoryId: categoryId,
    ...(debouncedSearchTerm && {query: debouncedSearchTerm}),
  });

  const allProducts = productsResponse?.data || [];

  const clearSearch = () => {
    setSearchTerm('');
  };

  const adaptProductToCardProps = (product: any): ProductCardProps => {
    return {
      id: product?.id || 0,
      name: product?.name || 'Produto sem nome',
      price: product?.price || 0,
      description: product?.description || '',
      images: product?.images || [],
      createdAt: product?.createdAt || new Date().toISOString(),
      supplierId: product?.supplierId || 0,
      categoryId: product?.categoryId || 0,
      tags: product?.tags || [],
      stock: product?.stock || 0,
      supplier: product?.supplier?.name || 'Fornecedor não informado',
    };
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-200`}>
        <View style={tw`flex-row items-center flex-1`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}>
            <ArrowLeft size={24} color="#000" weight="regular" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold flex-1`} numberOfLines={1}>
            {categoryName || 'Produtos da Categoria'}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={tw`px-4 py-3 relative`}>
        <InputSearch
          placeholder={`Buscar em ${categoryName || 'categoria'}`}
          value={searchTerm}
          onChangeText={setSearchTerm}
          hideImageScanner
          hideMicrophone
        />

        {searchTerm ? (
          <TouchableOpacity
            onPress={clearSearch}
            style={tw`absolute right-6 top-6`}>
            <XCircle size={20} color="#666" weight="regular" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Results Count */}
      {(searchTerm || allProducts.length > 0) && (
        <View style={tw`px-4 pb-2`}>
          <Text style={tw`text-sm text-gray-600`}>
            {allProducts.length} produto(s) encontrado(s)
            {searchTerm && ` para "${searchTerm}"`}
          </Text>
        </View>
      )}

      {/* Products List */}
      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 pb-8`}>
          {isLoading ? (
            <View style={tw`py-8 items-center`}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={tw`mt-4 text-gray-500`}>
                {searchTerm
                  ? `Buscando por "${searchTerm}"...`
                  : 'Carregando produtos...'}
              </Text>
            </View>
          ) : isError ? (
            <View style={tw`py-8 items-center`}>
              <WarningCircle size={56} color="#f87171" weight="regular" />
              <Text style={tw`mt-4 text-lg text-red-500 font-semibold`}>
                Oops! Algo deu errado.
              </Text>
              <Text style={tw`mt-2 text-gray-500 text-center`}>
                Não foi possível carregar os produtos.
              </Text>
              <TouchableOpacity
                style={tw`mt-4 px-4 py-2 bg-blue-500 rounded-lg`}
                onPress={() => refetch()}>
                <Text style={tw`text-white font-medium`}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : allProducts.length === 0 ? (
            <View style={tw`py-8 items-center`}>
              {searchTerm ? (
                <MagnifyingGlass size={56} color="#d1d5db" weight="regular" />
              ) : (
                <ShoppingBag size={56} color="#d1d5db" weight="regular" />
              )}
              <Text style={tw`mt-4 text-lg text-gray-500 text-center`}>
                {searchTerm
                  ? 'Nenhum produto encontrado'
                  : 'Nenhum produto disponível nesta categoria'}
              </Text>
              {searchTerm && (
                <TouchableOpacity
                  style={tw`mt-4 px-4 py-2 bg-blue-500 rounded-lg`}
                  onPress={clearSearch}>
                  <Text style={tw`text-white font-medium`}>Limpar busca</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={tw`flex-row flex-wrap justify-between`}>
              {allProducts.map(product => (
                <ProductCard
                  key={product?.id || Math.random()}
                  {...adaptProductToCardProps(product)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryProducts;
