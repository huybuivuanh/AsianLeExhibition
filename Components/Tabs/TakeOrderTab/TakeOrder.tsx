import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { Alert } from 'react-native';
import { subscribeToMenuItems } from '../../../DataManagement/DataManager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../Redux/OrderSlice';

const TakeOrder = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const [menuItems, setMenuItems] = useState([] as MenuItem[]);
  const [loading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: React.SetStateAction<MenuItem[]>) => setMenuItems(items),
      (error: any) => Alert.alert('Failed to fetch menu items', error),
    );

    return () => unsubscribe();
  }, []);

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
              title="+"
              onPress={() => {
                dispatch(addItem(item));
                Alert.alert(`Added ${item.name} to current order`);
              }}
            />
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <Text className="text-gray-500">Menu Is Empty.</Text>
        }
      />
      <Button
        title="Cart"
        onPress={() => {
          navigation.navigate('Cart');
        }}
      />
    </View>
  );
};

export default TakeOrder;
