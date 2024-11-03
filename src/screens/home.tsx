import {Text, View} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/LOGO.svg';

function home() {
  return (
    <View style={tw`p-4`}>
      <View style={tw`flex flex-row items-center justify-between`}>
        <View  style={tw`flex flex-row items-center py-4`}>
          <Icon name="location" size={26} />
          <View style={tw`flex flex-row items-center px-2`}>
            <Text>Enviar para </Text>
            <Text>Av. Marechal Deodoro, 256</Text>
          </View>
        </View>
        <Logo style={tw`flex`} width={40} height={40}/>
      </View>
      <InputSearch />
    </View>
  );
}

export default home;
