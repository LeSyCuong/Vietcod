import { Metadata } from "next";
import ForgotForm from "./form";

export const metadata: Metadata = {
  title: "Vietcod | Quên mật khẩu",
  description: "Trang quên mật khẩu Vietcod",
};

export default function LoginPage() {
  return <ForgotForm />;
}
