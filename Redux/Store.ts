import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './OrderSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
