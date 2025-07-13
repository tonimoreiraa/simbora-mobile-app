import {useState} from 'react';
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
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import {useGetProductsId} from '../services/client/products/products';
import {useCart} from '../contexts/cart_provider';
import Toast from 'react-native-toast-message';
import {ForYouProducts} from '../components/for_you_products';
import {getCorrectImageUrl} from '../utils/image';
import VariantSelect from '../components/variant_select';
import { ChatCard } from '../components/chat_card';

type RootStackParamList = {
  Cart: undefined;
  Product: {id: number};
};

interface Variant {
  id: number;
  value: string;
  unit: string;
  price: string;
  photo: string;
  variantTypeId: number;
  type: {
    id: number;
    name: string;
    defaultUnit: string;
  };
}

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
  variants: Array<Variant>;
}

const Product = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>();
  const productId = route.params.id;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const {
    data: productResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProductsId(productId);

  const data = productResponse;
  const cart = useCart();

  const handleVariantSelect = (variantValue: string | null) => {
    if (variantValue === null) {
      setSelectedVariant(null);
      return;
    }

    const variant = data?.variants?.find(v => v.value === variantValue);
    if (variant) {
      setSelectedVariant({
        ...variant,
        price: variant.price?.toString() ?? '0'
      } as Variant);
    } else {
      setSelectedVariant(null);
    }
  };

  const getDisplayImages = () => {
    if (selectedVariant && selectedVariant.photo) {
      return [selectedVariant.photo];
    }
    if (data?.images && data.images.length > 0) {
      return data.images
        .map(image => getCorrectImageUrl(image.path ?? ''))
        .filter((path): path is string => path !== '');
    }
    
    return [];
  };

  const getDisplayPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return selectedVariant.price;
    }
    return data?.price ?? '0';
  };

  const getDisplayUnit = () => {
    if (selectedVariant && selectedVariant.unit) {
      return selectedVariant.unit;
    }
    if (selectedVariant && selectedVariant.type?.defaultUnit) {
      return selectedVariant.type.defaultUnit;
    }
    return '';
  };

  const getDisplayName = () => {
    if (selectedVariant && selectedVariant.value) {
      return `${data?.name} - ${selectedVariant.value}`;
    }
    return data?.name ?? 'Produto sem nome';
  };

  const getInstallmentPrice = () => {
    const price = Number(getDisplayPrice());
    const installments = 12;
    const installmentValue = price / installments;
    
    return installmentValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getVariantTypeName = () => {
    if (data?.variants && data.variants.length > 0 && data.variants[0]?.type?.name) {
      return data.variants[0].type.name.toLowerCase();
    }
    return 'opção';
  };

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
      <SafeAreaView
        style={tw`items-center justify-center flex-1 bg-white px-4`}>
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
    const displayImages = getDisplayImages();
    
    if (displayImages.length === 0 || !data.id) {
      Toast.show({
        type: 'error',
        text1: 'Produto indisponível',
        text2: 'Este produto não pode ser adicionado ao carrinho.',
      });
      return;
    }

    cart.push({
      id: data.id,
      name: getDisplayName(),
      price: Number(getDisplayPrice()),
      quantity: 1,
      image: displayImages[0],
      variant: selectedVariant ? {
        id: selectedVariant.id,
        value: selectedVariant.value,
        unit: selectedVariant.unit,
        type: selectedVariant.type.name,
      } : undefined,
    });

    Toast.show({
      type: 'success',
      text1: `${getDisplayName()} foi adicionado ao carrinho`,
      text2: 'Toque para ver seu carrinho.',
      onPress: () => navigation.navigate('Cart'),
    });
  };

  const isOutOfStock = (data?.stock ?? 0) <= 0;
  const displayImages = getDisplayImages();
  const displayUnit = getDisplayUnit();

  return (
    <SafeAreaView style={tw`py-4 bg-white`}>
      <ScrollView style={tw`mb-26`}>
        <View style={tw`flex flex-row items-center justify-center w-full px-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}>
            <CaretLeft size={28} color="#000000" weight="regular" />
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
            <ShoppingBagOpen size={28} weight="fill" color="#000000" />
          </TouchableOpacity>
        </View>

        <View style={tw`mt-4`}>
          {displayImages.length > 0 ? (
            <Carousel items={displayImages} />
          ) : (
            <View
              style={tw`h-64 bg-gray-200 items-center justify-center mx-4 rounded-lg`}>
              <Text style={tw`text-gray-500`}>Sem imagens disponíveis</Text>
            </View>
          )}
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`text-xl font-bold`}>{data?.name}</Text>
          {isOutOfStock && (
            <Text style={tw`text-red-500 font-medium mt-1`}>
              Fora de estoque
            </Text>
          )}
          {selectedVariant && selectedVariant.value && (
            <View style={tw`mt-1`}>
              <Text style={tw`text-blue-600 font-medium`}>
                {getVariantTypeName()}: {selectedVariant.value}
                {displayUnit && ` (${displayUnit})`}
              </Text>
            </View>
          )}
        </View>

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

        {data?.variants && data.variants.length > 0 && (
          <View style={tw`px-4`}>
            <Text style={tw`font-bold text-base text-stone-600 mt-4`}>
              Selecione {getVariantTypeName() === 'cor' ? 'a' : 'o'} {getVariantTypeName()}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={tw`py-2`}>
              <VariantSelect 
                options={data.variants
                  .map(variant => variant.value)
                  .filter((value): value is string => typeof value === 'string' && value !== undefined)} 
                onSelect={handleVariantSelect}
              />
            </ScrollView>
          </View>
        )}

        <View style={tw`px-4`}>
          <Text style={tw`font-bold text-base text-stone-600 mt-2`}>
            Descrição
          </Text>
          <Text style={tw`text-stone-500 text-base`}>
            {data?.description || 'Descrição não disponível.'}
          </Text>
          {selectedVariant && displayUnit && (
            <Text style={tw`text-blue-600 text-sm mt-2`}>
              Unidade: {displayUnit}
            </Text>
          )}
        </View>

        <View style={tw`px-4 mt-4`}>
          <Text style={tw`font-bold text-base text-stone-600`}>
            Disponibilidade
          </Text>
          <Text style={tw`text-stone-500 text-base`}>
            {(data?.stock ?? 0) > 0
              ? `${data?.stock ?? 0} unidades em estoque`
              : 'Produto esgotado'}
          </Text>
        </View>

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

        <View style={tw`px-4 mt-3`}>
          <ChatCard />
        </View>

        <View style={tw`px-4`}>
          <Text style={tw`font-semibold text-xl mt-4`}>Itens similares</Text>
          <ForYouProducts />
        </View>
      </ScrollView>

      <View
        style={tw`absolute flex-row items-center bottom-0 bg-white border-t border-stone-400 w-full py-8 px-4`}>
        <View style={tw`w-1/3`}>
          <View style={tw`flex flex-row items-center`}>
            <Text style={tw`text-lg font-semibold`}>
              {Number(getDisplayPrice()).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>
          <Text style={tw`font-semibold text-stone-300 mt-1`}>
            12x de {getInstallmentPrice()}
          </Text>
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