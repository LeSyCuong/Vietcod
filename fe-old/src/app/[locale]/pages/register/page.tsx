import { Metadata } from "next";
import RegisterForm from "./form";

export const metadata: Metadata = {
  title: "Vietcod | Đăng ký",
  description: "Trang đăng ký tài khoản Vietcod",
};

export default function LoginPage() {
  return <RegisterForm />;
}
