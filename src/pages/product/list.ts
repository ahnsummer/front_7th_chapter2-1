import { getProducts } from "../../api/productApi";
import { component, html } from "../../core/component";
import { useEffect } from "../../core/state/useEffect";
import { useState } from "../../core/state/useState";
import { ProductFilter } from "../../domains/product/components/ProductList/ProductFilter";
import { ProductList } from "../../domains/product/components/ProductList/ProductList";
import { Product } from "../../types";

export const ProductListPage = component(() => {
  const $products = useState<Product[]>([]);
  const $isLoading = useState(true);
  const $itemsPerPage = useState(20);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProducts({
          page: 1,
          limit: $itemsPerPage.get(),
          sort: "price_asc",
        });

        $products.set(response.products);
        $isLoading.set(false);
      } catch (error) {
        console.log("상품 로딩 실패: ", error);
        $isLoading.set(false);
      }
    })();
  }, [$itemsPerPage]);

  return html`
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 검색 및 필터 -->
      ${ProductFilter({ $itemsPerPage })}
      <!-- 상품 목록 -->
      ${ProductList({ $products, $isLoading, $itemsPerPage })}
    </main>
  `;
});
