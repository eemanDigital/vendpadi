import { createSlice } from '@reduxjs/toolkit';

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

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isOpen: false,
    customerId: null,
    storeSlug: null
  },
  reducers: {
    initWishlist: (state, action) => {
      const storeSlug = action.payload;
      state.storeSlug = storeSlug;
      state.customerId = getOrCreateCustomerId();
      state.items = loadWishlistFromStorage(storeSlug);
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
    }
  }
});

export const { 
  initWishlist,
  addToWishlist, 
  removeFromWishlist, 
  toggleWishlist, 
  clearWishlist,
  setWishlistOpen 
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item._id === productId);
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsWishlistOpen = (state) => state.wishlist.isOpen;
export const selectCustomerId = (state) => state.wishlist.customerId;

export default wishlistSlice.reducer;
