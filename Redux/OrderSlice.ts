import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: OrderState = {
  items: [],
  total: 0,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload);
      if (typeof action.payload.price === 'number') {
        state.total += action.payload.price;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        const itemToRemove = state.items[index];
        if (itemToRemove && typeof itemToRemove.price === 'number') {
          state.total -= itemToRemove.price;
        }
        state.items.splice(index, 1);
      }
    },
    clearOrder: state => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
