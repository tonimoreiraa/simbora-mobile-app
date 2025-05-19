import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import { SealPercent, CaretRight, Heart } from 'phosphor-react-native';
import Logo from '../assets/LOGO.svg';
import Location from '../components/location';
import Category from '../components/category';
import { useNavigation } from '@react-navigation/native';
import { ForYouProducts } from '../components/for_you_products';
import { useGetAllCategories } from '../services/category/useCategories';
import Banner1 from '../assets/banner1.svg';
import Banner2 from '../assets/banner2.svg';

function useAppNavigation() {
  return useNavigation<any>();
}

function Categories() {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch
  } = useGetAllCategories();
  
  const navigation = useAppNavigation();
  
  if (isError) {
    return (
      <View style={tw`py-3 flex-row items-center`}>
        <Text style={tw`text-red-500 text-xs mr-2`}>Falha ao carregar categorias</Text>
        <TouchableOpacity 
          style={tw`bg-neutral-200 py-1 px-2 rounded-full`} 
          onPress={() => refetch()}
        >
          <Text style={tw`text-xs`}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView
      horizontal={true}
      style={tw`py-4`}
      showsHorizontalScrollIndicator={false}
    >
      {isLoading && (
        <>
          {[...Array(4).keys()].map(c => (
            <View 
              key={`skeleton-${c}`}
              style={tw`w-[106px] h-[106px] items-center justify-center rounded-2xl mr-2 bg-stone-200 mt-2 gap-2`} 
            />
          ))}
        </>
      )}
      
      {!isLoading && categories.map((category) => (
        <Category 
          {...category} 
          key={`category-${category.id}`}
          onPress={() => navigation.navigate('CategoryProducts', { categoryId: category.id })}
        />
      ))}
    </ScrollView>
  );
}

function Home() {
  const navigation = useAppNavigation();
  
  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView style={tw`mb-20`}>
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
            <Banner1 style={tw`mr-2`} />
            <Banner2 /> 
          </ScrollView>
          <View>
            <View style={tw`flex flex-row items-center justify-between mt-5`}>
              <Text style={tw`font-bold text-xl`}>Categorias</Text>
              <View style={tw`flex flex-row items-center`}>
                <TouchableOpacity 
                  style={tw`flex flex-row items-center`} 
                  onPress={() => navigation.navigate('Categories')}
                >
                  <Text style={tw`text-stone-400`}>Ver todas</Text>
                  <CaretRight
                    size={16}
                    color="#9ca3af"
                    weight="regular"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Categories />
          </View>
          
          {/* Cabeçalho da seção de Produtos */}
          <View style={tw`flex flex-row items-center justify-between mt-5`}>
            <Text style={tw`font-bold text-xl`}>Produtos</Text>
          </View>
          
          {/* Botões de filtro e Ver tudo na mesma linha */}
          <View style={tw`flex-row justify-between items-center mt-2`}>
            <View style={tw`flex-row flex-1`}>
              <TouchableOpacity style={tw`px-4 py-2 rounded-full items-center gap-1 bg-black flex-row`}>
                <Heart color="#FFFFFF" size={16} weight="fill" />
                <Text style={tw`text-white text-base`}>Para você</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={tw`flex flex-row items-center ml-2`} 
              onPress={() => navigation.navigate('AllProducts')}
            >
              <Text style={tw`text-stone-400 text-base`}>Ver tudo</Text>
              <CaretRight
                size={14}
                color="#9ca3af"
                weight="regular"
              />
            </TouchableOpacity>
          </View>
          
          <ForYouProducts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;