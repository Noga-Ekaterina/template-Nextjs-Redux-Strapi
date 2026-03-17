import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const initialState = {
  isMenuOpen: false,
  isCardOpen: false,
  isCardClickOutside: true
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleCard(state) {
      state.isCardOpen = !state.isCardOpen;
    },
    setCardClickOutside(state, action) {
      state.isCardClickOutside = action.payload;
    }
  }
});


export const uiActions = uiSlice.actions;
export const useUiState = () => useSelector((state: RootState) => state.ui);