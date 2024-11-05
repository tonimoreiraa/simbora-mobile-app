import { ScrollView, Text, View } from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/LOGO.svg';
import MyCarousel from '../components/carousel';
import Categories from '../components/categories';
import Tags from '../components/tags';
import ProductCard from '../components/product_card';

function home() {
  return (
    <View style={tw`p-4`}>
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
      <View>
        <MyCarousel />
      </View>
      <View>
        <View style={tw`flex flex-row items-center justify-between mt-2`}>
          <Text style={tw`font-bold text-xl`}>Categorias</Text>
          <Text>Ver todas</Text>
        </View>
        <ScrollView horizontal={true} style={tw`py-4`} showsHorizontalScrollIndicator={false}>
          <Categories />
          <Categories />
          <Categories />
          <Categories />
        </ScrollView>
      </View>
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Tags />
          <Tags />
          <Tags />
          <Tags />
          <Tags />
          <Tags />
        </ScrollView>
      </View>
      <View style={tw`flex flex-row flex-wrap items-center justify-between`}>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </View>
    </View>
  );
}

export default home;
