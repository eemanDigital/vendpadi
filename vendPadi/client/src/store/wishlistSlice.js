import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem('vendpadi_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(),
    isOpen: false
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item._id === product._id);
      if (!exists) {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          category: product.category
        });
        localStorage.setItem('vendpadi_wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      localStorage.setItem('vendpadi_wishlist', JSON.stringify(state.items));
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
          category: product.category
        });
      }
      localStorage.setItem('vendpadi_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('vendpadi_wishlist');
    },
    setWishlistOpen: (state, action) => {
      state.isOpen = action.payload;
    }
  }
});

export const { 
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

export default wishlistSlice.reducer;
