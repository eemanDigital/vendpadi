import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../api/axiosInstance';

const getOrCreateCustomerId = () => {
  let customerId = localStorage.getItem('vendpadi_customer_id');
  if (!customerId) {
    customerId = 'cust_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('vendpadi_customer_id', customerId);
  }
  return customerId;
};

const loadWishlistFromStorage = (slug) => {
  try {
    const saved = localStorage.getItem(`vendpadi_wishlist_${slug}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const syncWishlistWithServer = createAsyncThunk(
  'wishlist/syncWithServer',
  async ({ phone, storeSlug, items }, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.sync(phone, storeSlug, items);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync wishlist');
    }
  }
);

export const fetchWishlistFromServer = createAsyncThunk(
  'wishlist/fetchFromServer',
  async ({ phone, storeSlug }, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.get(phone, storeSlug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isOpen: false,
    customerId: null,
    storeSlug: null,
    phone: null,
    isSynced: false,
    syncLoading: false,
    syncError: null
  },
  reducers: {
    initWishlist: (state, action) => {
      const storeSlug = action.payload;
      state.storeSlug = storeSlug;
      state.customerId = getOrCreateCustomerId();
      state.items = loadWishlistFromStorage(storeSlug);
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item._id === product._id);
      if (!exists) {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          category: product.category,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem(`vendpadi_wishlist_${state.storeSlug}`, JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      localStorage.setItem(`vendpadi_wishlist_${state.storeSlug}`, JSON.stringify(state.items));
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item._id === product._id);
      if (exists) {
        state.items = state.items.filter(item => item._id !== product._id);
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          category: product.category,
          addedAt: new Date().toISOString()
        });
      }
      localStorage.setItem(`vendpadi_wishlist_${state.storeSlug}`, JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      if (state.storeSlug) {
        localStorage.removeItem(`vendpadi_wishlist_${state.storeSlug}`);
      }
    },
    setWishlistOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setServerItems: (state, action) => {
      state.items = action.payload.map(item => ({
        _id: item.productId?._id || item.productId,
        name: item.name,
        price: item.price,
        images: item.images,
        category: item.category,
        addedAt: item.addedAt
      }));
      state.isSynced = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncWishlistWithServer.pending, (state) => {
        state.syncLoading = true;
        state.syncError = null;
      })
      .addCase(syncWishlistWithServer.fulfilled, (state, action) => {
        state.syncLoading = false;
        state.isSynced = true;
        state.items = action.payload.items.map(item => ({
          _id: item.productId?._id || item.productId,
          name: item.name,
          price: item.price,
          images: item.images,
          category: item.category,
          addedAt: item.addedAt
        }));
      })
      .addCase(syncWishlistWithServer.rejected, (state, action) => {
        state.syncLoading = false;
        state.syncError = action.payload;
      })
      .addCase(fetchWishlistFromServer.pending, (state) => {
        state.syncLoading = true;
        state.syncError = null;
      })
      .addCase(fetchWishlistFromServer.fulfilled, (state, action) => {
        state.syncLoading = false;
        state.isSynced = true;
        state.items = action.payload.items.map(item => ({
          _id: item.productId?._id || item.productId,
          name: item.name,
          price: item.price,
          images: item.images,
          category: item.category,
          addedAt: item.addedAt
        }));
      })
      .addCase(fetchWishlistFromServer.rejected, (state, action) => {
        state.syncLoading = false;
        state.syncError = action.payload;
      });
  }
});

export const { 
  initWishlist,
  setPhone,
  addToWishlist, 
  removeFromWishlist, 
  toggleWishlist, 
  clearWishlist,
  setWishlistOpen,
  setServerItems
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item._id === productId);
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsWishlistOpen = (state) => state.wishlist.isOpen;
export const selectCustomerId = (state) => state.wishlist.customerId;
export const selectPhone = (state) => state.wishlist.phone;
export const selectIsSynced = (state) => state.wishlist.isSynced;
export const selectSyncLoading = (state) => state.wishlist.syncLoading;
export const selectSyncError = (state) => state.wishlist.syncError;

export default wishlistSlice.reducer;
