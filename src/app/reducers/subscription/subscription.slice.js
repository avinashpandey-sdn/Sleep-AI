// src/redux/slices/subscriptionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  selectedPlanIndex: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setSelectedPlanIndex: (state, action) => {
      state.selectedPlanIndex = action.payload;
    },
    clearPlans: (state) => {
      state.plans = [];
      state.selectedPlanIndex = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlans,
  setSelectedPlanIndex,
  clearPlans,
  setLoading,
  setError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
