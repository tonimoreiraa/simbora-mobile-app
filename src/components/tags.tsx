import { Text, View } from "react-native";
import tw from "twrnc";

function Tags() {
    return(
        <View style={tw`flex flex-col items-center justify-center bg-stone-200 py-2 px-8 rounded-2xl mr-2`}>
            <Text>Para você</Text>
        </View>
    )
}

export default Tags;