import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  resendLoading: false,
  error: null,
  screenOneData: null,
};

export const homeSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setScreenOneData: (state, action) => {
      state.screenOneData = action.payload;
    },
  },
});

export const {setScreenOneData} = homeSlice.actions;
export default homeSlice.reducer; // Export only the reducer
