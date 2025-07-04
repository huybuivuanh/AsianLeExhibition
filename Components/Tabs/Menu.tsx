import React, { useState } from 'react';
import { Text, View, Button, FlatList, TextInput, Alert } from 'react-native';
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

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-base">
              {item.name} - ${item.price}
            </Text>
            <Button
              title="X"
              color="red"
              onPress={async () => {
                setLoading(true);
                try {
                  if (typeof item.id === 'string') {
                    await deleteMenuItem(item.id);
                    Alert.alert('Success', 'Menu item deleted successfully');
                  } else {
                    Alert.alert('Error', 'Invalid menu item ID');
                  }
                } catch (error) {
                  console.error('Failed to delete menu item:', error);
                  Alert.alert('Error', 'Failed to delete menu item');
                }
                setLoading(false);
              }}
            />
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <Text className="text-gray-500">Menu Is Empty.</Text>
        }
      />

      <TextInput
        className="border border-gray-300 rounded-md p-3 my-4"
        placeholder="Enter new item name"
        value={newItemName}
        onChangeText={setNewItemName}
      />
      <TextInput
        className="border border-gray-300 rounded-md p-3 my-4"
        placeholder="Enter new item price"
        value={newItemPrice}
        onChangeText={setNewItemPrice}
        keyboardType="numeric"
      />

      <Button
        title={loading ? 'Loading...' : 'Add Menu Item'}
        onPress={handleAddMenuItem}
        disabled={loading}
      />
    </View>
  );
};

export default Menu;
