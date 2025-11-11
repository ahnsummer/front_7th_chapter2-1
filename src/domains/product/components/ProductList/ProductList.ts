import { component, html } from "../../../../core/component";
import { State } from "../../../../core/state/useState";
import { Product } from "../../../../types";
import { ProductItem } from "./ProductItem";
import { ProductSkeleton } from "./ProductSkeleton";
import { SpinCircle } from "./SpinCircle";

type ProductListProps = {
  $products: State<Product[]>;
  $isLoading: State<boolean>;
  $itemsPerPage: State<number>;
};

export const ProductList = component(({ $products, $isLoading, $itemsPerPage }: ProductListProps) => {
  return html`
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${$products.ref((products) => products.length)}개</span>의 상품
        </div>
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${$isLoading.ref((isLoading) => {
            if (isLoading) {
              return html`
                ${$itemsPerPage.ref((itemsPerPage) =>
                  Array.from({ length: itemsPerPage }).map(() => ProductSkeleton()),
                )}
              `;
            }

            return html` ${$products.ref((products) => products.map((product) => ProductItem({ product })))} `;
          })}
        </div>

        ${$isLoading.ref((isLoading) => {
          if (isLoading) {
            return html`
              <div class="text-center py-4">
                <div class="inline-flex items-center">
                  ${SpinCircle()} <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                </div>
              </div>
            `;
          } else {
            return html`<div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>`;
          }
        })}
      </div>
    </div>
  `;
});
