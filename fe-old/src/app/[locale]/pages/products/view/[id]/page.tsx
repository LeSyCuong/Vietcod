import { Metadata } from "next";
import ProductDetail from "./ProductDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;

  const res = await fetch(`${url_backend}/sanpham-game/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Sản phẩm này có thể đã bị xóa hoặc không khả dụng.",
    };
  }

  const product = await res.json();

  return {
    title: `${product.name} | Vietcod`,
    description:
      product.content?.slice(0, 160) || "Trang thông tin sản phẩm game Vietcod",
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
