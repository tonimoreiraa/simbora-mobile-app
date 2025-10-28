import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {MapPin} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetUserAddresses} from '../services/client/user-addresses/user-addresses';

export default function Location() {
  const navigation = useNavigation<any>();
  const {data: addresses, isLoading, isError} = useGetUserAddresses();

  const primaryAddress = addresses?.[0];

  const formatAddress = (address: any) => {
    if (!address) {
      return null;
    }
    return `${address.streetName}, ${address.number}${
      address.complement ? `, ${address.complement}` : ''
    }`;
  };

  const truncateAddress = (address: string, maxLength: number = 12) => {
    if (address.length <= maxLength) {
      return address;
    }
    return address.substring(0, maxLength).trim() + '...';
  };

  const getAddressText = () => {
    if (isLoading) {
      return 'Carregando...';
    }
    if (isError) {
      return 'Erro ao carregar';
    }
    if (!primaryAddress) {
      return 'Adicionar endereço';
    }

    const fullAddress = formatAddress(primaryAddress);
    return truncateAddress(fullAddress ?? '');
  };

  const getAddressColor = () => {
    if (isLoading || isError) {
      return 'text-stone-400';
    }
    if (!primaryAddress) {
      return 'text-stone-400 underline';
    }
    return 'text-stone-500 underline';
  };

  const handlePress = () => {
    navigation.navigate('MyAccount');
  };

  return (
    <View style={tw`flex flex-row items-center py-2 flex-shrink min-w-0`}>
      <MapPin size={20} color="gray" weight="fill" />
      <View style={tw`flex flex-row items-center px-1 flex-shrink min-w-0`}>
        <Text style={tw`text-stone-400 text-sm flex-shrink-0`}>
          Enviar para{' '}
        </Text>
        <TouchableOpacity disabled={isLoading} onPress={handlePress}>
          <View style={tw`flex-row items-center`}>
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#A8A29E"
                style={tw`mr-1`}
              />
            )}
            <Text
              style={tw`${getAddressColor()} text-sm`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {getAddressText()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
