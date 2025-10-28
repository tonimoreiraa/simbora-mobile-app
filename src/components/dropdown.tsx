import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import tw from 'twrnc';

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Cartão de crédito', value: 'credit-card'},
    {label: 'Cartão de débito', value: 'debit-card'},
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
      style={tw`bg-gray-50 border border-neutral-200 rounded-lg mt-4 py-4 px-3`}
      dropDownContainerStyle={tw`border border-neutral-200 bg-gray-50 rounded-lg`}
      placeholderStyle={tw`text-neutral-500`}
      textStyle={tw`text-neutral-700`}
      selectedItemContainerStyle={tw`bg-blue-50`}
      selectedItemLabelStyle={tw`text-blue-600`}
    />
  );
};

export default DropDown;
