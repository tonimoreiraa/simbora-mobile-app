import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import Carousel from '../components/carousel';
import ColorSelect from '../components/color_select';
import ProductCard from '../components/product_card';
import {ShoppingBagOpen} from 'phosphor-react-native';
import { SealPercent } from 'phosphor-react-native';
import { FireSimple } from 'phosphor-react-native';
import { LightbulbFilament } from 'phosphor-react-native';
interface InputSearchProps {
  hideMicrophone?: boolean
  hideImageScanner?: boolean
}


const Product: React.FC<InputSearchProps> = ({ hideImageScanner, hideMicrophone }) => {
  const items = [
    'https://avatars.githubusercontent.com/u/59844592?v=4',
    'https://avatars.githubusercontent.com/u/59844592?v=4',
    'https://avatars.githubusercontent.com/u/59844592?v=4',
  ];

  return (
    <SafeAreaView style={tw`py-4`}>
      <ScrollView style={tw`px-4`}>
        <View
          style={tw`flex flex-row items-center justify-center w-full px-12`}>
          <TouchableOpacity>
            <Icon name="chevron-back" size={28} style={tw`mr-2`} />
          </TouchableOpacity>
          <View style={tw`w-full`}>
            <View
              style={tw`flex-row items-center justify-center bg-black rounded-lg px-4 h-12`}>
              <Icon name="search-outline" size={16} color="white" />
              <TextInput
                style={tw`flex-1 ml-2 text-base text-stone-900`}
                placeholder="Buscar"
                placeholderTextColor="white"
              />
              <View style={tw`flex-row gap-4`}>
                {!hideMicrophone && (
                  <TouchableOpacity>
                    <Icon name="mic" size={20} color="white"/>
                  </TouchableOpacity>
                )}
                {!hideImageScanner && (
                  <TouchableOpacity>
                    <Icon name="scan" size={20} color="white"/>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View>
            <ShoppingBagOpen size={28} style={tw`ml-2`} weight="fill" />
          </View>
        </View>
        <View style={tw`mt-4`}>
          <Carousel items={items} />
        </View>
        <View style={tw`py-4`}>
          <Text style={tw`text-xl font-bold`}>
            Fio Cabo Flexível 2.5mm SIL | 100M
          </Text>
        </View>
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            >
              <View style={tw`px-6 py-2 border border-black rounded-full items-center gap-1 flex-row`}>
                <FireSimple color="black" size={18} weight='fill'/>
                <Text style={tw`text-stone-600 text-lg`}>Para você</Text>
              </View>
              <View style={tw`px-6 py-2 border border-black rounded-full items-center gap-1 flex-row ml-2`}>
                <LightbulbFilament
                  weight="fill"
                  color='black'
                  size={18}
                />
                <Text style={tw`text-lg text-stone-600`}>Em promo</Text>
              </View>
          </ScrollView>
        <View>
          <Text style={tw`font-bold text-base text-stone-600 mt-4`}>
            Selecione a cor
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={tw`py-2`}>
            <ColorSelect />
            <ColorSelect />
            <ColorSelect />
            <ColorSelect />
          </ScrollView>
        </View>
        <View>
          <Text style={tw`font-bold text-base text-stone-600 mt-2`}>
            Descrição
          </Text>
          <Text style={tw`text-stone-500`}>
            Usando o material e o tipo de cabo certos, é possível transportar
            energia de um ponto para outro sem dificuldade, de forma segura,
            confiável e sem complicações.
          </Text>
        </View>
        <View>
          <Text style={tw`font-semibold text-xl mt-4`}>Itens similares</Text>
          <View
            style={tw`flex flex-row flex-wrap items-center justify-between mt-2 mb-24`}>
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </View>
        </View>
      </ScrollView>
      <View
        style={tw`absolute flex-row items-center bottom-0 bg-white border-t border-stone-400 w-full py-8 px-4`}>
        <View style={tw`w-1/3`}>
          <View style={tw`flex flex-row items-center`}>
            <Text style={tw`text-lg font-semibold`}>R$</Text>
            <Text style={tw`text-lg font-semibold`}>214,99</Text>
          </View>
          <Text style={tw`font-semibold text-stone-200 mt-1`}>
            12 x de R$20,80
          </Text>
        </View>
        <TouchableOpacity
          style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl w-2/3`}>
          <Text style={tw`font-bold text-lg text-white`}>
            Adicionar a sacola
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Product;
