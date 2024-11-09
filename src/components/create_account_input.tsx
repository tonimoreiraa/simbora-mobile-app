import {Text, TextInput, View} from 'react-native';
import tw from 'twrnc';

interface inputProps {
  description: string;
  placeholder: string;
  secureTextEntry?: boolean;
}

const accountInput: React.FC<inputProps> = ({description, placeholder, secureTextEntry}) => {
  return (
    <View style={tw`w-full`}>
      <Text style={tw`text-xs mb-1`}>{description}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        style={tw`bg-stone-100 py-4 px-3 w-full rounded-md`}
      />
    </View>
  );
};

export default accountInput;
