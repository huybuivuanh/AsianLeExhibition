import { createSlice } from '@reduxjs/toolkit';

export const currentOrdersSlice = createSlice({
  name: 'currentOrders',
  initialState: {
    orders: [],
  },
  reducers: {
    setCurrentOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setCurrentOrders } = currentOrdersSlice.actions;
export default currentOrdersSlice.reducer;
