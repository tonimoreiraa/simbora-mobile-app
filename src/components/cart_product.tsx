import { View, Text, TouchableOpacity } from "react-native";
import Fio from "../assets/Fio.svg"
import tw from "twrnc";
import Icon from 'react-native-vector-icons/Ionicons'
import { useState } from "react";
import { Trash } from "phosphor-react-native";

function CartProduct() {

    const [count, setCount] = useState(0)

    const more = () => setCount(count + 1)

    const less = () => count !== 0 && setCount(count - 1)

    return (
        <View style={tw`flex-row rounded-xl mt-2 py-2 p-2 items-center w-full border border-stone-300`}>
            <View style={tw`bg-stone-200 p-2 rounded-xl`}>
                <Fio width="100" height="100" />
            </View>
            <View style={tw`ml-4`}>
                <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-base font-medium text-stone-900 w-50`}>
                        Fio Cabo Flexível 2,5mm SIL | 100M
                    </Text>
                    <Trash size={20} weight="fill" color="#c6c6c6" />
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
                        <TouchableOpacity style={tw`bg-stone-300 p-1 rounded-2xl`} onPress={less}>
                            <Icon name="remove" color="#ffffff" />
                        </TouchableOpacity>

                        <Text style={tw`text-stone-800 font-semibold`}>{count}</Text>

                        <TouchableOpacity style={tw`bg-blue-500 rounded-2xl p-1`} onPress={more}>
                            <Icon name="add" color="#ffffff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={tw`text-lg text-stone-900 font-medium`}>
                        R$429,98
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default CartProduct;