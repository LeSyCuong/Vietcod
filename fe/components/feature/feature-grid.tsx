import { cn } from "@/lib/utils";
import {
  Feature,
  FeatureContent,
  FeatureHeader,
  FeatureIcon,
  FeatureTitle,
} from "./feature";
import * as React from "react";

const FeatureGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className }, ref) => (
  <div ref={ref} className={cn(className)}>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 sm:px-0">
      {/* 1. Đa nền tảng */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="cloud" />
          <FeatureTitle>Hỗ trợ Đa nền tảng</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Giải pháp của Vietcod tương thích hoàn hảo với mọi hạ tầng đám mây,
          đảm bảo trải nghiệm đồng nhất trên cả Web, Android và iOS.
        </FeatureContent>
      </Feature>

      {/* 2. Chống DDoS & Spam */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="data" />
          <FeatureTitle>Chống Spam & DDoS</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Bảo vệ hệ thống với cơ chế Rate Limiting thông minh. Ngăn chặn tool
          scan, spam packet và các đợt tấn công DDoS ngay tại lớp hạ tầng.
        </FeatureContent>
      </Feature>

      {/* 3. Quản trị thông minh */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="api" />
          <FeatureTitle>Quản trị Thông minh</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Giao diện Dashboard trực quan phối hợp cùng hệ thống API mạnh mẽ, giúp
          cả người vận hành và kỹ thuật viên đều sử dụng dễ dàng.
        </FeatureContent>
      </Feature>

      {/* 4. Phân quyền Admin */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="role" />
          <FeatureTitle>Phân quyền Chuyên sâu</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Kiểm soát quyền hạn Admin chi tiết theo vai trò. Mọi thay đổi về quyền
          truy cập được cập nhật trên toàn hệ thống chỉ trong vài giây.
        </FeatureContent>
      </Feature>

      {/* 5. Phòng thủ Chủ động */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="detect" />
          <FeatureTitle>Phòng thủ Chủ động</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Tức thời thu hồi quyền truy cập hoặc chặn các kết nối nghi vấn, giúp
          bạn phản ứng nhanh chóng với các mối đe dọa tiềm tàng.
        </FeatureContent>
      </Feature>

      {/* 6. Hướng dẫn vận hành */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="sdk" />
          <FeatureTitle>Tài liệu & Đào tạo</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Bàn giao bộ tài liệu hướng dẫn vận hành chi tiết bằng tiếng Việt, giúp
          đội ngũ của bạn làm chủ hệ thống trong thời gian ngắn nhất.
        </FeatureContent>
      </Feature>

      {/* 7. Triển khai Thần tốc */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="vercel" />
          <FeatureTitle>Triển khai Thần tốc</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Quy trình thiết lập tự động hóa giúp hệ thống sẵn sàng vận hành chỉ
          trong 24h, rút ngắn tối đa thời gian đưa sản phẩm ra thị trường.
        </FeatureContent>
      </Feature>

      {/* 8. Bảo mật Phiên làm việc */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="automatic" />
          <FeatureTitle>Quản lý Phiên bảo mật</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Tự động làm mới và hủy bỏ các phiên đăng nhập hết hạn hoặc nghi vấn,
          giảm thiểu rủi ro từ các truy cập trái phép kéo dài.
        </FeatureContent>
      </Feature>

      {/* 9. Giới hạn & Tích lũy */}
      <Feature>
        <FeatureHeader>
          <FeatureIcon iconName="usage" />
          <FeatureTitle>Cấu hình Mốc nạp</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Thiết lập giới hạn nạp và các mốc thưởng tích lũy linh hoạt, hỗ trợ
          kịch bản kinh doanh đa dạng để tối đa hóa lợi nhuận.
        </FeatureContent>
      </Feature>
    </div>
  </div>
));
FeatureGrid.displayName = "FeatureGrid";

export { FeatureGrid };
