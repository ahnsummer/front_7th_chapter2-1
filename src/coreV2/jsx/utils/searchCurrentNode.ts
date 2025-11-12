import { isNotNil } from "es-toolkit";
import { CompnentElementNode, ElementNode } from "../factory";
import { renderTree } from "@core/render";

export function searchCurrentNode(
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

    if (child instanceof CompnentElementNode) {
      for (const nestedComponent of child.nestedComponenets ?? []) {
        const found = searchCurrentNode(key, nestedComponent);
        if (isNotNil(found)) return found;
      }
    }
  }

  return null;
}

(window as any).searchCurrentNode = searchCurrentNode;
