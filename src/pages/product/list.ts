import { getProducts } from "../../api/productApi";
import { component, html } from "../../core/component";
import { useEffect } from "../../core/state/useEffect";
import { useState } from "../../core/state/useState";
import { ProductFilter } from "../../domains/product/components/ProductList/ProductFilter";
import { ProductList } from "../../domains/product/components/ProductList/ProductList";
import { Product } from "../../types";
import { on } from "../../core/on";

export const ProductListPage = component(() => {
  const $products = useState<Product[]>([]);
  const $isLoading = useState(true);
  const $itemsPerPage = useState(20);
  const $error = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      $isLoading.set(true);
      $error.set(null);

      // throw new Error("테스트 에러입니다!");

      const response = await getProducts({
        page: 1,
        limit: $itemsPerPage.get(),
        sort: "price_asc",
      });

      $products.set(response.products);
      $isLoading.set(false);
    } catch (error) {
      console.log("상품 로딩 실패: ", error);

      $error.set(error instanceof Error ? error.message : "상품을 불러오는데 실패했습니다.");
      $isLoading.set(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [$itemsPerPage]);

  return html`
    <main class="h-full max-w-md mx-auto px-4 py-4">
      ${$error.ref((error) => {
        if (error) {
          return html` <div class="h-full w-full flex flex-col gap-4 items-center justify-center text-center font-bold">
            <p class="font-medium">${$error}</p>
            <button
              class="bg-blue-500 p-3 rounded-md flex-shrink-0 text-white hover:text-gray-200"
              ${on("click", () => {
                fetchProducts();
              })}
            >
              다시 시도
            </button>
          </div>`;
        }
        return html`
          <!-- 검색 및 필터 -->
          ${ProductFilter({ $itemsPerPage })}
          <!-- 상품 목록 -->
          ${ProductList({ $products, $isLoading, $itemsPerPage })}
        `;
      })}
    </main>
  `;
});
