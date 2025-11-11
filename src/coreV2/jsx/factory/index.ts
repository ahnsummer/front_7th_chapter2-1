import { nanoid } from "nanoid";

export type DomNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      tag: string | typeof Fragment | ((...args: any[]) => DomNode);
      props?: any;
      children: DomNode[];
      state?: Array<any>;
      stateCursor?: number;
      parent?: HTMLElement | DocumentFragment;
    };

export class ElementNode {
  constructor(
    public tag: unknown,
    public children: DomNode[],
  ) {}
}

export class FragmentNode extends ElementNode {
  constructor(
    public tag: "Fragment",
    public children: DomNode[],
  ) {
    super("Fragment", children);
  }
}

export class DomElementNode extends ElementNode {
  constructor(
    public tag: string,
    public props: { [key: string]: unknown },
    public children: DomNode[],
    public key?: any,
  ) {
    super(tag, children);
  }
}
export class CompnentElementNode extends ElementNode {
  constructor(
    public key: string,
    public tag: (...args: any[]) => DomNode,
    public props: { [key: string]: unknown },
    public children: DomNode[],
    public state?: Array<any>,
    public stateCursor?: number,
    public parent?: HTMLElement | DocumentFragment,
    public nodes?: HTMLElement[],
  ) {
    super(tag, children);
  }
}

export function h(
  tag: string | ((...args: any[]) => DomNode),
  props: { [key: string]: unknown },
  ...children: DomNode[]
): DomNode {
  if (typeof tag === "function" && tag.name === "Fragment") {
    return Fragment(props, ...children);
  }

  if (typeof tag === "function") {
    return new CompnentElementNode(nanoid(), tag, props, children);
  }

  return new DomElementNode(tag, props, children);
}

export function Fragment(_: {}, ...children: DomNode[]): DomNode {
  return new FragmentNode("Fragment", children);
}
