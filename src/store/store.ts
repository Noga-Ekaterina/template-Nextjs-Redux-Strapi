import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./slices/ui";
import { createWrapper } from "next-redux-wrapper";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import type { Persistor } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
  [uiSlice.name]: uiSlice.reducer,
});

const persistConfig = {
  key: "redux",
  storage,
  // whitelist: [cardSlice.name],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    // для Redux Query
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: {
    //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //     },
    //   }).concat(exampleApi.middleware),
  });

export const wrapper = createWrapper(makeStore);
export const initializePersistor = (store: AppStore): Persistor => persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
