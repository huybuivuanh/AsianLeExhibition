import { createSlice } from '@reduxjs/toolkit';

export const orderHistorySlice = createSlice({
  name: 'liveOrders',
  initialState: {
    orders: [],
  },
  reducers: {
    setOrderHistory: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrderHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
