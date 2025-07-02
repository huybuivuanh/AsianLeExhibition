import React, { useEffect, useState } from 'react';
import { Text, View, Button, FlatList, TextInput, Alert } from 'react-native';
import {
  addMenuItem,
  subscribeToMenuItems,
} from '../../DataManagement/DataManager';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([] as MenuItem[]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: React.SetStateAction<MenuItem[]>) => setMenuItems(items),
      (error: any) => Alert.alert('Failed to fetch menu items', error),
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

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
      // No need to manually reload items; onSnapshot will update automatically
    } catch (error) {
      console.error('Failed to add menu item:', error);
      Alert.alert('Error', 'Failed to add menu item');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-4">Menu Screen</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="py-2 border-b border-gray-200">
            <Text className="text-base">
              {item.name} - ${item.price}
            </Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={() => {}} // no manual refresh needed; using realtime updates
        ListEmptyComponent={
          <Text className="text-gray-500">No menu items found.</Text>
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
