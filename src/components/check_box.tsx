import {View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function CheckBox() {
  return (
    <View>
      <BouncyCheckbox
        size={16}
        fillColor="#d3d3d3"
        onPress={(isChecked: boolean) => {}}
      />
    </View>
  );
}
