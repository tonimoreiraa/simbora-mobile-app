import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {UserAddresses} from '../components/user_addresses';
import {useCart} from '../contexts/cart_provider';
import {usePostOrders} from '../services/client/orders/orders';
import tw from 'twrnc';

type CheckoutSteps = 'shipping' | 'payment';

export default function Checkout() {
  const navigation = useNavigation();
  const cart = useCart();
  const [step, setStep] = useState<CheckoutSteps>('shipping');

  useEffect(() => {
    navigation.setOptions({
      title: step == 'payment' ? 'Pagamento' : 'Endereço de envio',
    });
  }, []);

  return (
    <View style={tw`flex-1 bg-white`}>
      <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`px-4`}>
        {step == 'shipping' && (
          <>
            <UserAddresses />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}
