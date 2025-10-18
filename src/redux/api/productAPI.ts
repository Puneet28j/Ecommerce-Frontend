import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/firebase";
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
  WishlistResponse,
  WishlistToggleResponse,
} from "../../types/api-types";
import { onAuthStateChanged } from "firebase/auth";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    prepareHeaders: async (headers) => {
      let currentUser = auth.currentUser;

      // If currentUser is null, wait until Firebase Auth finishes initializing
      if (!currentUser) {
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            currentUser = user;
            unsubscribe();
            resolve();
          });
        });
      }

      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Product", "Wishlist"], // ✅ Add Wishlist tag
  keepUnusedDataFor: 600,
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, void>({
      query: () => "latest",
      providesTags: ["Product"],
    }),
    featured: builder.query<AllProductsResponse, void>({
      query: () => "featured",
      providesTags: ["Product"],
    }),
    bestSelling: builder.query<AllProductsResponse, void>({
      query: () => "bestselling",
      providesTags: ["Product"],
    }),
    budget: builder.query<AllProductsResponse, void>({
      query: () => "budget",
      providesTags: ["Product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["Product"],
    }),
    categories: builder.query<CategoriesResponse, void>({
      query: () => `categories`,
      providesTags: ["Product"],
    }),
    searchProducts: builder.query<SearchProductsResponse, SearchProductsQuery>({
      query: ({ search, sort, category, minPrice, maxPrice, page }) => {
        const params = new URLSearchParams();

        // Pagination
        params.append("page", String(page || 1));

        // Filters
        if (search) params.append("search", search.trim());
        if (category && category !== "all") params.append("category", category);
        if (sort && sort !== "default") params.append("sort", sort);
        if (minPrice) params.append("minPrice", String(minPrice));
        if (maxPrice) params.append("maxPrice", String(maxPrice));

        // Build URL
        return `all?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    productDetails: builder.query<ProductResponse, string>({
      query: (id) => `${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
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
    wishlistToggle: builder.mutation<
      WishlistToggleResponse,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `wishlist/${productId}/toggle`,
        method: "POST",
      }),
      // ✅ Invalidate Wishlist tag to refetch wishlist data
      invalidatesTags: ["Wishlist"],
    }),
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => `wishlist`,
      // ✅ Provide Wishlist tag instead of Product
      providesTags: ["Wishlist"],
    }),
  }),
});
