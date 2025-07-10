import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateMenuItem } from '../../../DataManagement/DataManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Navigation/RootStackParamList';
import { RouteName } from '../../../types/enum';

type Props = NativeStackScreenProps<RootStackParamList, RouteName.EditMenuItem>;

const EditMenuItem = ({ route, navigation }: Props) => {
  const { item } = route.params;
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price ? item.price.toString() : '0');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a menu item name');
      return;
    }
    setLoading(true);
    try {
      const updatedItem: MenuItem = {
        id: item.id,
        name: name.trim(),
        price: parseFloat(price) || 0,
        created: item.created,
      };
      await updateMenuItem(updatedItem);
      Alert.alert('Success', 'Menu item updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update menu item:', error);
      Alert.alert('Error', 'Failed to update menu item');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 p-4 bg-white justify-center">
      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-3"
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-4"
        placeholder="Item price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity
        className="bg-green-600 py-4 rounded-xl items-center mb-3"
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? 'Updating...' : 'Update Menu Item'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-gray-500 py-3 rounded-xl items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-base font-semibold">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditMenuItem;
