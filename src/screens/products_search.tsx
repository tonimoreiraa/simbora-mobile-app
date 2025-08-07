import {SafeAreaView, ScrollView} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import {useDebouncedState} from '../helpers/debounced-state';
import {useState} from 'react';
import ProductCard, {
  Product as ProductCardProps,
} from '../components/product_card';
import {View} from 'react-native';
import {useGetProducts} from '../services/client/products/products';

export function ProductsSearch() {
  const {debouncedValue, setInputValue, inputValue} = useDebouncedState();

  const {data: productsResponse} = useGetProducts(
    debouncedValue
      ? {
          query: debouncedValue,
        }
      : undefined,
  );

  const allProducts = productsResponse?.data || [];

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
    <SafeAreaView style={tw`bg-white flex-1`}>
      <ScrollView style={tw`px-4 pt-4 bg-white`}>
        <InputSearch
          onChangeText={value => setInputValue(value)}
          value={inputValue}
          autoFocus
        />
        <View style={tw`flex-wrap flex-row gap-4 justify-between`}>
          {allProducts.map((product: any) => (
            <ProductCard
              key={product?.id || Math.random()}
              {...adaptProductToCardProps(product)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
