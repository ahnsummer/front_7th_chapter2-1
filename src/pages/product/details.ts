import { component, html } from "../../core/component";
import { ProductDetail } from "../../domains/product/components/ProductDetail";

export const ProductDetailsPage = component(() => {
  return html`${ProductDetail()}`;
});
