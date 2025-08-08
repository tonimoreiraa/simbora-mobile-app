import {ScrollView, View, Text, ActivityIndicator, Image} from 'react-native';
import tw from 'twrnc';
import OrderProduct from '../components/order_product';
import {useRoute} from '@react-navigation/native';
import {useGetOrdersId} from '../services/client/orders/orders';
import {useGetProductsId} from '../services/client/products/products';
import {getCorrectImageUrl} from '../utils/image';
import React, {useEffect, useState} from 'react';

interface RouteParams {
  orderId: string | number;
}

// Component that displays order item details
const OrderItemWithProduct = ({ item }: { item: any }) => {
  // Always fetch complete product details to get images
  const { data: productDetails } = useGetProductsId(item.productId, {
    query: {
      enabled: !!item.productId,
    },
  });
  
  if (!productDetails) {
    return (
      <View style={tw`items-center justify-center py-4`}>
        <ActivityIndicator size="small" color="#f59e0b" />
      </View>
    );
  }
  
  const productImage = productDetails.images && productDetails.images.length > 0
    ? getCorrectImageUrl(productDetails.images[0].path || '')
    : '';
    
  // Debug logs
  console.log('Product Details:', {
    productId: item.productId,
    hasImages: productDetails.images && productDetails.images.length > 0,
    imagePath: productDetails.images?.[0]?.path,
    finalImageUrl: productImage,
    productName: productDetails.name
  });
  
  return (
    <OrderProduct
      quantity={item.quantity || 1}
      name={item.product?.name || productDetails.name}
      image={productImage}
      price={item.price || productDetails.price}
    />
  );
};

export default function PickupOrder() {
  const route = useRoute();
  const {orderId} = route.params as RouteParams;
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  const {data: order, isLoading} = useGetOrdersId(Number(orderId), {
    query: {
      enabled: !!orderId,
    },
  });

  useEffect(() => {
    if (orderId) {
      // Use a web API to generate QR code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(String(orderId))}`;
      setQrCodeUrl(qrUrl);
    }
  }, [orderId]);

  return (
    <ScrollView>
      <View style={tw`flex w-full px-4 bg-white`}>
        <View style={tw`flex items-center justify-center w-full py-6`}>
          <Text style={tw`text-center font-medium text-base`}>
            Apresente o QR Code abaixo no balcão de retirada e um documento com
            foto para realizar a retirada doe seu pedido.
          </Text>
          <View style={tw`border border-blue-500 rounded-xl mt-6 p-4`}>
            {qrCodeUrl ? (
              <Image
                source={{ uri: qrCodeUrl }}
                style={tw`w-75 h-75`}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator size="large" color="#f59e0b" />
            )}
          </View>
        </View>
        <View>
          <View style={tw`w-full`}>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text style={tw`text-xs text-stone-400 mb-0.5`}>
                ID do pedido
              </Text>
              <Text>#{orderId}</Text>
            </View>
          </View>
          <View style={tw`w-full mt-2`}>
            <View style={tw`px-4 py-4 rounded-2 bg-stone-100 w-full`}>
              <Text style={tw`text-xs text-stone-400 mb-0.5`}>Cliente</Text>
              <Text>{order?.customer?.name || 'Carregando...'}</Text>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View style={tw`items-center justify-center py-10`}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={tw`mt-2 text-gray-500`}>Carregando pedido...</Text>
          </View>
        ) : (
          <View>
            <Text style={tw`text-xl font-bold mt-2`}>Detalhes do pedido</Text>
            {order?.items?.map((item: any, index: number) => (
              <OrderItemWithProduct key={`${item.productId}-${index}`} item={item} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
