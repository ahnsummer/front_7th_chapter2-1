import { useState } from "@core/state/useState";
import { getProducts } from "../../api/productApi";
import { Product } from "../../types";
import { useEffect } from "@core/state/useEffect";
import { ProductFilter } from "../../domains/product/components/ProductList/ProductFilter";
import { ProductList } from "../../domains/product/components/ProductList";
import { ImpressionArea } from "../../shared/components/ImpressionArea";
import { isNil, isNotNil } from "es-toolkit";

export type SortType = "price_asc" | "price_desc" | "name_asc" | "name_desc";

export function ProductListPage() {
  const [products, setProducts] = useState<Product[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<SortType>("price_asc");
  const [limit, setLimit] = useState(20);

  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // throw new Error("테스트 에러입니다!");

      const response = await getProducts({
        page,
        search,
        category1: categories[0],
        category2: categories[1],
        sort,
        limit,
      });

      setTotalPages(response.pagination.totalPages);
      setProducts((prev) => {
        prev[page - 1] = response.products;
        return prev;
      });
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
    if (isNotNil(totalPages) && page > totalPages) return;

    fetchProducts();
  }, [search, sort, limit, page, totalPages, categories]);

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
            <ProductFilter
              search={search}
              categories={categories}
              sort={sort}
              limit={limit}
              onSearch={setSearch}
              onChangeCategories={setCategories}
              onSort={setSort}
              onLimit={setLimit}
            />
            <ProductList
              products={products.flat()}
              isLoading={isLoading}
              limit={limit}
            />
            {products.length > 0 && (
              <ImpressionArea
                debounceTime={2000}
                onImpression={() => {
                  setPage((prev) =>
                    isNil(totalPages)
                      ? prev + 1
                      : Math.min(prev + 1, totalPages),
                  );
                }}
              />
            )}
          </>
        );
      })()}
    </main>
  );
}
