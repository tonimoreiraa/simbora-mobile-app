import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const ProductCard = () => {
    return (
        <View style={tw`py-4 w-44`}>
            <TouchableOpacity style={tw`bg-white rounded-lg p-4 h-40 bg-gray-200`}>
            </TouchableOpacity>
            <View style={tw`py-2`}>
                <View>
                    <Text numberOfLines={2} style={tw`font-bold text-base`}>
                        Rolo de fio 2,5mm SIL
                    </Text>
                </View>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`text-gray-600 text-lg`}>
                        R$189,90
                    </Text>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-gray-500 text-xs`}>
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