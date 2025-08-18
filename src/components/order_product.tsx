import {View, Text, Image} from 'react-native';
import {Package} from 'phosphor-react-native';
import tw from 'twrnc';

interface OrderProductProps {
  quantity: number;
  name: string;
  image: string;
  price: number;
  variant?: {
    type: string;
    value: string;
    unit?: string;
  };
}

function OrderProduct({quantity, name, image, price, variant}: OrderProductProps) {
  return (
    <View
      style={tw`flex-row rounded-xl mt-2 py-2 p-2 items-center w-full border border-stone-300`}>
      <View style={tw`bg-stone-200 p-2 rounded-xl w-24 h-24 items-center justify-center`}>
        {image ? (
          <Image
            source={{uri: image}}
            style={tw`w-20 h-20 rounded-lg`}
            resizeMode="cover"
            onError={(error) => {
              console.log('Failed to load product image:', image, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log('Successfully loaded image:', image);
            }}
          />
        ) : (
          <Package size={40} color="#9ca3af" weight="regular" />
        )}
      </View>
      <View style={tw`ml-4 flex-1`}>
        <Text style={tw`text-base font-medium text-stone-900 mb-1`}>
          {name}
        </Text>
        {variant && (
          <View style={tw`flex flex-row items-center mb-2`}>
            <Text style={tw`font-light text-sm text-stone-500 mr-1`}>
              {variant.type}:
            </Text>
            <Text style={tw`text-sm font-bold`}>
              {variant.value}
              {variant.unit && ` (${variant.unit})`}
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-stone-800 font-semibold`}>
            Qtd: {quantity}
          </Text>
          <Text style={tw`text-lg text-stone-900 font-medium`}>
            {(price * quantity).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default OrderProduct;