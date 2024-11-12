import {View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function CheckBox() {
  return (
    <View>
      <BouncyCheckbox 
      size={16}
      fillColor='blue'
      onPress={(isChecked: boolean) => {}} 
      />
    </View>
  );
}
