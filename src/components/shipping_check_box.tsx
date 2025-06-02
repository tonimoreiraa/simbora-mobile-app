import React from 'react';
import {View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function ShippingCheckBox() {
  return (
    <View>
      <BouncyCheckbox
        size={16}
        fillColor="#d3d3d3"
        unFillColor="#fff"
        iconStyle={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: '#d3d3d3',
        }}
        onPress={(isChecked: boolean) => {}}
      />
    </View>
  );
}
