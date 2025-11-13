import { cloneDeep } from "es-toolkit";
import { DomNode } from "@core/jsx/factory";
import { rawRenderTree, render, renderTree } from "@core/render";

export const stateMap = new Map<string, any>();

export function useGlobalState<T>(
  key: string,
  initialValue: T,
): [T, (valueOrDispatcher: T | ((value: T) => T)) => void] {
  const state = stateMap.get(key) ?? initialValue;

  function setValue(valueOrDispatcher: T | ((value: T) => T)) {
    if (typeof valueOrDispatcher === "function") {
      const dispatcher = valueOrDispatcher as (value: T) => T;
      stateMap.set(key, dispatcher(cloneDeep(state)));
    } else {
      const value = valueOrDispatcher as T;
      stateMap.set(key, value);
    }

    queueMicrotask(() => {
      render(cloneDeep(rawRenderTree) as DomNode);
    });
  }

  return [state, setValue];
}
