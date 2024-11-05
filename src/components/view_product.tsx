import { View, Text } from "react-native";
import InputSearch from "./input_search";
import Icon from 'react-native-vector-icons/Ionicons'
import tw from "twrnc";

function ViewProduct() {
    return(
        <View style={tw`flex flex-row items-center justify-center px-10 py-6`}>
            <Icon name="chevron-back-outline" size={28} style={tw`px-1`}/>
            <InputSearch />
            <Icon name="bag-handle-outline" size={28} style={tw`px-2`}/>
        </View>
    )
}

export default ViewProduct;