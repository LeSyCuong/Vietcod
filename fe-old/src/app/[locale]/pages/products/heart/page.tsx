import { Metadata } from "next";
import HeartPage from "./heartPage";

export const metadata: Metadata = {
  title: "Mã Nguồn Server Game | Sản phẩm yêu thích Vietcod",
  description: "Sản phẩm game yêu thích  Vietcod.",
};

export default function Page() {
  return <HeartPage />;
}
