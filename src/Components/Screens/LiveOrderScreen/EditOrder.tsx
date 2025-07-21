import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  addItem,
  removeItem,
  setOrder,
  clearOrder,
} from '../../../Redux/OrderSlice';
import { updateOrder } from '../../../DataManagement/DataManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Navigation/RootStackParamList';
import { AlertType, RouteName } from '../../../types/enum';
import { useOrder } from '../../../Redux/hooks';
import { showAlert } from '../../../Notification/Alert';

type Props = NativeStackScreenProps<RootStackParamList, RouteName.EditOrder>;

const EditOrder = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const { order } = route.params;
  useEffect(() => {
    if (order) {
      dispatch(setOrder(order));
    }
  }, [order, dispatch]); // run only when 'order' changes
  const orderToEdit = useOrder() as Order;

  useEffect(() => {
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch]);

  return (
    <View className="flex-1 p-4 bg-white">
      <TouchableOpacity
        className="bg-green-500 items-center px-3 py-1 rounded-full"
        onPress={() => {
          navigation.navigate(RouteName.AddItemToOrder);
        }}
      >
        <Text className="text-white text-lg font-semibold">Add Item</Text>
      </TouchableOpacity>
      <FlatList
        data={orderToEdit.orderItems}
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

      {orderToEdit.orderItems.length > 0 && (
        <View className="mt-4">
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-xl items-center mb-3"
            onPress={() => {
              try {
                updateOrder(orderToEdit);
                dispatch(clearOrder());
                showAlert(AlertType.Success, 'Order Updated');
              } catch (error) {
                showAlert(AlertType.Error, 'Failed To Edit Order');
              }
              navigation.goBack();
            }}
          >
            <Text className="text-white text-base font-semibold">
              Submit Changes - ${orderToEdit.total.toFixed(2)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-xl items-center"
            onPress={() => {
              dispatch(clearOrder());
              navigation.goBack();
            }}
          >
            <Text className="text-white text-base font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EditOrder;
