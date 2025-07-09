import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { subscribeToMenuItems } from '../../../DataManagement/DataManager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { addItem } from '../../../Redux/OrderSlice';

const TakeOrder = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const [menuItems, setMenuItems] = useState([] as MenuItem[]);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [loading] = useState(false);

  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order);

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: React.SetStateAction<MenuItem[]>) => setMenuItems(items),
      (error: any) => Alert.alert('Failed to fetch menu items', error),
    );

    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 p-4 bg-white">
      <FlatList
        data={menuItems}
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
