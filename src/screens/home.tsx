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
import MyCarousel from '../components/carousel';
import Category from '../components/category';
import Tags from '../components/tags';
import ProductCard from '../components/product_card';
import Banner from '../components/banner';
import { useNavigation } from '@react-navigation/native';

function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`px-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <View style={tw`flex flex-row items-center py-4`}>
              <Icon name="location" size={26} />
              <View style={tw`flex flex-row items-center px-2`}>
                <Text>Enviar para </Text>
                <Text>Av. Marechal Deodoro, 256</Text>
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
          <View style={tw`mt-4`}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Tags />
              <Tags />
              <Tags />
              <Tags />
              <Tags />
              <Tags />
            </ScrollView>
          </View>
          <View
            style={tw`flex flex-row flex-wrap items-center justify-between mt-4`}>
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
