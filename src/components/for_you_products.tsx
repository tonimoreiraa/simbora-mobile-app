import { useQuery } from "react-query"
import { api } from "../services/api"
import { ActivityIndicator, View } from "react-native"
import tw from 'twrnc'
import ProductCard, { Product } from "./product_card"

const fetchProducts = async () => (await api.get<{data: Product[]}>('/products')).data

export function ForYouProducts()
{
    const {
        data,
        isLoading
    } = useQuery('@products', fetchProducts)
    
    if (isLoading) {
        return (
            <ActivityIndicator />
        )
    }

    return (
        <View
            style={tw`flex flex-row flex-wrap items-center justify-between mt-2`}>
            {data && data.data.map(product => (
                <ProductCard
                    {...product}
                />
            ))}
        </View>
    )
}