import React, { useEffect } from 'react';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { Provider } from 'react-redux';
import { Store } from '../Redux/Store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { MenuDataProvider } from './MenuDataProvider';
import { LiveOrderDataProvider } from './LiveOrderDataProvider';
import { OrderHistoryDataProvider } from './OrderHistoryDataProvider';
import { SalesDataProvider } from './SalesDataProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    async function loginAnon() {
      try {
        const authInstance = getAuth();
        const userCredential = await signInAnonymously(authInstance);
        console.log('Signed in anonymously:', userCredential.user.uid);
      } catch (error) {
        console.error('Anonymous sign-in error:', error);
      }
    }

    loginAnon();
  }, []);
  return (
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
};
