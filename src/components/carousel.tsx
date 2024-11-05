import React from 'react';
import { View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import tw from 'twrnc';

const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

const MyCarousel = () => (
  <View>
    <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      index={2}
      data={colors}
      renderItem={({ item }) => (
        <View style={tw`p-2 mt-2`}>
          <View style={tw`w-60 h-30 rounded-lg bg-gray-200`}>{}</View>
        </View>
      )}
    />
  </View>
);

export default MyCarousel;