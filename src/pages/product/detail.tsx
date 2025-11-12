import { ProductDetail } from "../../domains/product/components/ProductDetail";

type ProductDetailPageProps = {
  pathParams: {
    id: string;
  };
};

export function ProductDetailPage({ pathParams }: ProductDetailPageProps) {
  const { id } = pathParams;

  return (
    <>
      <ProductDetail />
    </>
  );
}
