import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { formattedDate } from '../../DataManagement/DataManager';
import { OrderStatus, TimeFormat } from '../../types/enum';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';

const OrderHistory = () => {
  const orderHistorty = useSelector(
    (state: RootState) => state.orderHistory.orders as Order[],
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={orderHistorty}
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
                  {item.created
                    ? formattedDate(item.created, TimeFormat.DateAndTime)
                    : 'N/A'}{' '}
                  -{' '}
                </Text>
                <Text
                  className={
                    item.status === OrderStatus.InProgress
                      ? 'text-blue-500'
                      : item.status === OrderStatus.Canceled
                        ? 'text-red-500'
                        : item.status === OrderStatus.Completed
                          ? 'text-green-500'
                          : 'text-gray-500'
                  }
                >
                  {item.status}
                </Text>
              </View>
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
              </View>
            )}
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <Text className="text-gray-500">Empty Order History</Text>
        }
      />
    </View>
  );
};

export default OrderHistory;
