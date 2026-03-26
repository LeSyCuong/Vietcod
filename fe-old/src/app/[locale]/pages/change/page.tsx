import { Metadata } from "next";
import ChangeForm from "./form";

export const metadata: Metadata = {
  title: "Vietcod | Đổi mật khẩu",
  description: "Trang đổi mật khẩu Vietcod",
};

export default function LoginPage() {
  return <ChangeForm />;
}
