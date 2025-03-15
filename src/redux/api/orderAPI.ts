import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";

// Extended type for order queries
export interface OrderQueryParams {
  id: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  minTotal?: string;
  maxTotal?: string;
  sortBy?: string;
  sortOrder?: string;
  pinCode?: string;
}

// Enhanced URL builder with all supported parameters
const buildOrdersUrl = (endpoint: "my" | "all", params: OrderQueryParams) => {
  const { id, page = 1, limit = 10, ...filters } = params;
  const searchParams = new URLSearchParams({
    id,
    page: String(page),
    limit: String(limit),
  });

  // Add optional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return `${endpoint}?${searchParams.toString()}`;
};

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["ORDERS", "ORDER_DETAILS"],
  endpoints: (builder) => ({
    // Create a new order
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    // Update an existing order
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId, ...orderData }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDERS", id: "LIST" },
        { type: "ORDERS", id: "ADMIN_LIST" },
        { type: "ORDERS", id: orderId },
        { type: "ORDER_DETAILS", id: orderId },
      ],
    }),

    // Delete an order
    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDERS", id: "LIST" },
        { type: "ORDERS", id: "ADMIN_LIST" },
        { type: "ORDERS", id: orderId },
        { type: "ORDER_DETAILS", id: orderId },
      ],
    }),

    // Get user's orders with pagination and filtering
    myOrders: builder.query<AllOrdersResponse, OrderQueryParams>({
      query: (params) => buildOrdersUrl("my", params),
      // Keep data fresh with intelligent tag invalidation
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "ORDERS" as const,
                id: _id,
              })),
              { type: "ORDERS", id: "LIST" },
            ]
          : [{ type: "ORDERS", id: "LIST" }],
      // Optional: transform response if needed
      transformResponse: (response: AllOrdersResponse) => response,
    }),

    // Get all orders (admin only) with pagination and filtering
    allOrders: builder.query<AllOrdersResponse, OrderQueryParams>({
      query: (params) => buildOrdersUrl("all", params),
      // Keep data fresh with intelligent tag invalidation
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "ORDERS" as const,
                id: _id,
              })),
              { type: "ORDERS", id: "ADMIN_LIST" },
            ]
          : [{ type: "ORDERS", id: "ADMIN_LIST" }],
      // Optional: transform response if needed
      transformResponse: (response: AllOrdersResponse) => response,
    }),

    // Get single order details
    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => `${id}`,
      providesTags: (_result, _error, id) => [{ type: "ORDER_DETAILS", id }],
    }),

    // Order analytics endpoint
    orderAnalytics: builder.query<any, { id: string; period: string }>({
      query: ({ id, period }) => `analytics?id=${id}&period=${period}`,
      providesTags: ["ORDERS"],
      // Cache for a shorter duration since analytics may update frequently
      keepUnusedDataFor: 300, // 5 minutes in seconds
    }),
  }),
});

// Export hooks for use in components
export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
  useOrderAnalyticsQuery,
} = orderApi;
