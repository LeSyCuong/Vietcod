import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  displayImage: string;
  price: number;
  category: string;
};

type Props = {
  products: Product[];
  isLoading: boolean;
};

export default function ProductGrid({ products, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 text-gray-500 gap-2">
        <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
        <span className="text-sm">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center p-10 text-gray-500">
        Không có sản phẩm nào.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {products.map((p) => (
        <ProductCard key={p.id || `${p.name}-${p.price}`} {...p} />
      ))}
    </div>
  );
}
