import { DomNode, ElementNode } from "@core/jsx/factory";
import { render } from "@core/render";
import { createRouter } from "@core/router";
import { useEffect } from "@core/state/useEffect";
import { useMemo } from "@core/state/useMemo";
import { useState } from "@core/state/useState";
import { shuffle } from "es-toolkit";

function Test() {
  const router = useRouter<"home">();
  const [arr, setArr] = useState<number[]>([1, 2, 3]);
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  useEffect(() => {
    console.log("arr", arr);

    return () => {
      console.log("unmount");
      console.log("arr", arr);
      console.log("---");
    };
  }, [arr]);

  useEffect(() => {
    console.log("count", count);
  }, [count]);

  useEffect(() => {
    console.log("doubled", doubled);
  }, [doubled]);

  return (
    <div>
      <button
        onClick={() =>
          router.push("about", {
            pathParams: { name: "John" },
            queryParams: { greet: "Hello" },
          })
        }
      >
        Go to about
      </button>
      <div>--------------------------------</div>
      <div>Test arr: {arr.join(", ")}</div>
      <button onClick={() => setArr(shuffle(arr))}>shuffle</button>
      <div>--------------------------------</div>
      <div>Test count: {count}</div>
      <div>Test doubled: {doubled}</div>
      <button onClick={() => setCount(count + 1)}>plus</button>
    </div>
  );
}

const { Router, useRouter } = createRouter({
  home: {
    path: "/",
    component: () => <Test />,
  },
  about: {
    path: "/about/:name",
    component: (props: {
      pathParams: { name: string };
      queryParams: { greet: string };
    }) => (
      <div>
        About {props.pathParams.name} {props.queryParams.greet}
      </div>
    ),
  },
});

function main() {
  render(
    <>
      <Router
        fallback={{ notFound: <div>Not Found</div>, error: <div>Error</div> }}
      />
    </>,
  );
}

const enableMocking = () =>
  import("./mocks/browser").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
