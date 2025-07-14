import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';
import Toast from 'react-native-toast-message';

import { AppProviders } from './src/Providers/Providers';
import { StackNavigator } from './src/Navigation/StackNavigator';

const App = () => (
  <AppProviders>
    <StackNavigator />
    <Toast />
  </AppProviders>
);

export default App;
