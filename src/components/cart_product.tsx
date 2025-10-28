import {View, Text, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';
import {Trash, Plus, Minus} from 'phosphor-react-native';
import {CartItem, useCartItemQuantity} from '../contexts/cart_provider';

function CartProduct({quantity, name, image, price, id, variant}: CartItem) {
  const {add, decrease, remove} = useCartItemQuantity(id);

  return (
    <View
      style={tw`flex-row rounded-xl mb-3 p-3 items-start w-full bg-white border border-gray-200 shadow-sm`}>
      {/* Product Image */}
      <View style={tw`bg-gray-50 p-3 rounded-xl`}>
        <Image
          source={{uri: image}}
          width={80}
          height={80}
          resizeMode="contain"
        />
      </View>

      {/* Product Details */}
      <View style={tw`flex-1 ml-3`}>
        {/* Product Name and Delete Button */}
        <View style={tw`flex-row justify-between items-start mb-1`}>
          <Text style={tw`text-base font-semibold text-gray-900 flex-1 pr-2`} numberOfLines={2}>
            {name}
          </Text>
          <TouchableOpacity onPress={remove} style={tw`p-1`}>
            <Trash size={20} weight="fill" color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Variant Info */}
        {variant && (
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`bg-blue-50 border border-blue-200 px-2 py-1 rounded-md`}>
              <Text style={tw`text-xs text-blue-600 font-medium`}>
                {variant.type}: {variant.value}
                {variant.unit && ` (${variant.unit})`}
              </Text>
            </View>
          </View>
        )}

        {/* Price and Quantity Controls */}
        <View style={tw`flex-row justify-between items-center mt-2`}>
          {/* Quantity Controls */}
          <View style={tw`flex-row items-center bg-gray-50 rounded-lg p-1`}>
            <TouchableOpacity
              style={tw`bg-white border border-gray-200 p-2 rounded-lg shadow-sm`}
              onPress={decrease}>
              <Minus size={16} weight="bold" color="#6B7280" />
            </TouchableOpacity>
            <Text style={tw`text-gray-900 font-semibold px-4 min-w-10 text-center`}>
              {quantity}
            </Text>
            <TouchableOpacity
              style={tw`bg-blue-500 p-2 rounded-lg shadow-sm`}
              onPress={add}>
              <Plus size={16} weight="bold" color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Total Price */}
          <View style={tw`ml-2`}>
            <Text style={tw`text-xs text-gray-500 text-right`}>Total</Text>
            <Text style={tw`text-lg text-gray-900 font-bold`}>
              {(price * quantity).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CartProduct;
