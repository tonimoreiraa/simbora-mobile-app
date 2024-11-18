import { ScrollView, Text, View } from 'react-native'
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import ProductForecast from '../components/product_forecast';

function MyOrder() {
    return (
        <ScrollView>
            <View style={tw`flex flex-col items-center justify-center w-full mt-2`}>
                <Text style={tw`text-2xl font-bold text-center mb-2`}>Meus Pedidos</Text>
                <View style={tw`w-full px-4`}>
                    <InputSearch />
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
    )
}

export default MyOrder;