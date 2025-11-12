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
