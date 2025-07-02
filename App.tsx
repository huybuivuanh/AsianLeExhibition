import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import TakeOrder from './Components/Tabs/TakeOrder';
import Menu from './Components/Tabs/Menu';
import OrderHistory from './Components/Tabs/OrderHistory';
import Sales from './Components/Tabs/Sales';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Take Order"
          screenOptions={() => ({
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Take Order" component={TakeOrder} />
          <Tab.Screen name="Menu" component={Menu} />
          <Tab.Screen name="Order History" component={OrderHistory} />
          <Tab.Screen name="Sales" component={Sales} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
