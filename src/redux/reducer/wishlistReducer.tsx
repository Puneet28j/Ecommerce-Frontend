// wishlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  ids: string[];
}

const initialState: WishlistState = {
  ids: JSON.parse(localStorage.getItem("wishlistIds") || "[]"), // persist
};

export const wishlistReducer = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
      localStorage.setItem("wishlistIds", JSON.stringify(state.ids));
    },
    toggleWishlistId: (state, action: PayloadAction<string>) => {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
      localStorage.setItem("wishlistIds", JSON.stringify(state.ids));
    },
    clearWishlist: (state) => {
      state.ids = [];
      localStorage.removeItem("wishlistIds");
    },
  },
});

export const { setWishlist, toggleWishlistId, clearWishlist } =
  wishlistReducer.actions;
