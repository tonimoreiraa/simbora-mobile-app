import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import tw from 'twrnc';

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
    {label: 'Orange', value: 'orange'},
    {label: 'Mango', value: 'mango'},
  ]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Cartão de crédito"
      style={tw`order-stone-300 rounded-lg border border-transparent bg-stone-100 mt-4`}
      dropDownContainerStyle={tw`border-transparent bg-stone-100 rounded-lg`}
      placeholderStyle={tw`text-gray-400`}
      selectedItemContainerStyle={tw`bg-blue-50`}
      selectedItemLabelStyle={tw`text-blue-600`}
    />
  );
};

export default DropDown;
