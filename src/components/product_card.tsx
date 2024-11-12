import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5'

const ProductCard = () => {
    return (
        <View style={tw`py-4 w-44`}>
            <TouchableOpacity style={tw`rounded-lg p-4 h-40 bg-stone-200`}>
            </TouchableOpacity>
            <View style={tw`py-2`}>
                <View>
                    <Text numberOfLines={2} style={tw`font-bold text-base`}>
                        Rolo de fio 2,5mm SIL
                    </Text>
                </View>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`text-stone-600 text-lg`}>
                        R$189,90
                    </Text>
                    <View style={tw`flex-row items-center border border-black rounded p-1`}>
                        <Text style={tw`text-stone-500 text-xs`}>
                            LuzExpress
                        </Text>
                        <View style={tw`w-2 h-2 rounded-full bg-blue-500 ml-1`} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProductCard;