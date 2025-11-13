import { sum } from "es-toolkit";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { Cart } from "../types";
import { useMemo } from "@core/state/useMemo";
import { CartModal } from "./CartModal";
import { openOverlay } from "../../../shared/components/Overlay";

export function CartButton() {
  const [cart] = useLocalStorage<Cart[]>("shopping_cart", []);
  const totalQuantity = useMemo(
    () => sum(cart.map((item) => item.quantity)),
    [cart],
  );

  return (
    <button
      id="cart-icon-btn"
      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      onClick={() => {
        openOverlay(({ close }) => <CartModal onClose={close} />);
      }}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
        ></path>
      </svg>
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </button>
  );
}
