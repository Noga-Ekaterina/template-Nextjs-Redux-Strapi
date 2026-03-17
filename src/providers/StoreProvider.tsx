"use client";

import { Provider } from "react-redux";
import { useMemo } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { initializePersistor, makeStore } from "@/store/store";

type StoreProviderProps = {
  children: React.ReactNode;
};

export default function StoreProvider({ children }: StoreProviderProps) {
  const store = useMemo(() => makeStore(), []);
  const persistor = useMemo(() => initializePersistor(store), [store]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
