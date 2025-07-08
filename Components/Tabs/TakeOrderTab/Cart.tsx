import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
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
    <View className="flex-1 p-5">
      {order.orderItems.length === 0 ? (
        <Text className="text-gray-500">Cart is empty.</Text>
      ) : (
        <FlatList
          data={order.orderItems}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-base">
                {item.name} - ${item.price}
              </Text>
              <View className="flex-row items-center">
                <Button
                  title="-"
                  onPress={() => item.id && dispatch(removeItem(item.id))}
                />
                <Text>{item.quantity}</Text>
                <Button
                  title="+"
                  onPress={() => item.id && dispatch(addItem(item))}
                />
              </View>
            </View>
          )}
        />
      )}
      {order.orderItems.length > 0 && (
        <Button
          title={`Submit - Total: $${order.total}`}
          onPress={() => {
            submitCurrentOrder(order);
            dispatch(clearOrder());
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

export default Cart;
