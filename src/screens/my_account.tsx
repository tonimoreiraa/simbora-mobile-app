import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc"
import AccountInput from '../components/create_account_input';
import Icon from 'react-native-vector-icons/Ionicons';

function Account() {
    return (
        <View>
            <ScrollView>
                <View style={tw`flex flex-col items-center justify-center px-4 mt-6 h-full w-full`}>
                    <View>
                        <Text style={tw`text-2xl font-bold text-center`}>Minha conta</Text>
                    </View>
                    <View style={tw`flex flex-row items-center justify-between bg-stone-100 w-full p-4 mt-4`}>
                        <View style={tw`flex flex-row items-center justify-center`}>
                            <View style={tw`w-14 h-14 bg-stone-200 rounded-lg`}></View>
                            <View style={tw`ml-4`}>
                                <Text style={tw`text-lg font-bold`}>Foto de perfil</Text>
                                <Text style={tw`text-xs`}>Tamanho máximo de 2Mb</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Icon name="folder" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`w-full mt-8`}>
                        <Text style={tw`text-xl font-bold`}>Seu id person</Text>
                        <TextInput style={tw`bg-stone-100 rounded p-4 mt-4`} placeholder="@erivaldocavalcante"></TextInput>
                    </View>
                    <View style={tw` mt-6 w-full`}>
                        <Text style={tw`text-xl font-bold`}>Seu login</Text>
                        <View style={tw`mt-4`}>
                            <AccountInput description="Email cadastrado" placeholder="erivaldo@dpibrasil.com" />
                        </View>
                        <View style={tw`mt-4`}>
                            <AccountInput description="Número cadastrado" placeholder="+55 (82) 99802-1885" />
                        </View>
                    </View>
                    <View style={tw` mt-6 w-full`}>
                        <Text style={tw`text-xl font-bold`}>Cartões Cadastrados</Text>
                        <View style={tw`mt-4`}>
                            <AccountInput description="Erivaldo Cavalcante" placeholder="5558 8991 **** 6998" />
                        </View>
                        <View style={tw`mt-4`}>
                            <AccountInput description="Erivaldo Cavalcante" placeholder="5558 8991 **** 6998" />
                        </View>
                        <View style={tw`mt-4`}>
                            <AccountInput description="Adicionar cartão" placeholder="0000 0000 0000 0000" />
                        </View>
                    </View>
                    <View style={tw` mt-6 w-full mb-10`}>
                        <Text style={tw`text-xl font-bold`}>Gerenciar endereço</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Account;