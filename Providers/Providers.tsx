import React from 'react';
import { Provider } from 'react-redux';
import { Store } from '../Redux/Store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { MenuDataProvider } from './MenuDataProvider';
import { CurrentOrderDataProvider } from './CurrentOrderDataProvider';
import { OrderHistoryDataProvider } from './OrderHistoryDataProvider';
import { SalesDataProvider } from './SalesDataProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={Store}>
    <GestureHandlerRootView>
      <NavigationContainer>
        <MenuDataProvider>
          <CurrentOrderDataProvider>
            <OrderHistoryDataProvider>
              <SalesDataProvider>{children}</SalesDataProvider>
            </OrderHistoryDataProvider>
          </CurrentOrderDataProvider>
        </MenuDataProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  </Provider>
);
