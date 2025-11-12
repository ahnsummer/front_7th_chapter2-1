import { CompnentElementNode } from "@core/jsx/factory";
import { currentRenderingNode } from "@core/render";
import { cloneDeep, isEqual, isNil } from "es-toolkit";

export const sideEffectMap = new Map<string, () => void | Promise<void>>();

export function useMemo<T>(callback: () => T, dependencies: any[]): T {
  if (!(currentRenderingNode instanceof CompnentElementNode)) {
    throw new Error("currentRenderingNode is not an object");
  }

  if (
    isNil(currentRenderingNode.state) ||
    isNil(currentRenderingNode.stateCursor)
  ) {
    throw new Error("parentNode.state or parentNode.stateCursor is not set");
  }

  if (
    isNil(currentRenderingNode.sideEffects) ||
    isNil(currentRenderingNode.sideEffectsCursor)
  ) {
    throw new Error(
      "parentNode.sideEffects or parentNode.sideEffectsCursor is not set",
    );
  }

  const { state, stateCursor, sideEffects, sideEffectsCursor } =
    currentRenderingNode;

  state[stateCursor] = state[stateCursor] ?? callback();
  currentRenderingNode.stateCursor++;
  const targetSideEffect = sideEffects[sideEffectsCursor];
  currentRenderingNode.sideEffectsCursor++;

  if (isNil(targetSideEffect)) {
    const returnValue = callback();

    state[stateCursor] = returnValue;
    sideEffects[sideEffectsCursor] = {
      callback: callback as any,
      dependencies: cloneDeep(dependencies),
    };
    return returnValue;
  }

  const hasChanged = !isEqual(targetSideEffect.dependencies, dependencies);

  if (hasChanged) {
    const returnValue = callback();
    state[stateCursor] = returnValue;
    targetSideEffect.dependencies = cloneDeep(dependencies);

    return returnValue;
  }

  return state[stateCursor];
}
