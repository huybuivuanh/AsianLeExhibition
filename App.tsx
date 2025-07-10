import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TakeOrder from './Components/Tabs/TakeOrderTab/TakeOrder';
import Cart from './Components/Tabs/TakeOrderTab/Cart';
import CurrentOrders from './Components/Tabs/CurrentOrders';
import Menu from './Components/Tabs/MenuTab/Menu';
import AddMenuItem from './Components/Tabs/MenuTab/AddMenuItem';
import EditMenuItem from './Components/Tabs/MenuTab/EditMenuItem';
import OrderHistory from './Components/Tabs/OrderHistory';
import Sales from './Components/Tabs/Sales';
import { AppProviders } from './Providers/Providers';
import { RootStackParamList } from './Navigation/RootStackParamList';
import { RouteName } from './types/enum';

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
      <Stack.Screen name={RouteName.AddMenuItem} component={AddMenuItem} />
      <Stack.Screen name={RouteName.EditMenuItem} component={EditMenuItem} />
    </Stack.Navigator>
  </AppProviders>
);

export default App;
