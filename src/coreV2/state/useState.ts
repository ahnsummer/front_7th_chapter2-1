import { assert, cloneDeep, isNil, isNotNil } from "es-toolkit";
import { currentRenderingNode, render, renderTree } from "../../main";
import { CompnentElementNode, DomNode, ElementNode } from "@core/jsx/factory";

export const stateMap = new Map<string, any>();

function cloneClassInstance<T>(instance: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instance)),
    instance,
  );
}

function searchCurrentNode(
  key: string,
  targetNode: ElementNode = renderTree!,
): CompnentElementNode | null {
  if (targetNode instanceof CompnentElementNode && key === targetNode.key)
    return targetNode;

  for (const child of targetNode.children) {
    if (child instanceof ElementNode) {
      const found = searchCurrentNode(key, child);
      if (isNotNil(found)) return found;
    }
  }

  return null;
}

export function useState<T>(
  initialValue: T,
): [T, (valueOrDispatcher: T | ((value: T) => T)) => void] {
  if (!(currentRenderingNode instanceof CompnentElementNode)) {
    throw new Error("currentRenderingNode is not an object");
  }

  if (
    isNil(currentRenderingNode.state) ||
    isNil(currentRenderingNode.stateCursor)
  ) {
    throw new Error("parentNode.state or parentNode.stateCursor is not set");
  }

  const { key, state, stateCursor } = currentRenderingNode;

  state[stateCursor] = state[stateCursor] ?? initialValue;
  currentRenderingNode.stateCursor++;

  function setValue(valueOrDispatcher: T | ((value: T) => T)) {
    if (typeof valueOrDispatcher === "function") {
      const dispatcher = valueOrDispatcher as (value: T) => T;
      state[stateCursor] = dispatcher(state[stateCursor]);
    } else {
      const value = valueOrDispatcher as T;
      state[stateCursor] = value;
    }

    const parentNode = searchCurrentNode(key);

    assert(isNotNil(parentNode), "parentNode is not found");

    render(parentNode, parentNode.parent);
  }

  return [state[stateCursor], setValue];
}
