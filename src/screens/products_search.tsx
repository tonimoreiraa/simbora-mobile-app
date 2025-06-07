import {SafeAreaView, ScrollView, Text} from 'react-native';
import InputSearch from '../components/input_search';
import tw from 'twrnc';
import {useDebouncedState} from '../helpers/debounced-state';
import {useQuery} from 'react-query';
import {api} from '../services/api';
import {useState} from 'react';
import ProductCard from '../components/product_card';
import {View} from 'react-native';

const getProducts = async (params: any) => {
  const query = params.queryKey[1];
  const page = params.queryKey[2];
  const {data} = await api.get('/products', {
    params: {query, page},
  });
  return data;
};

export function ProductsSearch() {
  const {debouncedValue, setInputValue, inputValue} = useDebouncedState();
  const [page, setPage] = useState(1);

  const {data} = useQuery(['@products', debouncedValue, page], getProducts, {
    keepPreviousData: true,
  });

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <ScrollView style={tw`px-4 pt-4 bg-white`}>
        <InputSearch
          onChangeText={value => setInputValue(value)}
          value={inputValue}
          autoFocus
        />
        <View style={tw`flex-wrap flex-row gap-4 justify-between`}>
          {data?.data.map((product: any) => (
            <ProductCard {...product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
