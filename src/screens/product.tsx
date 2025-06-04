import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  ShoppingBagOpen,
  FireSimple,
  LightbulbFilament,
  CaretLeft,
  MagnifyingGlass,
  Microphone,
  QrCode,
} from 'phosphor-react-native';
import tw from 'twrnc';
import Carousel from '../components/carousel';
import ColorSelect from '../components/color_select';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import {useGetProductsId} from '../services/client/products/products'; // Usando a função da API gerada
import {useCart} from '../contexts/cart_provider';
import Toast from 'react-native-toast-message';
import {ForYouProducts} from '../components/for_you_products';
import {getCorrectImageUrl} from '../utils/image';

type RootStackParamList = {
  Cart: undefined;
  Product: {id: number};
};

interface Product {
  category: {
    id: number;
    name: string;
  };
  categoryId: number;
  createdAt: string;
  description: string;
  id: number;
  images: Array<{
    id: number;
    path: string;
    productId: number;
  }>;
  name: string;
  price: string;
  stock: number;
  supplier: {
    id: number;
    name: string;
  };
  supplierId: number;
  tags: Array<string>;
  updatedAt: string;
  variants: Array<any>;
}

const Product = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>();
  const productId = route.params.id;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Usando a função da API gerada em vez da função customizada
  const {data: productResponse, isLoading, isError, refetch} = useGetProductsId(productId);
  
  // Extrair os dados do produto da resposta da API
  const data = productResponse;

  const cart = useCart();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={tw`items-center justify-center flex-1 bg-white`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        {isLoading && (
          <Text style={tw`mt-4 text-gray-500`}>Carregando produto...</Text>
        )}
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={tw`items-center justify-center flex-1 bg-white px-4`}>
        <Text style={tw`text-lg text-red-500 font-semibold mb-2`}>
          Erro ao carregar produto
        </Text>
        <Text style={tw`text-gray-500 text-center mb-4`}>
          Não foi possível carregar os detalhes do produto.
        </Text>
        <TouchableOpacity
          style={tw`px-6 py-3 bg-blue-500 rounded-lg`}
          onPress={() => refetch()}>
          <Text style={tw`text-white font-medium`}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-6 py-3 mt-2`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-gray-500 font-medium`}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAddCart = () => {
    if (!data?.images || data.images.length === 0 || !data.id) {
      Toast.show({
        type: 'error',
        text1: 'Produto indisponível',
        text2: 'Este produto não pode ser adicionado ao carrinho.',
      });
      return;
    }

    cart.push({
      id: data.id,
      name: data.name ?? 'Produto sem nome',
      price: Number(data.price),
      quantity: 1,
      image: getCorrectImageUrl(data.images[0]?.path ?? ''), // Aplicando formatação da URL
    });
    
    Toast.show({
      type: 'success',
      text1: `${data.name} foi adicionado ao carrinho`,
      text2: 'Toque para ver seu carrinho.',
      onPress: () => navigation.navigate('Cart'),
    });
  };

  // Verificar se o produto está em estoque
  const isOutOfStock = (data?.stock ?? 0) <= 0;

  return (
    <SafeAreaView style={tw`py-4 bg-white`}>
      <ScrollView style={tw`mb-26`}>
        {/* Header with Search */}
        <View
          style={tw`flex flex-row items-center justify-center w-full px-4`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}>
            <CaretLeft
              size={28}
              color="#000000"
              weight="regular"
            />
          </TouchableOpacity>
          
          <View style={tw`flex-1`}>
            <View
              style={tw`flex-row items-center justify-center bg-black rounded-lg px-4 h-12`}>
              <MagnifyingGlass size={16} color="white" weight="regular" />
              <TextInput
                style={[tw`flex-1 ml-2 text-base text-white`, {lineHeight: 20}]}
                placeholder="Buscar"
                placeholderTextColor="white"
              />
              <View style={tw`flex-row gap-4`}>
                <TouchableOpacity>
                  <Microphone size={20} color="white" weight="regular" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <QrCode size={20} color="white" weight="regular" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            style={tw`ml-3`}>
            <ShoppingBagOpen
              size={28}
              weight="fill"
              color="#000000"
            />
          </TouchableOpacity>
        </View>

        {/* Product Images Carousel */}
        <View style={tw`mt-4`}>
          {data?.images && data.images.length > 0 ? (
            <Carousel items={data.images.map(image => getCorrectImageUrl(image.path ?? '')).filter((path): path is string => path !== '')} />
          ) : (
            <View style={tw`h-64 bg-gray-200 items-center justify-center mx-4 rounded-lg`}>
              <Text style={tw`text-gray-500`}>Sem imagens disponíveis</Text>
            </View>
          )}
        </View>

        {/* Product Name */}
        <View style={tw`p-4`}>
          <Text style={tw`text-xl font-bold`}>{data?.name}</Text>
          {isOutOfStock && (
            <Text style={tw`text-red-500 font-medium mt-1`}>Fora de estoque</Text>
          )}
        </View>

        {/* Category and Tags */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={tw`px-4`}>
            {data?.category && (
              <View
                style={tw`px-5 py-1 border-[0.5px] border-[#696969] rounded-full items-center gap-1 flex-row mr-2`}>
                <LightbulbFilament weight="fill" color="black" size={18} />
                <Text style={tw`text-lg text-stone-600`}>
                  {data.category.name}
                </Text>
              </View>
            )}
          </View>
          <View
            style={tw`px-5 py-1 border-[0.5px] border-[#696969] rounded-full items-center gap-1 flex-row`}>
            <FireSimple color="black" size={18} weight="fill" />
            <Text style={tw`text-stone-600 text-lg`}>Para você</Text>
          </View>
        </ScrollView>

        {/* Color Selection */}
        {data?.variants && data.variants.length > 0 && (
          <View style={tw`px-4`}>
            <Text style={tw`font-bold text-base text-stone-600 mt-4`}>
              Selecione a cor
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={tw`py-2`}>
              <ColorSelect />
              <ColorSelect />
              <ColorSelect />
              <ColorSelect />
            </ScrollView>
          </View>
        )}

        {/* Product Description */}
        <View style={tw`px-4`}>
          <Text style={tw`font-bold text-base text-stone-600 mt-2`}>
            Descrição
          </Text>
          <Text style={tw`text-stone-500 text-base`}>
            {data?.description || 'Descrição não disponível.'}
          </Text>
        </View>

        {/* Stock Information */}
        <View style={tw`px-4 mt-4`}>
          <Text style={tw`font-bold text-base text-stone-600`}>
            Disponibilidade
          </Text>
          <Text style={tw`text-stone-500 text-base`}>
            {(data?.stock ?? 0) > 0 ? `${data?.stock ?? 0} unidades em estoque` : 'Produto esgotado'}
          </Text>
        </View>

        {/* Supplier Information */}
        {data?.supplier && (
          <View style={tw`px-4 mt-4`}>
            <Text style={tw`font-bold text-base text-stone-600`}>
              Fornecedor
            </Text>
            <Text style={tw`text-stone-500 text-base`}>
              {data.supplier.name}
            </Text>
          </View>
        )}

        {/* Similar Products */}
        <View style={tw`px-4`}>
          <Text style={tw`font-semibold text-xl mt-4`}>Itens similares</Text>
          <ForYouProducts />
        </View>
      </ScrollView>

      {/* Bottom Cart Section */}
      <View
        style={tw`absolute flex-row items-center bottom-0 bg-white border-t border-stone-400 w-full py-8 px-4`}>
        <View style={tw`w-1/3`}>
          <View style={tw`flex flex-row items-center`}>
            <Text style={tw`text-lg font-semibold`}>
              {Number(data?.price ?? 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>
          <Text style={tw`font-semibold text-stone-300 mt-1`}>Em até 12x</Text>
        </View>
        <TouchableOpacity
          style={tw`flex flex-col items-center justify-center ${
            isOutOfStock ? 'bg-gray-400' : 'bg-blue-500'
          } p-4 rounded-xl w-2/3`}
          onPress={handleAddCart}
          disabled={isOutOfStock}>
          <Text style={tw`font-bold text-lg text-white`}>
            {isOutOfStock ? 'Indisponível' : 'Adicionar a sacola'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Product;