import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TakeOrder from '../Components/Screens/TakeOrderScreen/TakeOrder';
import LiveOrders from '../Components/Screens/LiveOrderScreen/LiveOrders';
import Menu from '../Components/Screens/MenuScreen/Menu';
import OrderHistory from '../Components/Screens/OrderHistory';
import Sales from '../Components/Screens/Sales';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Take Order"
    screenOptions={{
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Take Order" component={TakeOrder} />
    <Tab.Screen name="Current Orders" component={LiveOrders} />
    <Tab.Screen name="Menu" component={Menu} />
    <Tab.Screen name="Order History" component={OrderHistory} />
    <Tab.Screen name="Sales" component={Sales} />
  </Tab.Navigator>
);
