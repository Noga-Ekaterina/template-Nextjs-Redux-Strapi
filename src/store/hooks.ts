import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import type { AppStore } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { uiActions } from "./slices/ui";

const APPLICATION_ACTIONS = {
  ...uiActions
};

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(APPLICATION_ACTIONS, dispatch);
  }, [dispatch]);
};