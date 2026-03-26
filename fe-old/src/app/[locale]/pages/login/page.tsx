import { Metadata } from "next";
import LoginForm from "./form";

export const metadata: Metadata = {
  title: "Vietcod | Đăng nhập",
  description: "Trang đăng nhập tài khoản Vietcod",
};

export default function LoginPage() {
  return <LoginForm />;
}
