import { View, Text } from 'react-native'
import tw from 'twrnc';

interface PriceProps {
    subTotal: number
    discount: number
    shipping: number|null
    total?: number
}

function Price({
    subTotal,
    discount,
    shipping,
    total
}: PriceProps) {
    return (
        <View style={tw`flex w-full border border-stone-300 p-4 mt-4 rounded-lg`}>
            <View style={tw`flex flex-row items-center justify-between py-2`}>
                <Text>Subtotal</Text>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`font-bold`}>
                        {subTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </Text>
                </View>
            </View>
            <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Frete</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>
                        {shipping
                            ? shipping.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            : (typeof shipping == 'number' ? 'Grátis' : 'A definir')
                        }
                    </Text>
                </View>
            </View>
            {discount && <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Desconto</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>
                        {discount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </Text>
                </View>
            </View>}
            {total && <View style={tw`flex flex-row items-center justify-between`}>
                <Text>Valor total</Text>
                <View style={tw`flex flex-row items-center justify-between py-2`}>
                    <Text style={tw`font-bold`}>
                        {total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </Text>
                </View>
            </View>}
        </View>
    )
}

export default Price;