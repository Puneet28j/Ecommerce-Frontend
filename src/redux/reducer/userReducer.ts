import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: true,
};
export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to localStorage
    },

    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
      localStorage.removeItem("user"); // Remove user from localStorage
    },
  },
});

export const { userExist, userNotExist } = userReducer.actions;
