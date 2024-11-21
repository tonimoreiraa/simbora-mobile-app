import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import Icon from 'react-native-vector-icons/Ionicons'
import { Trash } from "phosphor-react-native";
import { CartItem, useCartItemQuantity } from "../contexts/cart_provider";

function CartProduct({ quantity, name, image, price, id }: CartItem) {

    const {
        add,
        decrease,
        remove
    } = useCartItemQuantity(id) 

    return (
        <View style={tw`flex-row rounded-xl mt-2 py-2 p-2 items-center w-full border border-stone-300`}>
            <View style={tw`bg-stone-200 p-2 rounded-xl`}>
                <Image
                    source={{ uri: image }}
                    width={100} height={100}
                    resizeMode="contain"
                />
            </View>
            <View style={tw`ml-4`}>
                <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-base font-medium text-stone-900 w-50`}>
                        {name}
                    </Text>
                    <TouchableOpacity onPress={remove}>
                        <Trash size={20} weight="fill" color="#c6c6c6" />
                    </TouchableOpacity>
                </View>
                <View style={tw`flex flex-row items-center`}>
                    <Text style={tw`font-light text-sm text-stone-500 mt-1 mr-1`}>
                        Cor:
                    </Text>
                    <Text style={tw`text-sm font-bold mt-1`}>
                        Preto
                    </Text>
                </View>
                <View style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-row items-center gap-2`}>
                        <TouchableOpacity style={tw`bg-stone-300 p-1 rounded-2xl`} onPress={decrease}>
                            <Icon name="remove" color="#ffffff" />
                        </TouchableOpacity>
                        <Text style={tw`text-stone-800 font-semibold`}>
                            {quantity}
                        </Text>
                        <TouchableOpacity style={tw`bg-blue-500 rounded-2xl p-1`} onPress={add}>
                            <Icon name="add" color="#ffffff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={tw`text-lg text-stone-900 font-medium`}>
                        {(price*quantity).toLocaleString('pt-BR', {
                            style: 'currency', currency: 'BRL'
                        })}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default CartProduct;