import React, { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { deleteMenuItem } from '../../../DataManagement/DataManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Navigation/RootStackParamList';
import { useMenu } from '../../../Redux/hooks';
import { showAlert } from '../../../Notification/Alert';
import { AlertType } from '../../../types/enum';

type Props = NativeStackScreenProps<RootStackParamList>;

const Menu = ({ navigation }: Props) => {
  const menuItems = useMenu().items as MenuItem[];
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteMenuItem = async (id: string | undefined) => {
    if (!id) {
      showAlert(AlertType.Error, 'Invalid menu item ID');
      return;
    }
    setLoading(true);
    try {
      await deleteMenuItem(id);
      showAlert(AlertType.Success, 'Menu item deleted successfully');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      showAlert(AlertType.Error, 'Failed to delete menu item');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 p-4 bg-white gap-2">
      <TouchableOpacity
        className="bg-orange-600 py-4 rounded-xl items-center"
        onPress={() => navigation.navigate('AddMenuItem')}
        disabled={loading}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? 'Loading...' : 'Add Menu Item'}
        </Text>
      </TouchableOpacity>

      <TextInput
        className="border border-gray-300 rounded-xl p-4 mb-4"
        placeholder="Search menu items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredMenuItems}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-medium text-gray-800">
                {item.name} - $
                {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
              </Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="bg-yellow-500 px-3 py-1 rounded-full"
                  onPress={() =>
                    navigation.navigate('EditMenuItem', {
                      item: item,
                    })
                  }
                >
                  <Text className="text-white font-semibold">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded-full"
                  onPress={() => handleDeleteMenuItem(item.id)}
                >
                  <Text className="text-white font-semibold">X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        refreshing={loading}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-500">Menu is empty.</Text>
          </View>
        }
      />
    </View>
  );
};

export default Menu;
