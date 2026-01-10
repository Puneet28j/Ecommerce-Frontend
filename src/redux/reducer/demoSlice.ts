import { createSlice } from "@reduxjs/toolkit";

// Check if demo mode was previously active in this session
const initialDemoState = sessionStorage.getItem("demoMode") === "true";

export interface DemoState {
  isDemoMode: boolean;
}

const initialState: DemoState = {
  isDemoMode: initialDemoState,
};

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    enterDemoMode: (state) => {
      state.isDemoMode = true;
      sessionStorage.setItem("demoMode", "true");
    },
    exitDemoMode: (state) => {
      state.isDemoMode = false;
      sessionStorage.removeItem("demoMode");
    },
  },
});

export const { enterDemoMode, exitDemoMode } = demoSlice.actions;
export const demoReducer = demoSlice;
