import React from 'react';
import { View, Image } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import tw from 'twrnc';

interface TCarouselProps<T> {
  items: T[];
}

const Carousel = <T,>({ items }: TCarouselProps<T>) => (
  <View style={tw`w-full h-96`}>
    <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      index={0}
      data={items}
      renderItem={({ item }) => (
        <View  style={tw`w-full h-96`}>
          <Image
            source={typeof item === 'string' ? { uri: item } : item}
            resizeMode="cover"
            style={tw`w-full h-96`}
          />
        </View>
      )}
    />
  </View>
);

export default Carousel;