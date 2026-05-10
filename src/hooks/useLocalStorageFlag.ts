import { useEffect, useRef } from "react";

export const useLocalStorageFlag = (key: string, onFirstSeen: () => void) => {
  const callbackRef = useRef(onFirstSeen);

  useEffect(() => {
    callbackRef.current = onFirstSeen;
  }, [onFirstSeen]);

  useEffect(() => {
    try {
      if (!localStorage.getItem(key)) {
        callbackRef.current();
      }
    } catch {
      // Ignore storage errors (private mode, blocked storage).
    }
  }, [key]);
};
