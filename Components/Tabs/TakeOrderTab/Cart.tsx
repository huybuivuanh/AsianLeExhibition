import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../../../Redux/OrderSlice';
import { RootState } from '../../../Redux/store';

const Cart = () => {
  const dispatch = useDispatch();
  const currentOrderItems = useSelector(
    (state: RootState) => state.order.items,
  );
  const total = useSelector((state: RootState) => state.order.total);

  return (
    <View className="flex-1 p-5">
      {currentOrderItems.length === 0 ? (
        <Text className="text-gray-500">Your cart is empty.</Text>
      ) : (
        <FlatList
          data={currentOrderItems}
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

      <Button title={`Submit - Total: $${total}`} onPress={() => {}} />
    </View>
  );
};

export default Cart;
