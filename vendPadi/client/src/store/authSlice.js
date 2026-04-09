import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorAPI } from '../api/axiosInstance';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const adminToken = localStorage.getItem('vendpadi_admin_token');
    
    if (adminToken) {
      return { isAdmin: true };
    }
    
    try {
      const { data } = await vendorAPI.getMe();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Session expired' });
    }
  }
);

const adminToken = localStorage.getItem('vendpadi_admin_token');
const vendorToken = localStorage.getItem('vendpadi_token');

const initialState = {
  vendor: null,
  token: vendorToken || adminToken || null,
  isAuthenticated: Boolean(vendorToken || adminToken),
  isAdmin: Boolean(adminToken),
  loading: Boolean(vendorToken || adminToken)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.vendor?.isAdmin || false;
      state.loading = false;
      
      if (action.payload.vendor?.isAdmin) {
        localStorage.setItem('vendpadi_admin_token', action.payload.token);
      } else {
        localStorage.setItem('vendpadi_token', action.payload.token);
      }
    },
    updateVendor: (state, action) => {
      state.vendor = { ...state.vendor, ...action.payload };
    },
    logout: (state) => {
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.loading = false;
      localStorage.removeItem('vendpadi_token');
      localStorage.removeItem('vendpadi_admin_token');
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
        state.isAdmin = action.payload?.isAdmin || state.isAdmin;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.vendor = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.loading = false;
        localStorage.removeItem('vendpadi_token');
        localStorage.removeItem('vendpadi_admin_token');
      });
  }
});

export const { setCredentials, updateVendor, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
