import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';

interface VariantSelectProps {
  options: string[];
  onSelect?: (selected: string | null) => void;
  defaultSelected?: string;
}

export default function VariantSelect({
  options,
  onSelect,
  defaultSelected,
}: VariantSelectProps) {
  const [selected, setSelected] = useState<string | null>(
    defaultSelected || null,
  );

  const handleSelect = (option: string) => {
    if (selected === option) {
      setSelected(null);
      onSelect?.(null);
    } else {
      setSelected(option);
      onSelect?.(option);
    }
  };

  return (
    <View style={tw`flex flex-row`}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={tw`flex flex-col items-center justify-center border-[0.5px] border-stone-600 py-1 px-6 rounded-lg mr-2
            ${selected === option ? 'bg-black' : ''}`}
          onPress={() => handleSelect(option)}>
          <Text
            style={tw`text-[#696969] text-lg ${
              selected === option ? 'text-white' : ''
            }`}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
