import {
  View,
  Text,
  FlatList,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  subscribeToCurrentOrders,
  updateOrder,
  formattedDate,
} from '../../DataManagement/DataManager';
import { OrderStatus } from '../../types/enum';

const CurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([] as Order[]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCurrentOrders(
      (orders: Order[]) => {
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = new Date(a.created || '').getTime();
          const dateB = new Date(b.created || '').getTime();
          return dateB - dateA;
        });
        setCurrentOrders(sortedOrders);
      },
      (error: any) => Alert.alert('Failed to fetch current orders', error),
    );

    return () => unsubscribe();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={currentOrders}
        keyExtractor={(order, index) => order.id || index.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-2">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => toggleExpand(item.id || '')}
            >
              <View className="flex-row items-center">
                <Text className="text-base font-bold">
                  Order#: {item.orderNumber} -{' '}
                  {item.created ? formattedDate(item.created, true) : 'N/A'}{' '}
                  -{' '}
                </Text>
                <Text
                  className={
                    item.status === OrderStatus.InProgress
                      ? 'text-blue-500'
                      : item.status === OrderStatus.Canceled
                        ? 'text-red-500'
                        : 'text-gray-500'
                  }
                >
                  {item.status}
                </Text>
              </View>

              <Button
                title="Done"
                color="blue"
                onPress={() => {
                  if (item.id) {
                    updateOrder(item.id, OrderStatus.Completed);
                  } else {
                    Alert.alert('Error', 'Order ID is missing.');
                  }
                }}
              />
            </TouchableOpacity>

            {expandedOrderId === item.id && (
              <View className="mt-2 pl-2">
                {item.orderItems &&
                  item.orderItems.length > 0 &&
                  item.orderItems.map((orderItem, index) => (
                    <Text key={index}>
                      {orderItem.quantity}x {orderItem.name} - $
                      {(orderItem.price * orderItem.quantity).toFixed(2)}
                    </Text>
                  ))}

                <Text>Total: ${item.total.toFixed(2)}</Text>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => {
                    Alert.alert(`Canceled order ${item.orderNumber}`);
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
