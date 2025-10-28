import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';
import {SealCheck} from 'phosphor-react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {getCorrectImageUrl} from '../utils/image';

export interface Product {
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
  price: string | number;
  stock: number;
  supplier: string;
  supplierId: number;
  tags: Array<string>;
}

const ProductCard = (product: Product) => {
  const {id, name, price, supplier, images} = product;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handlePressProduct = () => {
    navigation.navigate('Product', {id});
  };

  const priceValue = typeof price === 'string' ? parseFloat(price) : price;

  return (
    <TouchableOpacity onPress={handlePressProduct} style={tw`py-4 w-44`}>
      <View
        style={tw`rounded-lg p-4 h-40 bg-stone-100 items-center justify-center`}>
        {images && images.length > 0 ? (
          <Image
            source={{uri: getCorrectImageUrl(images[0]?.path || '')}}
            width={140}
            height={140}
            resizeMode="contain"
          />
        ) : (
          <View style={tw`w-35 h-35 items-center justify-center`}>
            <Text style={tw`text-gray-400 text-sm`}>Sem imagem</Text>
          </View>
        )}
      </View>
      <View style={tw`py-2`}>
        <View>
          <Text numberOfLines={2} style={tw`font-bold text-base`}>
            {name}
          </Text>
        </View>
        <View style={tw`flex flex-row items-center justify-between`}>
          <Text style={tw`text-stone-600 text-base`}>
            {Number(priceValue).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
         {!!supplier?.length && <View
            style={tw`flex-row items-center border border-stone-200 rounded-lg p-2 gap-1`}>
            <Text style={tw`text-stone-500 text-[10px]`}>{supplier}</Text>
            <SealCheck weight="fill" size={8} color="#3C6EEF" />
          </View>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
