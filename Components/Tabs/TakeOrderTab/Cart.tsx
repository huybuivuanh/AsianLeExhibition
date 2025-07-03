import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem } from '../../../Redux/OrderSlice';
import { RootState } from '../../../Redux/store';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.order.items);
  const total = useSelector((state: RootState) => state.order.total);

  return (
    <View className="flex-1 p-5">
      return (
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.name} - ${item.price}
            </Text>
            <Button
              title="X"
              onPress={() => item.id && dispatch(removeItem(item.id))}
            />
          </View>
        )}
        ListFooterComponent={<Text>Total: ${total}</Text>}
      />
      );
    </View>
  );
};

export default Cart;
