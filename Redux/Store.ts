import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './OrderSlice';
import menuReducer from './MenuSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    order: orderReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
