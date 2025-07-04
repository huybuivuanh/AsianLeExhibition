import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialOrder: Order = {
  items: [],
  total: 0,
  numberOfItems: 0,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrder,
  reducers: {
    addItem: (state, action: PayloadAction<MenuItem>) => {
      // Check if the item already exists in the order
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id,
      );
      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // If the item doesn't exist, add it to the order
        state.items.push({
          ...action.payload,
          price: action.payload.price ?? 0,
          quantity: 1,
        });
      }
      state.total += action.payload.price || 0;
      state.numberOfItems += 1;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      // Find the item to remove by its ID
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        const itemToRemove = state.items[index];
        // If the item has a quantity greater than 1, just decrease the quantity
        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
          if (typeof itemToRemove.price === 'number') {
            state.total -= itemToRemove.price;
          }
        } else {
          if (itemToRemove && typeof itemToRemove.price === 'number') {
            state.total -= itemToRemove.price;
          }
          state.items.splice(index, 1);
        }
        state.numberOfItems -= 1;
      }
    },
    clearOrder: state => {
      state.items = [];
      state.total = 0;
      state.numberOfItems = 0;
    },
  },
});

export const { addItem, removeItem, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
