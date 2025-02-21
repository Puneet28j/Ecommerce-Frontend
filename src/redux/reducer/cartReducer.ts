import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const loadCartItems = () => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
};
const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: loadCartItems(),
  subTotal: 0,
  coupon: undefined,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
  },
};
export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      state.loading = false;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Save to localStorage
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
      state.loading = false;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Save to localStorage
    },
    calculatePrice: (state) => {
      const subTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subTotal = subTotal;
      state.shippingCharges = state.subTotal > 1000 ? 0 : 50;
      state.tax = Math.round(state.subTotal * 0.18);
      state.total =
        state.subTotal + state.shippingCharges + state.tax - state.discount;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    discountapplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems"); // Clear from localStorage
    },

    saveCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload;
    },

    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountapplied,
  saveShippingInfo,
  resetCart,
  clearCart,
  saveCoupon,
} = cartReducer.actions;
