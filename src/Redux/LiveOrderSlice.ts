import { createSlice } from '@reduxjs/toolkit';

export const liveOrdersSlice = createSlice({
  name: 'liveOrders',
  initialState: {
    orders: [],
  },
  reducers: {
    setLiveOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setLiveOrders } = liveOrdersSlice.actions;
export default liveOrdersSlice.reducer;
