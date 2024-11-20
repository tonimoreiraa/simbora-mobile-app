import { ScrollView } from "react-native";
import InputSearch from "../components/input_search";
import tw from 'twrnc'
import { useDebouncedState } from "../services/debounced-state";
import { useQuery } from "react-query";
import { api } from "../services/api";

const getProducts = async (params: any) => {
    const { data } = await api.get('products', {
        params
    })
    return data;
}

export function ProductsSearch()
{
    const {
        debouncedValue,
        setInputValue,
        inputValue
    } = useDebouncedState()

    const {} = useQuery(['@products', debouncedValue], getProducts, {
        
    }) 

    return (
        <ScrollView style={tw`px-4`}>
            <InputSearch
                onChangeText={(value) => setInputValue(value)}
                value={inputValue}
                autoFocus
            />
        </ScrollView>
    )
}