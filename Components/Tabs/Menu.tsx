import React, { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { addMenuItem, deleteMenuItem } from '../../DataManagement/DataManager';
import { RootState } from '../../Redux/Store';
import { useSelector } from 'react-redux';

const Menu = () => {
  const menuItems = useSelector(
    (state: RootState) => state.menu.items as MenuItem[],
  );
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
      setNewItemName('');
      setNewItemPrice('');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      Alert.alert('Error', 'Failed to add menu item');
    }
    setLoading(false);
  };

  const handleDeleteMenuItem = async (id: string | undefined) => {
    if (!id) {
      Alert.alert('Error', 'Invalid menu item ID');
      return;
    }
    setLoading(true);
    try {
      await deleteMenuItem(id);
      Alert.alert('Success', 'Menu item deleted successfully');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      Alert.alert('Error', 'Failed to delete menu item');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 rounded-xl p-4 mb-3 shadow-sm flex-row justify-between items-center">
            <Text className="text-base font-medium text-gray-800">
              {item.name} - $
              {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
            </Text>
            <TouchableOpacity
              className="bg-red-500 px-3 py-1 rounded-full"
              onPress={() => handleDeleteMenuItem(item.id)}
            >
              <Text className="text-white font-semibold">X</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-500">Menu is empty.</Text>
          </View>
        }
      />

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

export default Menu;
