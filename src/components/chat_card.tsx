import { ChatCenteredDots, SealCheck } from "phosphor-react-native";
import { useState } from "react";
import { Text } from "react-native";
import { Image, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import ChatWootWidget from '@chatwoot/react-native-widget';
import { useAuth } from "../contexts/auth_provider";

export function ChatCard()
{
    const auth = useAuth()
    const [showWidget, toggleWidget] = useState(false);

    if (!auth.user) {
        return null
    }

    const user = {
        identifier: auth.user.email as string,
        name: auth.user.name as string,
        avatar_url: auth.user.avatar as string|undefined,
        email: auth.user.email as string,
        identifier_hash: '',
    };
    const customAttributes = { accountId: 44, pricingPlan: 'paid', status: 'active' };
    const websiteToken = 'osbseKcg7tsRMDjcxt964yRr';
    const baseUrl = 'https://app.zork.chat';
    const locale = 'pt-BR';

    const handlePress = () => toggleWidget(t => !t)

    return (
        <View style={tw`gap-2`}>
            <Text style={tw`text-lg font-semibold`}>Fale com o vendedor</Text>
            <TouchableOpacity onPress={handlePress}>
                <View style={tw`w-full p-2 rounded flex-row items-center pr-4 bg-stone-100 justify-between`}>
                    <View style={tw`flex-row gap-2 items-center`}>
                        <Image style={tw`w-14 h-14 bg-stone-200 rounded-md`} />
                        <View style={tw`flex-col gap-0.5`}>
                            <View style={tw`flex-row items-center gap-1`}>
                                <Text style={tw`text-lg font-light`}>Luz Express</Text>
                                <SealCheck
                                    style={tw`text-blue-500`}
                                    size={20}
                                    weight="fill"
                                />
                            </View>
                            <Text style={tw`text-blue-500`}>Enviar mensagem</Text>
                            
                        </View>
                    </View>
                    <ChatCenteredDots style={tw`text-blue-500`} weight="fill" />
                </View>
            </TouchableOpacity>
            {
                showWidget &&
                <ChatWootWidget
                    websiteToken={websiteToken}
                    locale={locale}
                    baseUrl={baseUrl}
                    closeModal={() => toggleWidget(false)}
                    isModalVisible={showWidget}
                    user={user}
                    customAttributes={customAttributes}
                />
            }
        </View>
    )
}