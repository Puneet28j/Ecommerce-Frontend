import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import type { User } from "../../types/types";
import axios from "axios";
import { auth } from "../../firebase"; // ✅ import firebase auth instance

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
    prepareHeaders: async (headers) => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // ✅ always get a fresh token before sending request
          const token = await currentUser.getIdToken(/* forceRefresh */ true);
          headers.set("authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
      }
      return headers;
    },
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

// ✅ getUser now also uses fresh token
export const getUser = async (id: string) => {
  try {
    const token = await auth.currentUser?.getIdToken(true);
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
