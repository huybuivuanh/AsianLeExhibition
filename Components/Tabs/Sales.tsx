import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { formattedDate } from '../../DataManagement/DataManager';
import { TimeFormat } from '../../types/enum';

const Sales = () => {
  const dailySales = useSelector(
    (state: RootState) => state.sales.dailySales as Sales[],
  );
  const monthlySales = useSelector(
    (state: RootState) => state.sales.monthlySales as Sales[],
  );
  const totalSales = useSelector(
    (state: RootState) => state.sales.totalSales as Sales,
  );

  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSaleId(prev => (prev === id ? null : id));
  };
  return (
    <View className="flex-1 p-5">
      <FlatList
        data={dailySales}
        keyExtractor={(sale, index) => sale.id || index.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-2">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => toggleExpand(item.id || '')}
            >
              <Text className="text-base font-bold">
                Date: {formattedDate(item.created, TimeFormat.OnlyDate)}
              </Text>
            </TouchableOpacity>

            {expandedSaleId === item.id && <Text>Total: {item.total}</Text>}
          </View>
        )}
      />
      <FlatList
        data={monthlySales}
        keyExtractor={(sale, index) => sale.id || index.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-2">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => toggleExpand(item.id || '')}
            >
              <Text className="text-base font-bold">
                Date: {formattedDate(item.created, TimeFormat.OnlyMonth)}
              </Text>
            </TouchableOpacity>

            {expandedSaleId === item.id && <Text>Total: {item.total}</Text>}
          </View>
        )}
      />
      <View>
        <Text>Total: ${totalSales.total}</Text>
      </View>
    </View>
  );
};

export default Sales;
