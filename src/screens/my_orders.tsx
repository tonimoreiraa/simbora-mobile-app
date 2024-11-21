import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';

function MyOrders() {
    return (
        <SafeAreaView style={tw`bg-white`}>
            <ScrollView style={tw`h-full`}>
                <Text style={tw`text-2xl font-bold text-center mb-2`}>
                    Meus Pedidos
                </Text>
                <View style={tw`w-full px-3`}>
                    <InputSearch hideImageScanner hideMicrophone />
                </View>
                <View style={tw`px-3`}>
                    <ProductForecast />
                    <ProductForecast />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyOrders;