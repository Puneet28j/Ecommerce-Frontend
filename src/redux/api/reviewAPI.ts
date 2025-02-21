import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../types/types";
// import { useSelector } from "react-redux";
// import { UserReducerInitialState } from "../../types/reducer-types";

export interface Review {
  _id: string; // Optional for creation
  user: {
    name: string;
    email: string;
    photo: string;
    _id: string;
  };
  product: Product;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  _id?: string; // Optional for creation
  productId?: string;
  userId?: string;
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
  }),
  tagTypes: ["Reviews", "Product"],
  endpoints: (builder) => ({
    // Update an existing review
    updateReview: builder.mutation({
      query: ({ productId, rating, comment, userId }) => ({
        url: "update",
        method: "PUT",
        body: { productId, rating, comment, userId },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, rating, comment, userId },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic Update: Update the cache before the server response
        const patchResult = dispatch(
          reviewAPI.util.updateQueryData(
            "getReviews",
            { productId },
            (draft) => {
              const reviewIndex = draft.reviews.findIndex(
                (review) => review.user._id === userId
              );
              if (reviewIndex !== -1) {
                // Update the existing review
                draft.reviews[reviewIndex].rating = rating;
                draft.reviews[reviewIndex].comment = comment || "";
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Roll back if the server request fails
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
      // Merge function for better pagination handling
      serializeQueryArgs: ({ queryArgs }) => {
        // Use productId as cache key to enable pagination
        return { productId: queryArgs.productId };
      },
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
      // Force refetch only when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    // Delete Review Endpoint
    deleteReview: builder.mutation({
      query: ({ productId, userId }) => ({
        url: `delete`,
        method: "DELETE",
        body: { productId, userId },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, userId },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic Update: Remove the review from the cache
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
          patchResult.undo(); // Roll back if the server request fails
        }
      },
    }),

    // Add Review Endpoint
    createReview: builder.mutation({
      query: ({ productId, userId, rating, comment }) => ({
        url: `new`,
        method: "POST",
        body: { productId, userId, rating, comment },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
      ],
      async onQueryStarted(
        { productId, userId, rating, comment },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic Update: Add the new review to the cache
        const patchResult = dispatch(
          reviewAPI.util.updateQueryData(
            "getReviews",
            { productId },
            (draft) => {
              draft.reviews.unshift({
                _id: "temp-id", // Temporary ID for optimistic update
                user: {
                  _id: userId,
                  name: "user?.name!",
                  email: "user?.email!",
                  photo: "user?.photo!",
                }, // Adjust user details as needed
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
          patchResult.undo(); // Roll back if the server request fails
        }
      },
    }),
  }),
});
