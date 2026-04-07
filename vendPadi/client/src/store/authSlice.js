import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendor: null,
  token: localStorage.getItem('vendpadi_token') || null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('vendpadi_token', action.payload.token);
    },
    updateVendor: (state, action) => {
      state.vendor = { ...state.vendor, ...action.payload };
    },
    logout: (state) => {
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('vendpadi_token');
    }
  }
});

export const { setCredentials, updateVendor, logout } = authSlice.actions;
export default authSlice.reducer;
