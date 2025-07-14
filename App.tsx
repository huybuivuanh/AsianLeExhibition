import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TakeOrder from './src/Components/Screens/TakeOrderScreen/TakeOrder';
import Cart from './src/Components/Screens/TakeOrderScreen/Cart';
import CurrentOrders from './src/Components/Screens/CurrentOrderScreen/CurrentOrders';
import Menu from './src/Components/Screens/MenuScreen/Menu';
import AddMenuItem from './src/Components/Screens/MenuScreen/AddMenuItem';
import EditMenuItem from './src/Components/Screens/MenuScreen/EditMenuItem';
import OrderHistory from './src/Components/Screens/OrderHistory';
import Sales from './src/Components/Screens/Sales';
import { AppProviders } from './src/Providers/Providers';
import { RootStackParamList } from './src/Navigation/RootStackParamList';
import { RouteName } from './src/types/enum';
import EditOrder from './src/Components/Screens/CurrentOrderScreen/EditOrder';
import AddItemToOrder from './src/Components/Screens/CurrentOrderScreen/AddItemToOrder';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Take Order"
    screenOptions={{
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Take Order" component={TakeOrder} />
    <Tab.Screen name="Current Orders" component={CurrentOrders} />
    <Tab.Screen name="Menu" component={Menu} />
    <Tab.Screen name="Order History" component={OrderHistory} />
    <Tab.Screen name="Sales" component={Sales} />
  </Tab.Navigator>
);

const App = () => (
  <AppProviders>
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
  </AppProviders>
);

export default App;
