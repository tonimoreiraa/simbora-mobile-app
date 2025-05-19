import { useQuery } from "react-query"
import { api } from "../services/api"
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import tw from 'twrnc'
import { NavigationArrow } from "phosphor-react-native"
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from "@react-navigation/native"
import { NewAddressDrawer } from "./new-address-drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler"
// Importar o tipo de navegação
import { StackNavigationProp } from "@react-navigation/stack"

// Definir as rotas disponíveis na navegação
type RootStackParamList = {
  Home: undefined;
  ResumeOrder: undefined;
  WithdrawOrder: undefined;
  // Adicione outras rotas conforme necessário
};

// Definir o tipo para useNavigation
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Address {
  id: number
  name: string
  streetName: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  country: string
}

const fetchAddresses = async () => (await api.get<Address[]>('/user-addresses')).data

export function UserAddresses() {
  const {
    data,
    isLoading,
    isSuccess,
  } = useQuery('@addresses', fetchAddresses)
  
  // Usar o tipo correto para o hook de navegação
  const navigation = useNavigation<NavigationProp>()
  
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`px-4`}>
        {isLoading && <ActivityIndicator />}
        {isSuccess && !data?.length && <Text style={tw`text-sm text-stone-600 text-center my-10`}>
          Nenhum endereço cadastrado.
        </Text>}
        {data?.map(address => (
          <View key={address.id} style={tw`bg-stone-200 px-4 py-3 flex-row rounded-lg`}>
            <BouncyCheckbox
              size={16}
              fillColor='#000'
            />
            <View>
              <Text>{address.name}</Text>
              <View style={tw`flex items-center flex-row gap-1 justify-start`}>
                <NavigationArrow size={20} color="#000000" weight="regular" />
                <Text style={tw`text-lg`}>
                  {address.streetName}, {address.number}
                </Text>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ResumeOrder')} 
          style={tw`bg-blue-500 rounded-2xl py-2 px-3 flex-row items-center justify-center gap-1 mt-2`}
        >
          <Text style={tw`text-lg text-white`}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
      <NewAddressDrawer />
    </SafeAreaView>
  )
}