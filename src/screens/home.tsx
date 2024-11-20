import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/LOGO.svg';
import Category from '../components/category';
import ProductCard from '../components/product_card';
import Banner from '../components/banner';
import { useNavigation } from '@react-navigation/native';
import { MapPin, SealPercent } from 'phosphor-react-native';

function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`px-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <View style={tw`flex flex-row items-center py-4`}>
              <MapPin color="#696969" weight='fill' />
              <View style={tw`flex flex-row items-center px-2`}>
                <Text style={tw`text-zinc-400`}>Enviar para </Text>
                <Text style={tw`underline`}>Av. Marechal Deodoro, 256</Text>
              </View>
            </View>
            <Logo style={tw`flex`} width={40} height={40} />
          </View>
          <View>
            <InputSearch />
          </View>
          <ScrollView
            style={tw`mt-4`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <Banner />
            <Banner />
            <Banner />
            <Banner />
          </ScrollView>
          <View>
            <View style={tw`flex flex-row items-center justify-between mt-5`}>
              <Text style={tw`font-bold text-xl`}>Categorias</Text>
              <View style={tw`flex flex-row items-center`}>
                {/* @ts-ignore */}
                <TouchableOpacity style={tw`flex flex-row items-center`} onPress={() => navigation.navigate("Categorias")}>
                  <Text style={tw`text-stone-400`}>Ver todas</Text>
                  <Icon
                    name="chevron-forward-outline"
                    size={16}
                    style={tw`text-stone-400`}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              horizontal={true}
              style={tw`py-4`}
              showsHorizontalScrollIndicator={false}>
              <Category />
              <Category />
              <Category />
              <Category />
            </ScrollView>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            >
              <View style={tw`px-6 py-2 rounded-full items-center gap-1 bg-black flex-row`}>
                <Icon name="heart" color="#FFFF" size={18} />
                <Text style={tw`text-white text-lg`}>Para você</Text>
              </View>
              <View style={tw`px-6 py-2 rounded-full items-center gap-1 bg-neutral-200 flex-row ml-2`}>
                <SealPercent
                  weight="fill"
                  color='#3C6EEF'
                  size={18}
                />
                <Text style={tw`text-lg text-stone-600`}>Em promo</Text>
              </View>
          </ScrollView>
          <View
            style={tw`flex flex-row flex-wrap items-center justify-between mt-2`}>
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
