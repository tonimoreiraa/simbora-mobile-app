import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { UserAddresses } from "../components/user_addresses";
import tw from 'twrnc'

type CheckoutSteps = 'shipping' | 'payment'

export default function Checkout() {
    const navigation = useNavigation()
    const [step, setStep] = useState<CheckoutSteps>('shipping')

    useEffect(() => {
        navigation.setOptions({ title: step == 'payment' ? 'Pagamento' : 'Endereço de envio' })
    }, [])

    return (
        <SafeAreaView style={tw`flex-1`}>
            {step == 'shipping' && <>
                <UserAddresses />
            </>}
        </SafeAreaView>
    )
}