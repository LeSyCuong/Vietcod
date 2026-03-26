import Footer from "@/app/[locale]/modules/footer/footer";
import Header from "@/app/[locale]/modules/header/page";
import React from "react";

export default function TermsOfUse() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto mt-30 px-5 py-10">
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-6">
          Điều khoản sử dụng
        </h1>

        <p className="mb-4 text-gray-700">
          Chào mừng bạn đến với website <strong>Vietcod</strong>. Bằng việc truy
          cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản sau:
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          1. Sản phẩm và dịch vụ
        </h2>
        <p className="mb-4 text-gray-700">
          Website cung cấp các{" "}
          <strong>mã nguồn game, công cụ hỗ trợ, và tài nguyên game </strong>
          từ các nguồn trên internet. Người dùng có thể dùng{" "}
          <strong>Credit</strong> để hỗ trợ chi phí kỹ thuật, nhận tài nguyên,
          tải về và sử dụng các sản phẩm cho mục đích cá nhân của chính mình.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          2. Dùng Credit để nhận tài nguyên
        </h2>
        <p className="mb-4 text-gray-700">
          Sử dụng <strong>Credit</strong> để hỗ trợ chi phí kỹ thuật và nhận tài
          nguyên
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>Nhận quyền truy cập các tài nguyên học tập hoặc bản demo.</li>
          <li>Đổi credit để nhận gói hỗ trợ hoặc tài nguyên nâng cao.</li>
        </ul>
        <p>
          Credit là đơn vị nội bộ, không phải tiền pháp định, và không được
          chuyển nhượng ra ngoài.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Quyền sử dụng</h2>
        <p className="mb-4 text-gray-700">
          Người dùng được quyền sử dụng tài nguyên đã nhận. Tuyệt đối không được
          sao chép, phát tán hoặc bán lại tài nguyên cho bên thứ ba mà chưa có
          sự cho phép của Vietcod.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Cam kết & trách nhiệm</h2>
        <p className="mb-2">
          Người dùng cam kết sử dụng website phục vụ mục đích học tập, nghiên
          cứu, hoặc hợp tác phát triển. Không sử dụng website để vi phạm pháp
          luật hoặc lạm dụng tài nguyên.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">
          5. Thay đổi điều khoản
        </h2>
        <p className="mb-4 text-gray-700">
          Vietcod có quyền chỉnh sửa điều khoản sử dụng mà không cần thông báo
          trước. Người dùng nên thường xuyên kiểm tra trang này để cập nhật.
        </p>
      </div>
      <Footer />
    </>
  );
}
