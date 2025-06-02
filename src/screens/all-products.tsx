import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import {useNavigation} from '@react-navigation/native';
import {useProducts} from '../services/products/useProducts';
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

const AllProducts = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProducts({
    query: debouncedSearchTerm,
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

  const startVoiceRecognition = async () => {
    try {
      setIsListening(true);

      setTimeout(() => {
        setIsListening(false);

        setSearchTerm(prev => prev + (prev ? ' ' : '') + 'camiseta');
      }, 3000);
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
      setIsListening(false);
    }
  };

  const adaptProductToCardProps = (product: any): ProductCardProps => {
    return {
      id: product?.id || 0,
      name: product?.name || 'Produto sem nome',
      price: product?.price || 0,
      description: product?.description || '',
      images: product?.images || [],
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: product?.updatedAt || new Date().toISOString(),
      supplierId: product?.supplierId || 0,
      categoryId: product?.categoryId || 0,
      tags: product?.tags || null,
      stock: product?.stock || 0,
      supplier: product?.supplier || {id: 0, name: ''},
    };
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View
        style={tw`flex-row items-center px-4 py-2 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
          <ArrowLeft size={24} color="#000" weight="regular" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Todos os Produtos</Text>
      </View>

      <View style={tw`px-4 py-3 relative`}>
        <InputSearch
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          hideImageScanner
          hideMicrophone
        />

        <TouchableOpacity
          onPress={startVoiceRecognition}
          style={tw`absolute right-12 top-6`}
          disabled={isListening}>
          <Microphone
            size={20}
            color={isListening ? '#3b82f6' : '#666'}
            weight={isListening ? 'fill' : 'regular'}
          />
        </TouchableOpacity>

        {searchTerm ? (
          <TouchableOpacity
            onPress={clearSearch}
            style={tw`absolute right-6 top-6`}>
            <XCircle size={20} color="#666" weight="regular" />
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal visible={isListening} transparent={true} animationType="fade">
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-2xl w-4/5 items-center`}>
            <View
              style={tw`w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4`}>
              <Microphone size={40} color="#3b82f6" weight="fill" />
              <View
                style={[
                  tw`absolute w-full h-full rounded-full border-2 border-blue-400`,
                  {transform: [{scale: 1.1}]},
                ]}
              />
            </View>
            <Text style={tw`text-lg font-medium mb-2`}>Estou ouvindo...</Text>
            <Text style={tw`text-gray-600 text-center mb-4`}>
              Fale o nome do produto que você está procurando
            </Text>
            <TouchableOpacity
              style={tw`bg-red-500 py-2 px-4 rounded-lg`}
              onPress={() => setIsListening(false)}>
              <Text style={tw`text-white font-medium`}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          ) : products.length === 0 ? (
            <View style={tw`py-8 items-center`}>
              {searchTerm ? (
                <MagnifyingGlass size={56} color="#d1d5db" weight="regular" />
              ) : (
                <ShoppingBag size={56} color="#d1d5db" weight="regular" />
              )}
              <Text style={tw`mt-4 text-lg text-gray-500 text-center`}>
                {searchTerm
                  ? `Nenhum produto encontrado para "${searchTerm}"`
                  : 'Nenhum produto disponível'}
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
            <>
              {searchTerm && (
                <View style={tw`mb-4 mt-1`}>
                  <Text style={tw`text-gray-600`}>
                    Encontrados {products.length} resultado(s) para "
                    {searchTerm}"
                  </Text>
                </View>
              )}

              <View style={tw`flex-row flex-wrap justify-between`}>
                {products.map(product => (
                  <ProductCard
                    key={product?.id || Math.random()}
                    {...adaptProductToCardProps(product)}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllProducts;
