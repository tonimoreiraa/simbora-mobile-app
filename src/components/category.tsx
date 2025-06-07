import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';
import {getCorrectImageUrl} from '../utils/image';

interface CategoryProps {
  id: number;
  name: string;
  image?: string;
  description?: string;
  onPress?: () => void;
}

const Category: React.FC<CategoryProps> = ({
  name,
  image,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={tw`w-[106px] items-center justify-center rounded-2xl mr-2 mt-2`}
      onPress={onPress}>
      
      {/* Container da Imagem - Aumentado de w-20 h-20 para w-24 h-24 */}
      <View style={tw`w-24 h-24 bg-gray-100 rounded-xl overflow-hidden mb-2`}>
        {image ? (
          <Image
            source={{uri: getCorrectImageUrl(image)}}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        ) : (
          <View style={tw`w-full h-full items-center justify-center bg-gray-200`}>
            <Text style={tw`text-gray-400 text-xs`}>IMG</Text>
          </View>
        )}
      </View>

      {/* Nome da Categoria */}
      <Text
        style={tw`text-sm font-medium text-center text-gray-900`}
        numberOfLines={2}>
        {name}
      </Text>

      {/* Descrição (opcional) */}
      {description && (
        <Text
          style={tw`text-xs text-gray-500 text-center mt-1`}
          numberOfLines={1}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Category;