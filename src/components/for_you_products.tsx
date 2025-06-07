import React from 'react';
import {useGetProducts} from '../services/client/products/products'; // Usando a função da API gerada
import {ActivityIndicator, View, Text} from 'react-native';
import tw from 'twrnc';
import ProductCard, { Product } from '../components/product_card';

export function ForYouProducts() {
  // Usando a função da API gerada em vez da função customizada
  const {data: productsResponse, isLoading, isError} = useGetProducts();
  
  // Extrair produtos da resposta da API
  const products = productsResponse?.data || [];

  if (isLoading) {
    return (
      <View style={tw`flex items-center justify-center py-4`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex items-center justify-center py-4`}>
        <Text style={tw`text-red-500`}>Erro ao carregar produtos</Text>
      </View>
    );
  }

  return (
    <View
      style={tw`flex flex-row flex-wrap items-center justify-between mt-2 gap-2`}>
      {products && products.map((product) => (
        <ProductCard 
          key={product.id}
          id={product.id!}
          name={product.name!}
          price={product.price!}
          supplier={product.supplier?.name ?? ''}
          images={product.images?.map(img => ({
            id: img.id ?? 0,
            path: img.path ?? '',
            productId: img.productId ?? 0
          })) ?? []}
          categoryId={product.categoryId!}
          createdAt={product.createdAt!}
          description={product.description!}
          stock={product.stock ?? 0}
          supplierId={product.supplierId ?? 0}
          tags={product.tags ?? []}
        />
      ))}
    </View>
  );
}