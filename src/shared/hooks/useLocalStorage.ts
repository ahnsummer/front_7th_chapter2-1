import { useEffect } from "@core/state/useEffect";
import { useGlobalState } from "@core/state/useGlobalState";
import { isNotNil } from "es-toolkit";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): ReturnType<typeof useGlobalState<T>> {
  const [state, setState] = useGlobalState<T>(
    key,
    localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) as string)
      : initialValue,
  );

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (isNotNil(item)) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (valueOrDispatcher: T | ((value: T) => T)) => {
    if (typeof valueOrDispatcher === "function") {
      const dispatcher = valueOrDispatcher as (value: T) => T;
      setState(dispatcher(state));
      return;
    }

    const value = valueOrDispatcher as T;
    setState(value);
  };

  return [state, setValue];
}
