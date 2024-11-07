import { View, Text } from 'react-native'
import tw from 'twrnc';

function Price() {
    return (
        <View style={tw`flex w-full border border-gray-300 p-4 mt-4 rounded-lg`}>
            <View style={tw`flex flex-row items-center justify-between py-2`}>
                <Text>Subtotal</Text>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`font-bold`}>R$ </Text>
                    <Text style={tw`font-bold`}>850</Text>
                </View>
            </View>
            <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Frete</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>Grátis</Text>
                </View>
            </View>
            <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Desconto</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>R$ </Text>
                    <Text style={tw`font-bold`}>-85</Text>
                </View>
            </View>
            <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Valor total</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>R$ </Text>
                    <Text style={tw`font-bold`}>765</Text>
                </View>
            </View>
        </View>
    )
}

export default Price;