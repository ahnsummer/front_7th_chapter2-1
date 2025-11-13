import { cloneDeep, delay } from "es-toolkit";
import { DomNode } from "@core/jsx/factory";
import { rawRenderTree, render, renderTree } from "@core/render";

const stateMap = new Map<string, any>();

let enabled = true;

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
      if (!enabled) return;

      enabled = false;
      const root = document.querySelector("#root") as HTMLElement;

      [...(root.children ?? [])].forEach((child) => {
        child.remove();
      });
      render(cloneDeep(rawRenderTree) as DomNode);

      delay(500).then(() => (enabled = true));
    });
  }

  return [state, setValue];
}
