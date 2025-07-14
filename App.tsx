import './global.css';
import 'react-native-reanimated'; // ensure this is at the top
import 'react-native-gesture-handler';
import React from 'react';

import { AppProviders } from './src/Providers/Providers';
import { StackNavigator } from './src/Navigation/StackNavigator';

const App = () => (
  <AppProviders>
    <StackNavigator />
  </AppProviders>
);

export default App;
