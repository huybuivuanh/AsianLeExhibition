import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailySales: [],
  monthlySales: [],
  totalSales: { total: 0, id: '', created: '' }, // adjust type to match your Sales type
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setDailySales: (state, action) => {
      state.dailySales = action.payload;
    },
    setMonthlySales: (state, action) => {
      state.monthlySales = action.payload;
    },
    setTotalSales: (state, action) => {
      state.totalSales = action.payload;
    },
  },
});

export const { setDailySales, setMonthlySales, setTotalSales } =
  salesSlice.actions;

export default salesSlice.reducer;
