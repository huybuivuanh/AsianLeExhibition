import { configureStore } from '@reduxjs/toolkit';
import OrderReducer from './OrderSlice';
import MenuReducer from './MenuSlice';
import LiveOrdersReducer from './LiveOrderSlice';
import OrderHistoryReducer from './OrderHistorySlice';
import SalesReducer from './SalesSlice';

export const Store = configureStore({
  reducer: {
    menu: MenuReducer,
    order: OrderReducer,
    liveOrders: LiveOrdersReducer,
    orderHistory: OrderHistoryReducer,
    sales: SalesReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
