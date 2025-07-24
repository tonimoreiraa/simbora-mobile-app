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
import {useGetProducts} from '../services/client/products/products'; // Usando a função correta da API
import {
  ArrowLeft,
  Microphone,
  XCircle,
  WarningCircle,
  MagnifyingGlass,
  ShoppingBag,
  FunnelSimple,
  SortAscending,
  SortDescending,
} from 'phosphor-react-native';
import ProductCard, {
  Product as ProductCardProps,
} from '../components/product_card';

// Tipos para os filtros locais (que não estão na API)
interface LocalFilterState {
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

const AllProducts = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<LocalFilterState>({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Usando a função correta da API com apenas os parâmetros que existem
  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProducts(
    debouncedSearchTerm
      ? {
          query: debouncedSearchTerm,
        }
      : undefined,
  );

  // Extrair e filtrar produtos localmente
  const allProducts = productsResponse?.data || [];

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = [...allProducts];

    // Aplicar filtros locais
    if (localFilters.minPrice !== undefined) {
      filtered = filtered.filter(
        product => (product.price ?? 0) >= localFilters.minPrice!,
      );
    }

    if (localFilters.maxPrice !== undefined) {
      filtered = filtered.filter(
        product => (product.price ?? 0) <= localFilters.maxPrice!,
      );
    }

    if (localFilters.inStock) {
      filtered = filtered.filter(product => (product.stock ?? 0) > 0);
    }

    // Aplicar ordenação local
    if (localFilters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (localFilters.sortBy) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
            break;
          case 'price':
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return localFilters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return localFilters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allProducts, localFilters]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilters = () => {
    setLocalFilters({
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const toggleSortOrder = () => {
    setLocalFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
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
      supplierId: product?.supplierId || 0,
      categoryId: product?.categoryId || 0,
      tags: product?.tags || null,
      stock: product?.stock || 0,
      supplier: product?.supplier?.name || 'Fornecedor não informado', // ✅ Corrigido: extraindo apenas o nome
    };
  };

  const hasActiveFilters =
    localFilters.minPrice !== undefined ||
    localFilters.maxPrice !== undefined ||
    localFilters.inStock === true;

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}>
            <ArrowLeft size={24} color="#000" weight="regular" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold`}>Todos os Produtos</Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={toggleSortOrder} style={tw`mr-3 p-2`}>
            {localFilters.sortOrder === 'asc' ? (
              <SortAscending size={20} color="#666" weight="regular" />
            ) : (
              <SortDescending size={20} color="#666" weight="regular" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={tw`p-2 relative`}>
            <FunnelSimple
              size={20}
              color={hasActiveFilters ? '#3b82f6' : '#666'}
              weight={hasActiveFilters ? 'fill' : 'regular'}
            />
            {hasActiveFilters && (
              <View
                style={tw`absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full`}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={tw`px-4 py-3 relative`}>
        <InputSearch
          placeholder="Buscar produtos"
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

      {/* Active Filters Indicator */}
      {(hasActiveFilters || searchTerm) && (
        <View style={tw`px-4 pb-2`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-sm text-gray-600`}>
              {filteredAndSortedProducts.length} produto(s) encontrado(s)
              {searchTerm && ` para "${searchTerm}"`}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={tw`text-sm text-blue-500 font-medium`}>
                  Limpar filtros
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Voice Recognition Modal */}
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

      {/* Filters Modal */}
      <Modal visible={showFilters} transparent={true} animationType="slide">
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl max-h-4/5`}>
            {/* Filter Header */}
            <View
              style={tw`flex-row items-center justify-between p-4 border-b border-gray-200`}>
              <Text style={tw`text-lg font-bold`}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <XCircle size={24} color="#666" weight="regular" />
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`p-4`}>
              {/* Sort By */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold mb-3`}>
                  Ordenar por
                </Text>
                <View style={tw`flex-row flex-wrap`}>
                  {[
                    {key: 'name', label: 'Nome'},
                    {key: 'price', label: 'Preço'},
                    {key: 'createdAt', label: 'Mais recente'},
                  ].map(sort => (
                    <TouchableOpacity
                      key={sort.key}
                      onPress={() =>
                        setLocalFilters(prev => ({
                          ...prev,
                          sortBy: sort.key as any,
                        }))
                      }
                      style={tw`mr-2 mb-2 px-4 py-2 rounded-full border ${
                        localFilters.sortBy === sort.key
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}>
                      <Text
                        style={tw`${
                          localFilters.sortBy === sort.key
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}>
                        {sort.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold mb-3`}>
                  Faixa de preço
                </Text>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Valor mínimo
                    </Text>
                    <TouchableOpacity
                      style={tw`p-3 border border-gray-300 rounded-lg`}
                      onPress={() => {
                        // Modal para inserir preço mínimo
                      }}>
                      <Text
                        style={tw`${
                          localFilters.minPrice ? 'text-black' : 'text-gray-400'
                        }`}>
                        {localFilters.minPrice
                          ? `R$ ${localFilters.minPrice}`
                          : 'Mín'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={tw`flex-1 ml-2`}>
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Valor máximo
                    </Text>
                    <TouchableOpacity
                      style={tw`p-3 border border-gray-300 rounded-lg`}
                      onPress={() => {
                        // Modal para inserir preço máximo
                      }}>
                      <Text
                        style={tw`${
                          localFilters.maxPrice ? 'text-black' : 'text-gray-400'
                        }`}>
                        {localFilters.maxPrice
                          ? `R$ ${localFilters.maxPrice}`
                          : 'Máx'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Stock Filter */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold mb-3`}>
                  Disponibilidade
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setLocalFilters(prev => ({
                      ...prev,
                      inStock: prev.inStock === true ? undefined : true,
                    }))
                  }
                  style={tw`flex-row items-center p-3 border rounded-lg ${
                    localFilters.inStock
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}>
                  <View
                    style={tw`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      localFilters.inStock
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                    {localFilters.inStock && (
                      <Text style={tw`text-white text-xs`}>✓</Text>
                    )}
                  </View>
                  <Text style={tw`text-gray-700`}>
                    Apenas produtos em estoque
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Apply/Clear Buttons */}
              <View style={tw`flex-row mt-6 mb-4`}>
                <TouchableOpacity
                  onPress={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                  style={tw`flex-1 mr-2 p-3 border border-gray-300 rounded-lg`}>
                  <Text style={tw`text-center text-gray-700 font-medium`}>
                    Limpar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  style={tw`flex-1 ml-2 p-3 bg-blue-500 rounded-lg`}>
                  <Text style={tw`text-center text-white font-medium`}>
                    Aplicar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
          ) : filteredAndSortedProducts.length === 0 ? (
            <View style={tw`py-8 items-center`}>
              {searchTerm || hasActiveFilters ? (
                <MagnifyingGlass size={56} color="#d1d5db" weight="regular" />
              ) : (
                <ShoppingBag size={56} color="#d1d5db" weight="regular" />
              )}
              <Text style={tw`mt-4 text-lg text-gray-500 text-center`}>
                {searchTerm || hasActiveFilters
                  ? 'Nenhum produto encontrado'
                  : 'Nenhum produto disponível'}
              </Text>
              {(searchTerm || hasActiveFilters) && (
                <TouchableOpacity
                  style={tw`mt-4 px-4 py-2 bg-blue-500 rounded-lg`}
                  onPress={() => {
                    clearSearch();
                    clearFilters();
                  }}>
                  <Text style={tw`text-white font-medium`}>Limpar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={tw`flex-row flex-wrap justify-between`}>
              {filteredAndSortedProducts.map(product => (
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

export default AllProducts;
