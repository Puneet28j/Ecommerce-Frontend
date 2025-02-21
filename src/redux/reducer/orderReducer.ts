import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface pageProp {
  page: number;
}
const initialState: pageProp = {
  page: 1,
};

export const orderReducer = createSlice({
  name: "orderReducer",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<pageProp>) => {
      state.page = action.payload.page;
    },
  },
});

export const { setPage } = orderReducer.actions;
