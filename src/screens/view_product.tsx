import { SafeAreaView, TouchableOpacity, View, ScrollView } from "react-native";
import InputSearch from "../components/input_search";
import Icon from 'react-native-vector-icons/Ionicons'
import tw from "twrnc";
import Fio from '../assets/Fio.svg';
import Carousel from "../components/carousel";

const ViewProduct: React.FC = () => {
    const items = [
        "https://avatars.githubusercontent.com/u/59844592?v=4"
    ];

    return (
        <SafeAreaView>
            <View style={tw`flex flex-row items-center justify-center w-full px-12 `}>
                <TouchableOpacity>
                    <Icon name="chevron-back" size={28} style={tw`mr-2`} />
                </TouchableOpacity>
                <InputSearch />
                <View>
                    <Icon name="bag-handle" size={28} style={tw`ml-2`} />
                </View>
            </View>
            <View>
            <Carousel items={items} />
            </View>
        </SafeAreaView>
    )
}

export default ViewProduct;