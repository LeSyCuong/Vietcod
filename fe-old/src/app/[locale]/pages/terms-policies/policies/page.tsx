import Footer from "@/app/[locale]/modules/footer/footer";
import Header from "@/app/[locale]/modules/header/page";
import React from "react";

export default function TermsOfUse() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto mt-30 px-5 py-10">
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-6">
          Chính sách bảo mật
        </h1>

        <p className="mb-4 text-gray-700">
          Vietcod cam kết bảo vệ thông tin cá nhân của người dùng khi sử dụng
          website. Dưới đây là các chính sách bảo mật cơ bản:
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          1. Thông tin thu thập
        </h2>
        <p className="mb-4 text-gray-700">
          Chúng tôi chỉ thu thập các thông tin cần thiết để xử lý giao dịch và
          hỗ trợ người dùng, bao gồm: tài khoản, lịch sử giao dịch, và số dư
          Credit.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. Mục đích sử dụng</h2>
        <p className="mb-4 text-gray-700">
          Thông tin người dùng được sử dụng để:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Xử lý thanh toán và hoàn tất giao dịch.</li>
          <li>Hỗ trợ và phản hồi yêu cầu người dùng.</li>
          <li>Bảo mật tài khoản và Credit.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Bảo mật dữ liệu</h2>
        <p className="mb-4 text-gray-700">
          Tất cả dữ liệu người dùng được lưu trữ an toàn và được mã hóa khi cần
          thiết. Vietcod không chia sẻ thông tin với bên thứ ba nếu không có sự
          đồng ý của người dùng.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          4. Quyền của người dùng
        </h2>
        <p className="mb-4 text-gray-700">
          Người dùng có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân
          trong tài khoản của mình. Mọi yêu cầu liên quan đến dữ liệu cá nhân có
          thể gửi đến bộ phận hỗ trợ Vietcod.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          5. Thay đổi chính sách
        </h2>
        <p className="mb-4 text-gray-700">
          Vietcod có quyền cập nhật chính sách bảo mật mà không cần thông báo
          trước. Người dùng nên thường xuyên kiểm tra trang này để biết thông
          tin mới nhất.
        </p>
      </div>
      <Footer />
    </>
  );
}
