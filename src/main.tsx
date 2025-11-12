import { DomNode, ElementNode } from "@core/jsx/factory";
import { render } from "@core/render";
import { useState } from "@core/state/useState";
import { shuffle } from "es-toolkit";

export let renderTree: ElementNode | null = null;

export let currentRenderingNode: DomNode = null;

const Hello = () => {
  return <div>world</div>;
};

function Items(props: { items: number[] }) {
  return (
    <>
      {props.items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </>
  );
}

function Test() {
  const [count, setCount] = useState(0);

  const [arr, setArr] = useState<number[]>([1, 2, 3]);

  return (
    <>
      <div>안녕 {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      <br />
      <Items items={arr} />
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
