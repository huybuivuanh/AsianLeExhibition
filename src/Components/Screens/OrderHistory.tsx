import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { formattedDate } from '../../DataManagement/DataManager';
import { OrderStatus, TimeFormat } from '../../types/enum';
import { useOrderHistory } from '../../Redux/hooks';

const OrderHistory = () => {
  const orderHistory = useOrderHistory().orders as Order[];
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <FlatList
        data={orderHistory}
        keyExtractor={(order, index) => order.id || index.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 rounded-xl mb-4 p-4 shadow-sm">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => toggleExpand(item.id || '')}
            >
              <View>
                <Text className="text-base font-semibold text-gray-800">
                  Order#: {item.orderNumber}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.created
                    ? formattedDate(item.created, TimeFormat.DateAndTime)
                    : 'N/A'}
                </Text>
              </View>

              <View
                className={`px-2 py-1 rounded-full ${
                  item.status === OrderStatus.InProgress
                    ? 'bg-blue-100'
                    : item.status === OrderStatus.Canceled
                      ? 'bg-red-100'
                      : item.status === OrderStatus.Completed
                        ? 'bg-green-100'
                        : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    item.status === OrderStatus.InProgress
                      ? 'text-blue-600'
                      : item.status === OrderStatus.Canceled
                        ? 'text-red-600'
                        : item.status === OrderStatus.Completed
                          ? 'text-green-600'
                          : 'text-gray-600'
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedOrderId === item.id && (
              <View className="mt-3 border-t border-gray-300 pt-2">
                {item.orderItems &&
                  item.orderItems.length > 0 &&
                  item.orderItems.map((orderItem, index) => (
                    <View key={index} className="flex-row justify-between mb-1">
                      <Text className="text-gray-700">
                        {orderItem.quantity}x {orderItem.name}
                      </Text>
                      <Text className="text-gray-700">
                        ${(orderItem.price * orderItem.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}

                <Text className="text-base font-semibold text-right text-gray-800 mt-2">
                  Total: ${item.total.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-500">Empty Order History</Text>
          </View>
        }
      />
    </View>
  );
};

export default OrderHistory;
