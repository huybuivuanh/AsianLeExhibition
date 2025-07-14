import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { subscribeToMenuItems } from '../../../DataManagement/DataManager';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../Redux/OrderSlice';

const AddItemToOrder = () => {
  const [menuItems, setMenuItems] = useState([] as MenuItem[]);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: React.SetStateAction<MenuItem[]>) => setMenuItems(items),
      (error: any) => Alert.alert('Failed to fetch menu items', error),
    );

    return () => unsubscribe();
  }, []);

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View className="flex-1 p-4 bg-white">
      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-4"
        placeholder="Search menu items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredMenuItems}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View
            className={`flex-row justify-between items-center p-4 mb-3 rounded-xl shadow-sm ${
              addedItemId === item.id ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <Text className="text-base font-medium text-gray-800">
              {item.name} - $
              {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
            </Text>
            <TouchableOpacity
              className="bg-green-500 px-4 py-2 rounded-full"
              onPress={() => {
                dispatch(addItem(item));
                setAddedItemId(item.id ?? null);
                setTimeout(() => setAddedItemId(null), 180);
              }}
            >
              <Text className="text-white text-lg font-semibold">+</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshing={loading}
      />
    </View>
  );
};

export default AddItemToOrder;
