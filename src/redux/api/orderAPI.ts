import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({ url: "new", method: "POST", body: order }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),
    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    myOrders: builder.query<
      AllOrdersResponse,
      { orderId?: string; page?: number; limit?: number; id: string }
    >({
      query: ({ orderId, page = 1, limit = 10, id }) => {
        let url = `my/?id=${id}&page=${page}&limit=${limit}`;
        if (orderId) {
          url += `&orderId=${orderId}`;
        }
        return url;
      },
      providesTags: ["Orders"],
    }),
    allOrders: builder.query<
      AllOrdersResponse,
      { orderId?: string; page?: number; limit?: number; id: string }
    >({
      query: ({ orderId, page = 1, limit = 10, id }) => {
        let url = `all/?id=${id}&page=${page}&limit=${limit}`;
        if (orderId) {
          url += `&orderId=${orderId}`;
        }
        return url;
      },
      providesTags: ["Orders"], // Add this
    }),

    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => id,
      providesTags: ["Orders"],
    }),
  }),
});
