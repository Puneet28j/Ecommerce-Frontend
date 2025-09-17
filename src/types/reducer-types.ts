import { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
  token: string | null; // ✅ allow null when logged out
}

export interface CartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  coupon: string | undefined;
}
