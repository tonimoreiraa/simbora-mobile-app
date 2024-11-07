import { View, Text } from 'react-native'
import tw from 'twrnc';

function Delivery() {
    return(
        <View style={tw`flex flex-row items-center justify-between w-full border border-black rounded-lg p-4 mt-4`}>
        <View style={tw`flex flex-col items-start`}>
            <Text style={tw`font-bold`}>Envio Padrão</Text>
            <Text style={tw`text-xs`}>Av. Marechal Deodoro, 256</Text>
        </View>
        <View>
            <Text style={tw`text-lg`}>Até 1 dia</Text>
        </View>
    </View>
    )
}

export default Delivery;