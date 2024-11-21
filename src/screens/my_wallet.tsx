import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {
  ArrowLeft,
  Bank,
  PlusCircle,
  CaretUp,
  CaretDown,
  CaretRight,
} from 'phosphor-react-native';
import tw from 'twrnc';

export default function MyWallet() {
  const icons = {
    CaretUp: CaretUp,
    CaretDown: CaretDown,
    CaretRight: CaretRight,
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between p-4`}>
        <ArrowLeft size={24} />
        <Text style={tw`text-lg font-bold`}>Minha carteira</Text>
        <View style={tw`w-6`} />
      </View>
      <View style={tw`bg-black p-4 mx-4 rounded-lg`}>
        <Text style={tw`text-stone-500`}>Sua comissão</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-3xl font-bold text-white mt-1`}>R$3.258,25</Text>
          <TouchableOpacity
            style={tw`border border-stone-500 px-2 py-1 rounded ml-4`}>
            <Text style={tw`text-stone-500`}>Últimos 15 dias</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between p-4`}>
        <View
          style={tw`flex-row items-center bg-stone-500 rounded-full px-4 py-2`}>
          <Bank size={16} weight="fill" color="white" />
          <Text style={tw`text-white ml-2`}>*****998-1</Text>
        </View>
        <TouchableOpacity
          style={tw`flex flex-row items-center bg-blue-500 px-4 py-2 rounded-full`}>
          <PlusCircle size={16} weight="fill" color="white" />
          <Text style={tw`text-white ml-2`}>Adicionar conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`text-xl px-4 py-2 font-bold`}>Transações</Text>
      <ScrollView style={tw`flex-1`}>
        {[
          {
            date: '05 de agosto',
            type: 'Comissão efetivada',
            amount: '+R$125,89',
            color: 'green',
            icon: 'CaretUp',
          },
          {
            date: '04 de Agosto',
            type: 'Comissão pendente',
            amount: '+R$167,48',
            color: 'orange',
            icon: 'CaretRight',
          },
          {
            date: '05 de agosto',
            type: 'Retirada de valor',
            amount: '-R$1.258,96',
            color: 'blue',
            icon: 'CaretDown',
          },
        ].map((transaction, index) => {
          const IconComponent = icons[transaction.icon as keyof typeof icons];
          return (
            <View
              key={index}
              style={tw`flex-row justify-between items-center bg-gray-100 p-4 m-2 rounded-lg`}>
              <View>
                <Text style={tw`text-gray-500`}>{transaction.date}</Text>
                <View style={tw`flex-row items-center`}>
                  {IconComponent && (
                    <IconComponent
                      size={18}
                      weight="fill"
                      color={transaction.color}
                    />
                  )}
                  <Text>{transaction.type}</Text>
                </View>
              </View>
              <Text>{transaction.amount}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
