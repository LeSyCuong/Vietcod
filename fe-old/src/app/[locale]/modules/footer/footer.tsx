import Link from "next/link";
import { useTranslations } from "next-intl";
import Submit from "./submit";
import { FaFacebookF, FaTelegramPlane, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("footer");

  const phone = "0865811722";
  const email = "vietcodsp@gmail.com";

  return (
    <>
      <footer className="bg-[#111111] py-16 px-10 md:px-20 relative">
        <div className="max-w-7xl text-white mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Cột 1 - Dịch vụ */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider border-b border-white pb-2">
              Dịch vụ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pages/products"
                  className="text-white hover:text-cyan-200 transition"
                >
                  Source game
                </Link>
              </li>
              <li>
                <a
                  href={`https://zalo.me/${phone}`}
                  target="_blank"
                  className="text-white hover:text-cyan-200 transition"
                >
                  Thiết kế web game
                </a>
              </li>
              <li>
                <a
                  href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
                  target="_blank"
                  className="text-white hover:text-cyan-200 transition"
                >
                  VPS
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 2 - Điều khoản & Chính sách */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider border-b border-white pb-2">
              Điều khoản & Chính sách
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pages/terms-policies/regulation"
                  className="text-white hover:text-cyan-200 transition"
                >
                  Quy định
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-policies/terms"
                  className="text-white hover:text-cyan-200 transition"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-policies/policies"
                  className="text-white hover:text-cyan-200 transition"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider border-b border-white pb-2">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <b className="text-white">{t("footer.companyName")}</b>
              </li>
              <li>
                {t("footer.hotline")}:{" "}
                <a
                  href={`https://zalo.me/${phone}`}
                  target="_blank"
                  className="text-white hover:text-cyan-200 font-semibold"
                >
                  {phone}
                </a>
              </li>
              <li>
                {t("footer.email")}:{" "}
                <a
                  target="_blank"
                  href={`mailto:${email}`}
                  className="text-white hover:text-cyan-200 font-semibold"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-cyan-500/30 pt-8 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {t("footer.newsletterTitle")}
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed">
                {t("footer.newsletterContent")}
              </p>
            </div>
            <div>
              <Submit />
              <p className="text-gray-400 text-xs leading-relaxed mt-3">
                {t("footer.privacyNote", {
                  privacyPolicy: t("footer.privacyPolicy"),
                })}
              </p>
            </div>
          </div>

          {/* Social icons đè lên line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#111111] -top-3 flex gap-6 px-5 text-2xl">
            <Link
              href="https://zalo.me/0865811722"
              target="_blank"
              className="text-white hover:text-cyan-400 transition"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://t.me/cuong99871"
              target="_blank"
              className="text-white hover:text-cyan-400 transition"
            >
              <FaTelegramPlane />
            </Link>
            <Link
              href="https://www.youtube.com/channel/UC_wsC2tHrXCGMGDnz4I0jig"
              target="_blank"
              className="text-white hover:text-cyan-400 transition"
            >
              <FaYoutube />
            </Link>
          </div>

          {/* Dòng text dưới cùng */}
          <div className="text-center mt-10 text-gray-400 text-xs relative z-10">
            &copy; 2025{" "}
            <span className="font-medium text-cyan-300">Vietcod</span>.{" "}
            {t("footer.right")}
          </div>
        </div>
      </footer>
    </>
  );
}
