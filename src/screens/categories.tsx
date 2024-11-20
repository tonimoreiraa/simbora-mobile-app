import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import tw from 'twrnc';
import InputSearch from '../components/input_search';
import Category from '../components/category';

export default function Categories() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`px-4`}>
          <InputSearch />
        </View>
        <View
          style={tw`flex flex-row flex-wrap items-center justify-between mt-6 px-4`}>
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
          <Category />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
