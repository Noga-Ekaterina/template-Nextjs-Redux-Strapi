import { useCallback, useEffect, useRef } from "react";

type DebouncedFn = (...args: unknown[]) => void;

export const useDebouncedCallback = <T extends DebouncedFn>(
  callback: T,
  delay: number
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [cancel, delay]
  );

  useEffect(() => cancel, [cancel]);

  return { debounced, cancel };
};
