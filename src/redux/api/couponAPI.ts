// couponApi (unchanged)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Coupon {
  _id: string;
  coupon: string;
  amount: number;
}

// API Response types
export interface CouponResponse {
  success: boolean;
  coupons: Coupon[];
}

export interface CreateCouponResponse {
  success: boolean;
  message: string;
}

// Request types
export interface CreateCouponRequest {
  coupon: string;
  amount: number;
  id?: string;
}

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    getCoupons: builder.query<CouponResponse, string>({
      query: (id) => ({
        url: "coupon/all",
        method: "GET",
        params: { id },
      }),
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation<CreateCouponResponse, CreateCouponRequest>({
      query: ({ coupon, amount, id }) => ({
        url: "coupon/new",
        method: "POST",
        params: { id },
        body: { coupon, amount },
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});
