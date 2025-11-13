import { DomNode } from "@core/jsx/factory";
import { useEffect } from "@core/state/useEffect";
import { useState } from "@core/state/useState";
import { nanoid } from "nanoid";

export function OverlayContainer() {
  const [overlays, setOverlays] = useState<
    Array<{ id: string; Controller: (props: { close: () => void }) => DomNode }>
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "overlay",
      (
        event: CustomEvent<{
          id: string;
          Controller: (props: { close: () => void }) => DomNode;
        }>,
      ) => {
        setOverlays((prev) => [...prev, event.detail]);
      },
    );

    window.addEventListener("overlay:close", (event: CustomEvent<string>) => {
      setOverlays((prev) =>
        prev.filter((overlay) => overlay.id !== event.detail),
      );
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOverlays([]);
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  if (overlays.length === 0) return null;

  return (
    <>
      <div
        className="fixed w-screen h-screen top-0 left-0 bg-black/50"
        style={{ zIndex: "98" }}
        onClick={(e) => {
          const target = e.target as unknown as HTMLElement;
          const currentTarget = e.currentTarget as HTMLElement;
          if (target !== currentTarget) return;

          e.preventDefault();
          e.stopPropagation();
          setOverlays([]);
        }}
      >
        {overlays.map(({ id, Controller }) => (
          <div
            key={`overlay-${id}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Controller
              close={() =>
                setOverlays((prev) =>
                  prev.filter((overlay) => overlay.id !== overlay.id),
                )
              }
            />
          </div>
        ))}
      </div>
    </>
  );
}

export function openOverlay(
  Controller: (props: { close: () => void }) => DomNode,
) {
  const id = nanoid();

  window.dispatchEvent(
    new CustomEvent("overlay", {
      detail: { id, Controller },
    }),
  );
}
