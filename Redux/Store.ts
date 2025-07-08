import { configureStore } from '@reduxjs/toolkit';
import OrderReducer from './OrderSlice';
import MenuReducer from './MenuSlice';
import CurrentOrdersReducer from './CurrentOrderSlice';

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    order: OrderReducer,
    currentOrders: CurrentOrdersReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
