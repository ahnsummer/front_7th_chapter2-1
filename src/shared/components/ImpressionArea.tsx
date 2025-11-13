import { useEffect } from "@core/state/useEffect";
import { delay, isNil } from "es-toolkit";
import { nextTick } from "../utils/nextTick";

type ImpressionAreaProps = {
  rootMargin?: string;
  threshold?: number;
  debounceTime?: number;
  onImpression: () => void;
};

export function ImpressionArea({
  rootMargin = "0px",
  threshold = 0.5,
  debounceTime = 500,
  onImpression,
}: ImpressionAreaProps) {
  useEffect(() => {
    let triggered = false;
    const root = document.querySelector("#root");

    if (isNil(root)) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            onImpression();

            intersectionObserver.disconnect();

            delay(debounceTime).then(() => {
              triggered = false;
              intersectionObserver.observe(entry.target);
            });
          }
        });
      },
      {
        rootMargin,
        threshold,
      },
    );

    intersectionObserver.observe(
      document.querySelector("#impression-area") as HTMLElement,
    );

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.id === "impression-area") {
            intersectionObserver.disconnect();

            delay(1).then(() => {
              intersectionObserver.observe(node);
            });
          }
        });
      });
    });

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return <div id="impression-area"></div>;
}
