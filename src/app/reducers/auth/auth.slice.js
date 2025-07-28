import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  showOnboarding: true,
  userLoginData: {},
  userLogId: '',
  firstTimeScreenToShow: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setWelcomeScreen: (state, action) => {
      state.showOnboarding = action.payload;
    },
    setUserLoginData: (state, action) => {
      state.userLoginData = action.payload;
    },
    setLoguserId: (state, action) => {
      state.userLogId = action.payload;
    },
    setFirstTimeScreenToShow: (state, action) => {
      state.firstTimeScreenToShow = action.payload;
    },
  },
});

export const {
  setUser,
  setWelcomeScreen,
  setUserLoginData,
  setLoguserId,
  setFirstTimeScreenToShow,
} = authSlice.actions;
export default authSlice.reducer;
