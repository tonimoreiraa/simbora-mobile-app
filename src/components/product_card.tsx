import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { SealCheck } from 'phosphor-react-native';

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
                    <Text style={tw`text-stone-600 text-base`}>
                        R$189,90
                    </Text>
                    <View style={tw`flex-row items-center border border-stone-200 rounded-lg p-2 gap-1`}>
                        <Text style={tw`text-stone-500 text-[10px]`}>
                            LuzExpress
                        </Text>
                        <SealCheck weight="fill" size={8} color="#3C6EEF" />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProductCard;