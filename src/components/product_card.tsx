import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { SealCheck } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

export interface Product {
    categoryId: number
    createdAt: string
    description: string
    id: number
    images: Array<{
      id: number
      path: string
      productId: number
    }>
    name: string
    price: string
    stock: number
    supplier: {
      address: string
      description: string
      id: number
      name: string
      ownerId: number
      photo: string
    }
    supplierId: number
    tags: Array<string>
    updatedAt: string
}
  
const ProductCard = ({
    id,
    name,
    price,
    supplier,
    images
}: Product) => {

    const navigation = useNavigation()

    const handlePressProduct = () => navigation.navigate('Product', { id })

    return (
        <TouchableOpacity onPress={handlePressProduct} style={tw`py-4 w-44`}>
            <View style={tw`rounded-lg p-4 h-40 bg-stone-100 items-center justify-center`}>
                <Image
                    source={{uri: images[0]?.path}}
                    width={140}
                    height={140}
                    resizeMode='contain'
                />
            </View>
            <View style={tw`py-2`}>
                <View>
                    <Text numberOfLines={2} style={tw`font-bold text-base`}>
                        {name}
                    </Text>
                </View>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`text-stone-600 text-base`}>
                        {Number(price).toLocaleString('pt-BR', {
                            style: 'currency', currency: 'BRL'
                        })}
                    </Text>
                    <View style={tw`flex-row items-center border border-stone-200 rounded-lg p-2 gap-1`}>
                        <Text style={tw`text-stone-500 text-[10px]`}>
                            {supplier?.name}
                        </Text>
                        <SealCheck weight="fill" size={8} color="#3C6EEF" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;