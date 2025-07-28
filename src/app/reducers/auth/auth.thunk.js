import {createAsyncThunk} from '@reduxjs/toolkit';
import {APIS} from '../../../api/apiSheet';
import {getRequest, postRequest} from '../../../api/apiService';

export const SIGNUP_USER = createAsyncThunk(
  'auth/signUpUser',
  async (payload, {rejectWithValue}) => {
    try {
      const RESPONSE = await postRequest(APIS, payload);
      return RESPONSE.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  },
);

export const GET_PROFILE = createAsyncThunk(
  'user/getProfile',
  async (_, {rejectWithValue}) => {
    console.log('GET_PROFILE<><><');

    try {
      const RESPONSE = await getRequest(APIS.REGISTER);
      console.log('RESPONSE<><><', RESPONSE);
      return RESPONSE.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);
