import { createRouter } from "@core/router";
import { ProductListPage } from "./product/list";
import { ProductDetailPage } from "./product/detail";

export const { Router, useRouter } = createRouter({
  상품목록: {
    path: "/",
    component: ProductListPage,
  },
  상품상세: {
    path: "/product/:id",
    component: ProductDetailPage,
  },
});
