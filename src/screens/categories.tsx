import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import { api } from '../services/api';
import { useQuery } from 'react-query';

const getCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}

export default function Categories() {
  const {
    data,
    isLoading,
    isSuccess
  } = useQuery('@categories', getCategories)

  return (
    <ScrollView style={tw`px-4`}>
      <InputSearch />
      <View style={tw`mt-4 flex-wrap flex-row flex-1`}>
        {isSuccess && data.map((category: any) => (
          <View style={tw`p-1 w-1/2`}>
             <View style={tw`bg-neutral-200 flex-row rounded-xl p-2 px-3 items-center gap-4`}>
              <Image
                source={{ uri: category.image }}
                width={50}
                height={50}
                resizeMode='contain'
              />
              <Text style={tw`text-base font-semibold`}>
                {category.name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
