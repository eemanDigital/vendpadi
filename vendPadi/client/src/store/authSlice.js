import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorAPI } from '../api/axiosInstance';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await vendorAPI.getMe();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Session expired' });
    }
  }
);

const initialState = {
  vendor: null,
  token: localStorage.getItem('vendpadi_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('vendpadi_token')),
  loading: Boolean(localStorage.getItem('vendpadi_token'))
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('vendpadi_token', action.payload.token);
    },
    updateVendor: (state, action) => {
      state.vendor = { ...state.vendor, ...action.payload };
    },
    logout: (state) => {
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('vendpadi_token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.vendor = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.vendor = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem('vendpadi_token');
      });
  }
});

export const { setCredentials, updateVendor, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
