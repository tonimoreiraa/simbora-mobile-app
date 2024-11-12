import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

interface CarouselProps {
  items: string[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  return (
    <View style={tw`w-full h-96`}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3000}
        autoplayLoop
        index={0}
        showPagination
        data={items}
        renderItem={({ item }) => (
          <View style={[tw`h-96`, { width }]}>
            <Image
              source={{ uri: item }}
              style={[tw`h-96`, { width }]}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Carousel;