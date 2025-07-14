import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from '../Navigation/TabNavigator';

import Cart from '../Components/Screens/TakeOrderScreen/Cart';
import AddMenuItem from '../Components/Screens/MenuScreen/AddMenuItem';
import EditMenuItem from '../Components/Screens/MenuScreen/EditMenuItem';

import { RootStackParamList } from '../Navigation/RootStackParamList';
import { RouteName } from '../types/enum';
import EditOrder from '../Components/Screens/CurrentOrderScreen/EditOrder';
import AddItemToOrder from '../Components/Screens/CurrentOrderScreen/AddItemToOrder';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={RouteName.Cart} component={Cart} />
      <Stack.Screen
        name={RouteName.AddMenuItem}
        component={AddMenuItem}
        options={{ title: 'Add Menu Item' }}
      />
      <Stack.Screen
        name={RouteName.EditMenuItem}
        component={EditMenuItem}
        options={{ title: 'Edit Menu Item' }}
      />
      <Stack.Screen name={RouteName.EditOrder} component={EditOrder} />
      <Stack.Screen
        name={RouteName.AddItemToOrder}
        component={AddItemToOrder}
        options={{ title: 'Add Item To Order' }}
      />
    </Stack.Navigator>
  );
};
