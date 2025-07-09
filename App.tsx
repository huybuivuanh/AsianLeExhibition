import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TakeOrder from './Components/Tabs/TakeOrderTab/TakeOrder';
import Cart from './Components/Tabs/TakeOrderTab/Cart';
import CurrentOrders from './Components/Tabs/CurrentOrders';
import Menu from './Components/Tabs/Menu';
import OrderHistory from './Components/Tabs/OrderHistory';
import Sales from './Components/Tabs/Sales';
import { AppProviders } from './Providers/Providers';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  </AppProviders>
);

export default App;
