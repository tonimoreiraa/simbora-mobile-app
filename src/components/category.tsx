import { Image } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
export interface Category {
    name: string
    categoryId: number
    image: string
}

function Category({ image, name }: Category) {
    return (
        <TouchableOpacity style={tw`w-[106px] h-[106px] items-center justify-center rounded-2xl mr-2 bg-stone-200 mt-2 gap-2`}>
            <Image
                source={{uri: image}}
                width={50}
                height={60}
                resizeMode="contain"
            />
            <Text style={tw`text-center font-light text-xs`}>
                {name}
            </Text>
        </TouchableOpacity>
    )
}

export default Category;