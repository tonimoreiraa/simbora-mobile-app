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
import Categories from '../components/categories';
import Tags from '../components/tags';
import ProductCard from '../components/product_card';
import Banner from '../components/banner';

function Home() {
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
          <ScrollView style={tw`mt-4`} horizontal={true} showsHorizontalScrollIndicator={false}>
            <Banner />
            <Banner />
            <Banner />
            <Banner />
          </ScrollView>
          <View>
            <View style={tw`flex flex-row items-center justify-between mt-2`}>
              <Text style={tw`font-bold text-xl`}>Categorias</Text>
              <View style={tw`flex flex-row items-center`}>
              <Text style={tw`text-stone-400`}>Ver todas</Text>
              <Icon name="chevron-forward-outline" size={16} style={tw`text-stone-400`}/>
              </View>
            </View>
            <ScrollView
              horizontal={true}
              style={tw`py-4`}
              showsHorizontalScrollIndicator={false}>
              <Categories />
              <Categories />
              <Categories />
              <Categories />
            </ScrollView>
          </View>
          <View>
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
            style={tw`flex flex-row flex-wrap items-center justify-between mt-6`}>
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
