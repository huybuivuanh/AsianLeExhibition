import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { addMenuItem } from '../../../DataManagement/DataManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Navigation/RootStackParamList';
import { RouteName } from '../../../types/enum';

type Props = NativeStackScreenProps<RootStackParamList, RouteName.AddMenuItem>;

const AddMenuItem = ({ navigation }: Props) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMenuItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Please enter a menu item name');
      return;
    }
    setLoading(true);
    try {
      await addMenuItem({
        name: newItemName.trim(),
        price: parseFloat(newItemPrice) || 0,
      });
      navigation.goBack();
      setNewItemName('');
      setNewItemPrice('');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      Alert.alert('Error', 'Failed to add menu item');
    }
    setLoading(false);
  };

  return (
    <View className="mt-4">
      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-3"
        placeholder="Enter new item name"
        value={newItemName}
        onChangeText={setNewItemName}
      />
      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-4"
        placeholder="Enter new item price"
        value={newItemPrice}
        onChangeText={setNewItemPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl items-center"
        onPress={handleAddMenuItem}
        disabled={loading}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? 'Loading...' : 'Add Menu Item'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddMenuItem;
