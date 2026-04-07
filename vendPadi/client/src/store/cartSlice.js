import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      const payload = action.payload;
      const existing = state.items.find(i => i._id === payload._id);
      
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          _id: payload._id,
          name: payload.name,
          price: payload.price,
          description: payload.description || '',
          images: payload.images || [],
          qty: 1
        });
      }
    },
    addItemWithQty: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const existing = state.items.find(i => i._id === product._id);
      
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          description: product.description || '',
          images: product.images || [],
          qty: qty
        });
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
    clearCart: (state) => {
      state.items = [];
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
  clearCart 
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
export const selectCartCount = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.qty, 0);

export default cartSlice.reducer;
