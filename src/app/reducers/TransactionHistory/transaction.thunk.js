// redux/transaction/transaction.thunk.js
import { getRequest, postRequest } from '@api/apiService';
import { APIS } from '@api/apiSheet';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const saveTransactionData = createAsyncThunk(
  'transaction/saveTransactionData',
  async (paymentIntentData, { rejectWithValue }) => {
    try {
      console.log('Sending to API:', paymentIntentData);

      const response = await postRequest(APIS.SAVE_PAYMENT_DATA, {
        data: paymentIntentData,
      });

      console.log('API response:', response);

      if (response?.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to save transaction data');
      }
    } catch (error) {
      console.error('Transaction thunk error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
