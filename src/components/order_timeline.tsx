import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface TimelineEvent {
  title: string;
  datetime: string;
  isCompleted?: boolean;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  return (
    <View style={tw`px-2 py-2`}>
      {events.map((event, index) => (
        <View key={index} style={tw`flex-row`}>
          {index !== events.length - 1 && (
            <View 
              style={tw.style(
                'absolute left-[3px] top-6 bottom-0 w-[2px]',
                'bg-gray-300'
              )}
            />
          )}
          <View 
            style={tw`w-2 h-2 rounded-full bg-black mt-2 mr-2`}
          />
          
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-semibold text-gray-800`}>
              {event.title}
            </Text>
            <Text style={tw`text-sm text-gray-500 mt-1`}>
              {event.datetime}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default OrderTimeline;