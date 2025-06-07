import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal} from 'react-native';
import tw from 'twrnc';
import {Plus, X} from 'phosphor-react-native';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import axios from 'axios';

function CepInput() {
  const [cepValue, setCepValue] = useState<string>();
  const form = useFormContext();

  useEffect(() => {
    if (cepValue?.length == 8) {
      axios.get(`https://viacep.com.br/ws/${cepValue}/json/`).then(({data}) => {
        console.log(data);
      });
    }
  }, [cepValue]);

  return (
    <Controller
      name="zipCode"
      control={form.control}
      render={({field}) => (
        <TextInput
          value={field.value}
          onChangeText={text => {
            field.onChange(text);
            setCepValue(text);
          }}
          style={tw`flex px-2 py-4 rounded bg-stone-100 w-full`}
          placeholder="00.000-00"
        />
      )}
    />
  );
}

export function NewAddressDrawer() {
  const [isEnabled, setIsEnabled] = useState(false);
  const form = useForm();

  const handlePressTrigger = () => setIsEnabled(e => !e);

  return (
    <>
      <View style={tw`px-4`}>
        <TouchableOpacity
          onPress={handlePressTrigger}
          style={tw`bg-blue-500 rounded-2xl py-2 px-3 flex-row items-center justify-center gap-1 mt-2`}>
          <Plus size={20} color="#ffffff" weight="bold" />
          <Text style={tw`text-lg text-white`}>Novo endereço</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        visible={isEnabled}
        onRequestClose={() => setIsEnabled(false)}
        transparent={true}>
        <FormProvider {...form}>
          <View style={tw`flex-1 flex-col justify-end`}>
            <View style={tw`bg-white p-4 pb-8 rounded-t-2xl`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`font-semibold text-xl`}>
                  Adicionando novo endereço
                </Text>
                <TouchableOpacity onPress={() => setIsEnabled(false)}>
                  <X size={24} color="#000000" weight="regular" />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={tw`mb-0.5 py-2`}>Nome do endereço</Text>
                <Controller
                  name="name"
                  control={form.control}
                  render={({field}) => (
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      style={tw`flex px-2 py-4 rounded bg-stone-100 w-full`}
                      placeholder="00.000-00"
                    />
                  )}
                />
              </View>
              <View>
                <Text style={tw`mb-0.5 py-2`}>CEP</Text>
                <CepInput />
              </View>
              <View>
                <Text style={tw`mb-0.5 py-2`}>Nome da rua</Text>
                <Controller
                  name="address"
                  control={form.control}
                  render={({field}) => (
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      style={tw`flex px-2 py-4 rounded bg-stone-100 w-full`}
                      placeholder="Nome da rua"
                    />
                  )}
                />
              </View>
              <View>
                <Text style={tw`mb-0.5 py-2`}>Número</Text>
                <Controller
                  name="number"
                  control={form.control}
                  render={({field}) => (
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      style={tw`flex px-2 py-4 rounded bg-stone-100 w-full`}
                      placeholder="Número da casa ou apartamento"
                    />
                  )}
                />
              </View>
              <View style={tw`flex flex-row justify-between w-full`}>
                <View style={tw`w-46`}>
                  <Text style={tw`mb-0.5 py-2`}>Cidade</Text>
                  <Controller
                    name="city"
                    control={form.control}
                    render={({field}) => (
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        style={tw`fl px-2 py-4 rounded-2 bg-stone-100 w-full`}
                        placeholder="Cidade"
                      />
                    )}
                  />
                </View>
                <View style={tw`w-46`}>
                  <Text style={tw`mb-0.5 py-2`}>Estado</Text>
                  <Controller
                    name="state"
                    control={form.control}
                    render={({field}) => (
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        style={tw`fl px-2 py-4 rounded-2 bg-stone-100 w-full`}
                        placeholder="Estado"
                      />
                    )}
                  />
                </View>
              </View>
              <View
                style={tw`flex flex-col items-center justify-center bg-blue-500 p-4 rounded-xl mt-4`}>
                <TouchableOpacity>
                  <Text style={tw`font-bold text-base text-white`}>
                    Salvar Endereço
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </FormProvider>
      </Modal>
    </>
  );
}
