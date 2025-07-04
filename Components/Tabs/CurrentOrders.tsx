import {
  View,
  Text,
  FlatList,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { subscribeToCurrentOrders } from '../../DataManagement/DataManager';

const CurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([] as Order[]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCurrentOrders(
      (orders: React.SetStateAction<Order[]>) => setCurrentOrders(orders),
      (error: any) => Alert.alert('Failed to fetch current orders', error),
    );

    return () => unsubscribe();
  }, []);

  const formattedDate = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} - ${month}/${day}/${year}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={currentOrders}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-2">
            <TouchableOpacity onPress={() => toggleExpand(item.id || '')}>
              <Text className="text-base font-bold">
                Order#: {item.orderNumber} -{' '}
                {item.created ? formattedDate(item.created) : 'N/A'}
              </Text>
            </TouchableOpacity>

            {expandedOrderId === item.id && (
              <View className="mt-2 pl-2">
                {/* Replace this with actual order details */}
                {item.items && item.items.length > 0 ? (
                  item.items.map((orderItem, index) => (
                    <Text key={index}>
                      {orderItem.name} x {orderItem.quantity} - $
                      {orderItem.price}
                    </Text>
                  ))
                ) : (
                  <Text>No items in this order.</Text>
                )}

                <Text>Total: ${item.total.toFixed(2)}</Text>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => {
                    Alert.alert(`Canceled order ${item.id}`);
                  }}
                />
              </View>
            )}
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
