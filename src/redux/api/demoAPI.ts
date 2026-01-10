import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllOrdersRequest,
  AllOrdersResponse,
  AllProductsResponse,
  BarResponse,
  LineResponse,
  MessageResponse,
  PieResponse,
  StatsResponse,
} from "../../types/api-types";

// Demo API slice that mirrors the real API structure but points to /demo/ endpoints
export const demoAPI = createApi({
  reducerPath: "demoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/demo/`,
  }),
  tagTypes: ["Demo", "Orders"],
  endpoints: (builder) => ({
    // Read Endpoints
    demoStats: builder.query<StatsResponse, void>({
      query: () => "stats",
    }),
    demoProducts: builder.query<AllProductsResponse, void>({
      query: () => "products",
    }),
    demoProductDetails: builder.query<any, string>({
      query: (id) => `products/${id}`,
    }),
    demoOrders: builder.query<AllOrdersResponse, AllOrdersRequest>({
      query: ({ page, limit, search, sort, status }) => {
        let qs = `orders?page=${page}`;
        if (limit) qs += `&limit=${limit}`;
        if (search) qs += `&search=${search}`;
        if (sort) qs += `&sort=${sort}`;
        if (status) qs += `&status=${status}`;
        return qs;
      },
    }),
    demoPie: builder.query<PieResponse, void>({
      query: () => "pie",
    }),
    demoBar: builder.query<BarResponse, void>({
      query: () => "bar",
    }),
    demoLine: builder.query<LineResponse, void>({
      query: () => "line",
    }),

    // Simulated Mutation Endpoints (Always succeed)
    demoNewProduct: builder.mutation<MessageResponse, any>({
      query: () => ({
        url: "product/new",
        method: "POST",
      }),
    }),
    demoUpdateProduct: builder.mutation<MessageResponse, any>({
      query: () => ({
        url: "product/update",
        method: "PUT",
      }),
    }),
    demoDeleteProduct: builder.mutation<MessageResponse, any>({
      query: () => ({
        url: "product/delete",
        method: "DELETE",
      }),
    }),
    demoDeleteOrder: builder.mutation<MessageResponse, any>({
      query: () => ({
        url: "order/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], // Added invalidatesTags for demoDeleteOrder
    }),
    demoUpdateOrder: builder.mutation<MessageResponse, any>({
      query: () => ({
        url: "order/update",
        method: "PUT",
      }),
      invalidatesTags: ["Orders"], // Added invalidatesTags for demoUpdateOrder
    }),
    
    // Get single demo order details
    demoOrderDetails: builder.query<any, string>({
      query: (id) => `orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),
  }),
});

export const {
  useDemoStatsQuery,
  useDemoProductsQuery,
  useDemoProductDetailsQuery,
  useDemoOrdersQuery,
  useDemoOrderDetailsQuery,
  useDemoPieQuery,
  useDemoBarQuery,
  useDemoLineQuery,
  useDemoNewProductMutation,
  useDemoUpdateProductMutation,
  useDemoDeleteProductMutation,
  useDemoDeleteOrderMutation,
  useDemoUpdateOrderMutation,
} = demoAPI;
