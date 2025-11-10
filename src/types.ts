/**
 * 상품 기본 정보
 */
export type Product = {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
};

/**
 * 상품 상세 정보
 */
export type ProductDetail = Product & {
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
};

/**
 * 페이지네이션 정보
 */
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/**
 * 필터 정보
 */
export type Filters = {
  search: string;
  category1: string;
  category2: string;
  sort: SortType;
};

/**
 * 상품 목록 응답
 */
export type ProductListResponse = {
  products: Product[];
  pagination: Pagination;
  filters: Filters;
};

/**
 * 상품 상세 응답
 */
export type ProductDetailResponse = ProductDetail;

/**
 * 카테고리 응답 (2depth 구조)
 */
export type CategoriesResponse = Record<
  string,
  Record<string, Record<string, never>>
>;

/**
 * 정렬 타입
 */
export type SortType = "price_asc" | "price_desc" | "name_asc" | "name_desc";

/**
 * 상품 목록 조회 파라미터
 */
export type GetProductsParams = {
  limit?: number;
  search?: string;
  category1?: string;
  category2?: string;
  sort?: SortType;
  current?: number;
  page?: number;
};

/**
 * 필터링용 쿼리 (내부 사용)
 */
export type FilterQuery = {
  search: string;
  category1: string;
  category2: string;
  sort: SortType;
};
