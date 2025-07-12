import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearOrder } from '../../../Redux/OrderSlice';
import { RootState } from '../../../Redux/store';
import { submitCurrentOrder } from '../../../DataManagement/DataManager';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order);
  const navigation = useNavigation();

  return (
    <View className="flex-1 p-4 bg-white">
      {order.orderItems.length === 0 ? (
        <View className="items-center mt-10">
          <Text className="text-gray-500">Cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={order.orderItems}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 rounded-xl p-4 mb-3 shadow-sm flex-row justify-between items-center">
              <Text className="text-base font-medium text-gray-800">
                {item.name} - $
                {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
              </Text>
              <View className="flex-row items-center space-x-3 gap-2">
                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded-full"
                  onPress={() => item.id && dispatch(removeItem(item.id))}
                >
                  <Text className="text-white text-lg font-semibold">-</Text>
                </TouchableOpacity>
                <Text className="text-base text-gray-800">{item.quantity}</Text>
                <TouchableOpacity
                  className="bg-green-500 px-3 py-1 rounded-full"
                  onPress={() => item.id && dispatch(addItem(item))}
                >
                  <Text className="text-white text-lg font-semibold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {order.orderItems.length > 0 && (
        <View className="mt-4">
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-xl items-center mb-3"
            onPress={() => {
              submitCurrentOrder(order);
              dispatch(clearOrder());
              navigation.goBack();
            }}
          >
            <Text className="text-white text-base font-semibold">
              Submit - ${order.total.toFixed(2)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-xl items-center"
            onPress={() => {
              dispatch(clearOrder());
            }}
          >
            <Text className="text-white text-base font-semibold">
              Clear Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;
