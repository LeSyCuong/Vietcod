import { Metadata } from "next";
import ProductsPage from "./ProductsPage";

export const metadata: Metadata = {
  title: "Mã Nguồn Server Game | Sourcecode Vietcod",
  description: "Tổng hợp các server, sourcecode game hàng đầu tại Vietcod.",
};

export default function Page() {
  return <ProductsPage />;
}
