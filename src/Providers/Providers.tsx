import React from 'react';
import { Provider } from 'react-redux';
import { Store } from '../Redux/Store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { MenuDataProvider } from './MenuDataProvider';
import { LiveOrderDataProvider } from './LiveOrderDataProvider';
import { OrderHistoryDataProvider } from './OrderHistoryDataProvider';
import { SalesDataProvider } from './SalesDataProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={Store}>
    <GestureHandlerRootView>
      <NavigationContainer>
        <MenuDataProvider>
          <LiveOrderDataProvider>
            <OrderHistoryDataProvider>
              <SalesDataProvider>{children}</SalesDataProvider>
            </OrderHistoryDataProvider>
          </LiveOrderDataProvider>
        </MenuDataProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  </Provider>
);
