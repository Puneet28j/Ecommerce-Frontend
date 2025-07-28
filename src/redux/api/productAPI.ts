import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductResponse,
  SearchProductsQuery,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["Product"],
  keepUnusedDataFor: 600, // Keep unused data for 10 minutes
  refetchOnMountOrArgChange: 30, // Refetch only if 30 seconds have passed
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["Product"],
    }),
    featured: builder.query<AllProductsResponse, string>({
      query: () => "featured",
      providesTags: ["Product"],
    }),
    bestSelling: builder.query<AllProductsResponse, string>({
      query: () => "bestselling",
      providesTags: ["Product"],
    }),
    budget: builder.query<AllProductsResponse, string>({
      query: () => "budget",
      providesTags: ["Product"],
    }),
    // latestProducts: builder.query<AllProductsResponse, string>({
    //   query: () => "latest",
    //   providesTags: ["Product"],
    // }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["Product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["Product"],
    }),
    searchProducts: builder.query<SearchProductsResponse, SearchProductsQuery>({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?page=${page}`;

        if (search) base += `&search=${search}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["Product"],
    }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => `${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
      // Cache configuration for this specific endpoint
      keepUnusedDataFor: 600, // 10 minutes
      extraOptions: { maxRetries: 2 }, // Optional
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});
