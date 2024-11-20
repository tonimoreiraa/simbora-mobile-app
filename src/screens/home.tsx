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
import ProductCard from '../components/product_card';
import Banner from '../components/banner';
import Location from '../components/location';
import { SealPercent } from 'phosphor-react-native';
import { api } from '../services/api';
import { useQuery } from 'react-query';
import Category from '../components/category';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const getCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}

function Categories()
{
  const {
    data,
    isLoading,
    isSuccess
  } = useQuery('@categories', getCategories)

  return <ScrollView
    horizontal={true}
    style={tw`py-4`}
    showsHorizontalScrollIndicator={false}>
    {isLoading && <>
      {[...Array(4).keys()].map(c => (
        <View style={tw`w-[106px] h-[106px] items-center justify-center rounded-2xl mr-2 bg-stone-200 mt-2 gap-2`} />
      ))}
    </>}
    {isSuccess && data.map((category: any) => (
      <Category {...category} key={category.id} />
    ))}
  </ScrollView>
}

function Home() {
  const navigation = useNavigation();

  useEffect(() => {
  navigation.navigate('MyOrders')

  }, [])
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`px-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <Location />
            <Logo style={tw`flex`} width={40} height={40} />
          </View>
          <View>
            <InputSearch onPress={() => navigation.navigate('ProductsSearch')} />
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
                <TouchableOpacity style={tw`flex flex-row items-center`} onPress={() => navigation.navigate("Categories")}>
                  <Text style={tw`text-stone-400`}>Ver todas</Text>
                  <Icon
                    name="chevron-forward-outline"
                    size={16}
                    style={tw`text-stone-400`}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Categories />
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
