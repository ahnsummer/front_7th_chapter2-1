import { useState } from "@core/state/useState";
import { getProducts } from "../../api/productApi";
import { Product } from "../../types";
import { useEffect } from "@core/state/useEffect";
import { ProductFilter } from "../../domains/product/components/ProductList/ProductFilter";
import { ProductList } from "../../domains/product/components/ProductList";

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    console.log("fetchProducts", itemsPerPage);
    try {
      setIsLoading(true);
      setError(null);

      // throw new Error("테스트 에러입니다!");

      const response = await getProducts({
        page: 1,
        limit: itemsPerPage,
        sort: "price_asc",
      });

      setProducts(response.products);
      setIsLoading(false);
    } catch (error) {
      console.log("상품 로딩 실패: ", error);

      setError(
        error instanceof Error
          ? error.message
          : "상품을 불러오는데 실패했습니다.",
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [itemsPerPage]);

  return (
    <main className="h-full max-w-md mx-auto px-4 py-4">
      {(() => {
        if (error) {
          return (
            <div className="h-full w-full flex flex-col gap-4 items-center justify-center text-center font-bold">
              <p className="font-medium">{error}</p>
              <button
                className="bg-blue-500 p-3 rounded-md flex-shrink-0 text-white hover:text-gray-200"
                onClick={() => {
                  fetchProducts();
                }}
              >
                다시 시도
              </button>
            </div>
          );
        }

        return (
          <>
            <ProductFilter itemsPerPage={itemsPerPage} />
            <ProductList
              products={products}
              isLoading={isLoading}
              itemsPerPage={itemsPerPage}
            />
          </>
        );
      })()}
    </main>
  );
}
