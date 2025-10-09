// ============================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  ids: string[];
}

const initialState: WishlistState = {
  ids: [], // ✅ Start empty - will be populated from backend on login
};

export const wishlistReducer = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
      // ❌ Removed localStorage - backend is source of truth
    },
    toggleWishlistId: (state, action: PayloadAction<string>) => {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
      // ❌ Removed localStorage
    },
    clearWishlist: (state) => {
      state.ids = [];
      // ✅ Clean state on logout
    },
  },
});

export const { setWishlist, toggleWishlistId, clearWishlist } =
  wishlistReducer.actions;
