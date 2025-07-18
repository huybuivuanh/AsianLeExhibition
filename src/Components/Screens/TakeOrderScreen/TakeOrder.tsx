import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { subscribeToMenuItems } from '../../../DataManagement/DataManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../Redux/OrderSlice';
import { RootStackParamList } from '../../../Navigation/RootStackParamList';
import { useOrder } from '../../../Redux/hooks';
import { showAlert } from '../../../Notification/Alert';
import { AlertType } from '../../../types/enum';

type Props = NativeStackScreenProps<RootStackParamList>;

const TakeOrder = ({ navigation }: Props) => {
  const [menuItems, setMenuItems] = useState([] as MenuItem[]);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const order = useOrder() as Order;

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: React.SetStateAction<MenuItem[]>) => setMenuItems(items),
      (error: any) =>
        showAlert(AlertType.Error, `Failed to fetch menu items: ${error}`),
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
                try {
                  dispatch(addItem(item));
                  showAlert(AlertType.Success, 'Item added to order!');
                  setAddedItemId(item.id ?? null);
                  setTimeout(() => setAddedItemId(null), 180);
                } catch (error) {
                  showAlert(AlertType.Error, 'Failed to add item to order');
                }
              }}
            >
              <Text className="text-white text-lg font-semibold">+</Text>
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

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-xl items-center mt-4"
        onPress={() => navigation.navigate('Cart')}
      >
        <Text className="text-white text-base font-semibold">
          Cart ({order.numberOfItems})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TakeOrder;
