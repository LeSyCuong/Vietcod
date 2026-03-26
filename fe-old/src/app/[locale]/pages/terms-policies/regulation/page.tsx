import Footer from "@/app/[locale]/modules/footer/footer";
import Header from "@/app/[locale]/modules/header/page";
import React from "react";

export default function TermsOfUse() {
  return (
    <>
      <Header />
      <div className="prose prose-invert max-w-5xl mt-30 mx-auto py-10 px-5 md:px-20 text-gray-900">
        <h3 className="text-3xl font-bold mb-6">Về Chúng Tôi</h3>

        <p className="mb-4">
          <strong>Chào mừng đến với Vietcod</strong> – nền tảng cung cấp tài
          nguyên game chất lượng, phục vụ các nhà phát triển và cộng đồng đam mê
          game.
        </p>

        <p className="mb-4">
          <strong>Sứ mệnh của chúng tôi</strong> là mang đến nguồn tài nguyên
          phong phú, dễ tiếp cận và hỗ trợ quá trình sáng tạo game của bạn.
          Chúng tôi tin rằng tài nguyên tốt là nền tảng để phát triển ngành công
          nghiệp game vững mạnh.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Dịch vụ & sản phẩm</h2>
        <ol className="list-decimal list-inside mb-6 space-y-3">
          <li>
            <strong>Source Game Mobile:</strong> Bao gồm nhiều thể loại như hành
            động, phiêu lưu, chiến thuật và mô phỏng. Source được thiết kế dễ
            tích hợp và tùy chỉnh.
          </li>
          <li>
            <strong>Source Game H5:</strong> Nền tảng web game linh hoạt, tối
            ưu, dễ triển khai các dự án game trực tuyến.
          </li>
          <li>
            <strong>Source Game Client:</strong> Hỗ trợ phát triển game client
            đồ họa cao, với công cụ chuyên nghiệp và đáng tin cậy.
          </li>
          <li>
            <strong>Source Webgame:</strong> Giúp xây dựng các webgame hấp dẫn,
            đáp ứng nhu cầu giải trí đa dạng.
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Tại sao chọn Vietcod?
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            <strong>Chất lượng:</strong> Mỗi tài nguyên đều được kiểm tra kỹ
            trước khi cung cấp.
          </li>
          <li>
            <strong>Hỗ trợ tận tâm:</strong> Đội ngũ sẵn sàng tư vấn và hỗ trợ
            triển khai.
          </li>
          <li>
            <strong>Cập nhật thường xuyên:</strong> Luôn bổ sung source và tài
            nguyên mới, theo xu hướng game hiện đại.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Cộng đồng & chia sẻ
        </h2>
        <p className="mb-4">
          Chúng tôi không chỉ cung cấp tài nguyên, mà còn xây dựng cộng đồng kết
          nối nhà phát triển. Tham gia hội thảo, chia sẻ kiến thức và học hỏi
          kinh nghiệm từ các chuyên gia.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Quy định về tài nguyên
        </h2>
        <p className="mb-2">
          <strong>Nghiêm cấm</strong> việc chia sẻ, bán lại hoặc sử dụng trái
          phép các tài nguyên trên trang web dưới mọi hình thức, bao gồm mã
          nguồn, hình ảnh, video, dữ liệu và thông tin độc quyền.
        </p>
        <p className="mb-4">
          Mọi vi phạm sẽ dẫn đến <strong>khóa tài khoản vĩnh viễn</strong> và có
          thể chịu các biện pháp pháp lý.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Hành vi gian lận</h2>
        <p className="mb-2">
          Nghiêm cấm mọi hình thức gian lận, lừa đảo hoặc gây tổn hại đến người
          dùng và hệ thống.
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            <strong>Phishing:</strong> Giả mạo để lấy thông tin người dùng.
          </li>
          <li>
            <strong>Tài khoản giả mạo:</strong> Thông tin không chính xác hoặc
            mạo danh người khác.
          </li>
          <li>
            <strong>Gian lận giao dịch:</strong> Lợi dụng hệ thống để trục lợi.
          </li>
          <li>
            <strong>Phát tán phần mềm độc hại:</strong> Virus, trojan, mã độc
            gây hại thiết bị người dùng.
          </li>
          <li>
            <strong>Thao túng dữ liệu:</strong> Thay đổi, xóa hoặc thêm dữ liệu
            gian lận.
          </li>
          <li>
            <strong>Quảng cáo sai sự thật:</strong> Thông tin gây hiểu lầm hoặc
            lừa dối người dùng.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Hậu quả</h2>
        <p className="mb-4">
          Mọi vi phạm sẽ dẫn đến <strong>khóa tài khoản vĩnh viễn</strong> và có
          thể báo cáo cơ quan chức năng. Chúng tôi sẽ thực hiện hành động pháp
          lý để bảo vệ quyền lợi của cộng đồng và của chúng tôi.
        </p>

        <p className="mb-4">
          Hãy cùng chúng tôi khám phá và tạo ra những tựa game tuyệt vời nhất!
        </p>
      </div>

      <Footer />
    </>
  );
}
