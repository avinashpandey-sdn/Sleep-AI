import axios from 'axios';
import {API_BASE_URL} from './baseUrl';
import {store} from '../app/store';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach token and set Content-Type
api.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth?.userLoginData?.token;
    console.log('API SAVED TOKEN::> ', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Set Content-Type based on config metadata
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error),
);

export default api;
