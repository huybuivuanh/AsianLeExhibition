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
    <View className="flex-1 p-4 bg-white">
      {/* Daily Sales */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Daily Sales
        </Text>
        <FlatList
          data={dailySales}
          keyExtractor={(sale, index) => sale.id || index.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 rounded-xl mb-3 p-4 shadow-sm">
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() => toggleExpand(item.id || '')}
              >
                <Text className="text-base font-semibold text-gray-700">
                  {formattedDate(item.created, TimeFormat.OnlyDate)}
                </Text>
                <Text className="text-blue-600 text-sm">
                  {expandedSaleId === item.id ? 'Hide' : 'View'}
                </Text>
              </TouchableOpacity>

              {expandedSaleId === item.id && (
                <View className="mt-2">
                  <Text className="text-gray-600">Total: ${item.total}</Text>
                </View>
              )}
            </View>
          )}
        />
      </View>

      {/* Monthly Sales */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Monthly Sales
        </Text>
        <FlatList
          data={monthlySales}
          keyExtractor={(sale, index) => sale.id || index.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 rounded-xl mb-3 p-4 shadow-sm">
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() => toggleExpand(item.id || '')}
              >
                <Text className="text-base font-semibold text-gray-700">
                  {formattedDate(item.created, TimeFormat.OnlyMonth)}
                </Text>
                <Text className="text-blue-600 text-sm">
                  {expandedSaleId === item.id ? 'Hide' : 'View'}
                </Text>
              </TouchableOpacity>

              {expandedSaleId === item.id && (
                <View className="mt-2">
                  <Text className="text-gray-600">Total: ${item.total}</Text>
                </View>
              )}
            </View>
          )}
        />
      </View>

      {/* Total Sales */}
      <View className="bg-green-100 rounded-xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Total Sales
        </Text>
        <Text className="text-lg text-green-700 font-semibold">
          Total: ${totalSales.total}
        </Text>
      </View>
    </View>
  );
};

export default Sales;
