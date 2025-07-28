// redux/transaction/transaction.slice.js
import { createSlice } from '@reduxjs/toolkit';
import { saveTransactionData } from './transaction.thunk';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearTransactionData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTransactionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTransactionData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveTransactionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionData } = transactionSlice.actions;

export default transactionSlice.reducer;
