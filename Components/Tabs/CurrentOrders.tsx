import { View, Text, FlatList, Alert, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { subscribeToCurrentOrders } from '../../DataManagement/DataManager';

const CurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([] as Order[]);
  const [loading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCurrentOrders(
      (orders: React.SetStateAction<Order[]>) => setCurrentOrders(orders),
      (error: any) => Alert.alert('Failed to fetch current orders', error),
    );

    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={currentOrders}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-base">Order ID: {item.id}</Text>
            <Button
              title="Cancel"
              onPress={() => {
                // Handle canceling the order
                Alert.alert(`Canceled order ${item.id}`);
              }}
            />
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <Text className="text-gray-500">No Current Orders.</Text>
        }
      />
    </View>
  );
};

export default CurrentOrders;
