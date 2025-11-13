import { DomNode } from "@core/jsx/factory";
import { useEffect } from "@core/state/useEffect";
import { useState } from "@core/state/useState";
import { delay } from "es-toolkit";
import { nanoid } from "nanoid";

type ToastProps = {
  variant: "success" | "info" | "error";
  title: DomNode;
  onDestroy: () => void;
};

export function Toast({ variant, title, onDestroy }: ToastProps) {
  useEffect(() => {
    delay(3000).then(() => {
      onDestroy();
    });
  }, []);

  const color = (() => {
    switch (variant) {
      case "success":
        return "bg-green-600";
      case "info":
        return "bg-blue-600";
      case "error":
        return "bg-red-600";
    }
  })();

  const icon = (() => {
    switch (variant) {
      case "success":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
    }
  })();

  return (
    <div
      className={`${color} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm pointer-events-auto`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <button
        id="toast-close-btn"
        className="flex-shrink-0 ml-2 text-white hover:text-gray-200"
        onClick={onDestroy}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<
    Array<Omit<ToastProps, "onDestroy"> & { id: string }>
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "toast",
      (event: CustomEvent<Omit<ToastProps, "onDestroy">>) => {
        const { variant, title } = event.detail;
        setToasts((prev) => [...prev, { id: nanoid(), variant, title }]);
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      className="fixed w-screen p-2 flex flex-col gap-2 items-end justify-center mx-auto pointer-events-none"
      style={{ zIndex: "99" }}
    >
      {toasts.map((toast) => (
        <Toast
          {...toast}
          onDestroy={() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
        />
      ))}
    </div>
  );
}

export function showToast(variant: ToastProps["variant"], title: DomNode) {
  window.dispatchEvent(
    new CustomEvent("toast", {
      detail: { variant, title },
    }),
  );
}
