import {
  CompnentElementNode,
  DomElementNode,
  DomNode,
  ElementNode,
  FragmentNode,
} from "@core/jsx/factory";
import { useState } from "@core/state/useState";
import { isNil, kebabCase, lowerCase, omit, shuffle } from "es-toolkit";

export let renderTree: ElementNode | null = null;

export let currentRenderingNode: DomNode = null;

const Hello = () => {
  return <div>world</div>;
};

function Test() {
  const [count, setCount] = useState(0);

  const [arr, setArr] = useState<number[]>([1, 2, 3]);

  console.log("arr", arr);

  return (
    <>
      <div>안녕 {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      <br />
      {arr.map((item) => (
        <div key={item}>{item}</div>
      ))}
      <button onClick={() => setArr((prev) => shuffle(prev))}>Shuffle</button>
    </>
  );
}

render(
  <>
    <div>
      <h1>Hello, World!</h1>
      <p>asbcdc</p>
      <Hello />
      <Test />
    </div>
  </>,
);

export function render(
  jsx: DomNode | DomNode[],
  parent: HTMLElement | DocumentFragment = root(),
  onAppend: (nodes: HTMLElement[]) => void = (nodes) =>
    nodes.forEach((node) => parent.appendChild(node)),
): void {
  if (Array.isArray(jsx)) {
    jsx.forEach((child) => render(child, parent, onAppend));
    return;
  }

  if (isNil(renderTree)) {
    renderTree = jsx as ElementNode;
  }

  if (typeof jsx === "boolean" || jsx == null) {
    return;
  }

  if (!(jsx instanceof ElementNode)) {
    const text = document.createTextNode(String(jsx));
    parent.appendChild(text);
    return;
  }

  if (jsx instanceof CompnentElementNode) {
    currentRenderingNode = jsx;
    jsx.parent = parent;
    jsx.state = jsx.state ?? [];
    jsx.stateCursor = 0;
    render(jsx.tag(jsx.props, ...jsx.children), parent, (nodes) => {
      if (isNil(jsx.nodes)) {
        nodes.forEach((node) => parent.appendChild(node));
        jsx.nodes = nodes;
        return;
      }

      if (jsx.nodes.length > nodes.length) {
        const deletedNodes = jsx.nodes.filter((node) => !nodes.includes(node));
        deletedNodes.forEach((node) => node.remove());
        jsx.nodes = nodes;
        return;
      }

      jsx.nodes.forEach((node, idx) => {
        parent.replaceChild(nodes[idx], node);
      });

      jsx.nodes = nodes;
    });
    return;
  }

  if (jsx instanceof FragmentNode) {
    const nodes: HTMLElement[] = [];
    const element = document.createDocumentFragment();
    for (const child of jsx.children) {
      render(child, element, (nodesToAppend) => {
        nodesToAppend.forEach((node) => element.appendChild(node));
        nodes.push(...nodesToAppend);
      });
    }

    parent.appendChild(element);
    onAppend(nodes);
    return;
  }

  if (!(jsx instanceof DomElementNode)) {
    throw new Error("jsx is not a DomElementNode");
  }

  const element = document.createElement(jsx.tag);
  for (const [key, value] of Object.entries(jsx.props ?? {}).filter(
    (key) => !String(key).startsWith("__"),
  )) {
    if (key === "key") {
      jsx.key = value;
      continue;
    }

    if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(
        lowerCase(key.replace("on", "")),
        value as EventListener,
      );
      continue;
    }
    element.setAttribute(kebabCase(key), value as string);
  }
  for (const child of jsx.children) {
    const renderedChild = render(child, element);
    if (renderedChild == null) continue;
  }

  onAppend([element]);
}

(window as any).renderTree = renderTree;

function root(): HTMLElement {
  return document.querySelector("#root") as HTMLElement;
}
