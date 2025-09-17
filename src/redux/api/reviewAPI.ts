import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../types/types";
import type { RootState } from "../../redux/store";

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photo: string;
  };
  product: Product;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewRequest {
  _id?: string;
  productId?: string;
  rating?: number;
  comment?: string;
  page?: number;
  limit?: number;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  review: Review;
}

export interface UpdateReviewResponse {
  success: boolean;
  message: string;
  review: Review;
}

export interface GetReviewsResponse {
  success: boolean;
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  };
}

export const reviewAPI = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/review/`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.userReducer.token || localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Reviews", "Product"],
  endpoints: (builder) => ({
    updateReview: builder.mutation<
      UpdateReviewResponse,
      { productId: string; rating: number; comment?: string; userId?: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: "update",
        method: "PUT",
        body: { productId, rating, comment },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, rating, comment, userId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          reviewAPI.util.updateQueryData(
            "getReviews",
            { productId },
            (draft) => {
              const reviewIndex = draft.reviews.findIndex(
                (review) => review.user._id === userId
              );
              if (reviewIndex !== -1) {
                draft.reviews[reviewIndex].rating = rating;
                draft.reviews[reviewIndex].comment = comment || "";
                draft.reviews[reviewIndex].updatedAt = new Date().toISOString();
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getReviews: builder.query<GetReviewsResponse, ReviewRequest>({
      query: ({ productId, page = 1, limit = 5 }) => ({
        url: `get`,
        params: { productId, page, limit },
      }),
      providesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      // Use productId as cache key for pagination
      serializeQueryArgs: ({ queryArgs }) => ({
        productId: queryArgs.productId,
      }),
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          reviews: [
            ...currentCache.reviews,
            ...newItems.reviews.filter(
              (newReview) =>
                !currentCache.reviews.some(
                  (existingReview) => existingReview._id === newReview._id
                )
            ),
          ],
        };
      },
      // Refetch when the page number changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    deleteReview: builder.mutation<any, { productId: string; userId: string }>({
      query: ({ productId }) => ({
        url: `delete`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, userId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          reviewAPI.util.updateQueryData(
            "getReviews",
            { productId },
            (draft) => {
              draft.reviews = draft.reviews.filter(
                (review) => review.user._id !== userId
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    createReview: builder.mutation<
      CreateReviewResponse,
      { productId: string; userId: string; rating: number; comment?: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: `new`,
        method: "POST",
        body: { productId, rating, comment },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, userId, rating, comment },
        { dispatch, getState, queryFulfilled }
      ) {
        // Retrieve user details from the global state for the optimistic update
        const state = getState() as RootState;
        const user = state.userReducer.user;
        const optimisticUser = {
          _id: userId,
          name: user?.name || "Anonymous", // Show actual name if available
          email: user?.email || "",
          photo: user?.photo || "",
        };

        const patchResult = dispatch(
          reviewAPI.util.updateQueryData(
            "getReviews",
            { productId },
            (draft) => {
              draft.reviews.unshift({
                _id: `temp-${new Date().getTime()}`, // Generate a unique temporary ID
                user: optimisticUser,
                product: { _id: productId } as Product,
                rating,
                comment: comment || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});
