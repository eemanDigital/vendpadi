import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], deliveryInfo: null },
  reducers: {
    addItem: (state, action) => {
      const payload = action.payload;
      const isBundleItem = payload.isBundle === true;
      const itemId = isBundleItem ? `bundle-${payload._id}` : payload._id;
      const existing = state.items.find(i => i._id === itemId);
      
      if (existing) {
        existing.qty += 1;
      } else {
        const newItem = {
          _id: itemId,
          name: payload.name,
          price: payload.price,
          description: payload.description || '',
          images: payload.images || [],
          qty: 1
        };
        if (isBundleItem) {
          newItem.isBundle = true;
          newItem.bundleId = payload.bundleId;
          newItem.bundleProducts = payload.bundleProducts;
          newItem.originalPrice = payload.originalPrice;
          newItem.discountPercentage = payload.discountPercentage;
        }
        state.items.push(newItem);
      }
    },
    addItemWithQty: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const isBundleItem = product.isBundle === true;
      const itemId = isBundleItem ? `bundle-${product._id}` : product._id;
      const existing = state.items.find(i => i._id === itemId);
      
      if (existing) {
        existing.qty += qty;
      } else {
        const newItem = {
          _id: itemId,
          name: product.name,
          price: product.price,
          description: product.description || '',
          images: product.images || [],
          qty: qty
        };
        if (isBundleItem) {
          newItem.isBundle = true;
          newItem.bundleId = product.bundleId;
          newItem.bundleProducts = product.bundleProducts;
          newItem.originalPrice = product.originalPrice;
          newItem.discountPercentage = product.discountPercentage;
        }
        state.items.push(newItem);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    incrementQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item) {
        item.qty += 1;
      }
    },
    decrementQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.items = state.items.filter(i => i._id !== action.payload);
        }
      }
    },
    setQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(i => i._id !== id);
        } else {
          item.qty = qty;
        }
      }
    },
    setDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.deliveryInfo = null;
    }
  }
});

export const { 
  addItem, 
  addItemWithQty,
  removeItem, 
  incrementQty, 
  decrementQty, 
  setQty,
  setDeliveryInfo,
  clearCart 
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
export const selectCartCount = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.qty, 0);
export const selectDeliveryInfo = (state) => state.cart.deliveryInfo;

export default cartSlice.reducer;
