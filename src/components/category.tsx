import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export interface Category {
  name: string;
  id: number; 
  image: string;
  onPress?: () => void;
}

function Category({ image, name, onPress }: Category) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={tw`w-[106px] h-[106px] rounded-2xl mr-2 mt-2 overflow-hidden relative`}>
        <Image
          source={{ uri: image }}
          style={tw`w-full h-full absolute`}
          resizeMode="cover"
        />
        
        <View style={tw`absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-35`} />

        <View style={tw`absolute bottom-1.5 left-0 right-0 px-2`}>
          <Text 
            style={tw`text-white text-center font-semibold text-xs`} 
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Category;