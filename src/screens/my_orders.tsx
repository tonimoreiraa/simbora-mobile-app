import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';

function MyOrders() {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={tw`flex flex-col items-center justify-center w-full mt-2`}>
                    <Text style={tw`text-2xl font-bold text-center mb-2`}>Meus Pedidos</Text>
                    <View style={tw`w-full px-4`}>
                        <InputSearch hideImageScanner hideMicrophone />
                    </View>
                    <View>
                        <ProductForecast />
                        <ProductForecast />
                        <ProductForecast />
                        <ProductForecast />
                        <ProductForecast />
                        <ProductForecast />
                        <ProductForecast />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyOrders;