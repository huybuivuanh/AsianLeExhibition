import { configureStore } from '@reduxjs/toolkit';
import OrderReducer from './OrderSlice';
import MenuReducer from './MenuSlice';
import CurrentOrdersReducer from './CurrentOrderSlice';
import OrderHistoryReducer from './OrderHistorySlice';

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    order: OrderReducer,
    currentOrders: CurrentOrdersReducer,
    orderHistory: OrderHistoryReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
