import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {MapPin} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetUserAddresses} from '../services/client/user-addresses/user-addresses';

export default function Location() {
  const navigation = useNavigation<any>();
  
  const {
    data: addresses,
    isLoading,
    isError,
  } = useGetUserAddresses();

  const primaryAddress = addresses?.[0];

  const formatAddress = (address: any) => {
    if (!address) return null;
    
    return `${address.streetName}, ${address.number}${
      address.complement ? `, ${address.complement}` : ''
    }`;
  };

  const getAddressText = () => {
    if (isLoading) return 'Carregando...';
    if (isError) return 'Erro ao carregar';
    if (!primaryAddress) return 'Adicionar endereço';
    return formatAddress(primaryAddress);
  };

  const getAddressColor = () => {
    if (isLoading || isError) return 'text-stone-400';
    if (!primaryAddress) return 'text-stone-400 underline';
    return 'text-stone-500 underline';
  };

  const handlePress = () => {
    navigation.navigate('MyAccount');
  };

  return (
    <View style={tw`flex flex-row items-center py-4`}>
      <MapPin size={26} color="gray" weight="fill" />
      <View style={tw`flex flex-row items-center px-2`}>
        <Text style={tw`text-stone-300`}>Enviar para </Text>
        <TouchableOpacity disabled={isLoading} onPress={handlePress}>
          <View style={tw`flex-row items-center`}>
            {isLoading && (
              <ActivityIndicator size="small" color="#A8A29E" style={tw`mr-1`} />
            )}
            <Text style={tw`${getAddressColor()}`}>
              {getAddressText()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}