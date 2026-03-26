"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/[locale]/stores/userStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  title: string;
  items: CheckoutItem[];
  onClose: () => void;
  existingInvoiceCode?: string;
  onPaymentSuccess?: () => void;
};

const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;

export default function CheckoutModal({
  title,
  items,
  onClose,
  existingInvoiceCode,
  onPaymentSuccess,
}: Props) {
  const { user, checkUser } = useUserStore();
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState("");
  const [paying, setPaying] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(
    existingInvoiceCode || null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successID, setSuccessID] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkUser]);

  const pollPaymentStatus = (invoiceCode: string) => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${url_backend}/orders/status/${invoiceCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success") {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setSuccessMessage(`Nhận thành công mã nguồn: ${data.name}`);
            setSuccessID(data.id);
            setQrUrl("");
            localStorage.setItem("paymentStatus", JSON.stringify(data));
            onPaymentSuccess?.();
          }
        }
      } catch (err) {
        console.error("Error checking credit status", err);
      }
    }, 10000);

    setTimeout(() => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }, 900000); // 15 phút
  };

  const generateQR = (amount: number, invoiceCode: string) => {
    const base = "https://img.vietqr.io/image/ACB-19433111-print.png";
    const query = `?amount=${amount}&addInfo=${invoiceCode}&accountName=LE+SY+CUONG&invoiceCode=${invoiceCode}`;
    setQrUrl(`${base}${query}`);
    setTimeout(() => pollPaymentStatus(invoiceCode), 2000);
  };

  const handlePurchase = async (
    itemId: number,
    price: number,
    name: string
  ) => {
    if (!user || !user.username) {
      router.push("/pages/login");
      return;
    }

    setPaying(true);

    try {
      let invoiceCode = invoice;
      let orderId: number | null = null; // chỉ dùng khi đã checkout

      // 1. Tạo hóa đơn nếu chưa có
      if (!invoiceCode) {
        const resCheckout = await fetch(`${url_backend}/orders/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, price, userId: user.id, name }),
        });

        if (!resCheckout.ok) throw new Error("Lỗi tạo hóa đơn");

        const dataCheckout = await resCheckout.json();

        if (!dataCheckout.invoiceCode || !dataCheckout.id) {
          throw new Error("Checkout backend trả về dữ liệu không hợp lệ");
        }

        invoiceCode = dataCheckout.invoiceCode;
        orderId = dataCheckout.id;

        setInvoice(invoiceCode);
        setSuccessID(orderId); // dùng để nút Xem đơn hàng
      } else {
        // Nếu đã có invoiceCode, không cần tạo mới, lấy orderId từ state
        orderId = successID;
        if (!orderId) {
          throw new Error("Không tìm thấy orderId để nạp Credit");
        }
      }

      // 2. Thanh toán trực tiếp nếu đủ tiền
      if (user.vnd >= price && orderId) {
        const resPay = await fetch(`${url_backend}/orders/payment/${orderId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, invoiceCode }),
        });

        if (!resPay.ok) throw new Error("Lỗi nạp Credit");

        const dataPay = await resPay.json();

        if (dataPay.status === "success") {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          setSuccessMessage(`Nhận thành công mã nguồn: ${name}`);
          setSuccessID(dataPay.id);
          setQrUrl("");
          localStorage.setItem("paymentStatus", JSON.stringify(dataPay));
          onPaymentSuccess?.();
        } else {
          throw new Error("Nạp Credit thất bại");
        }
      }
      // 3. Nếu không đủ tiền → hiển thị QR
      else if (invoiceCode) {
        generateQR(price, invoiceCode);
      }
    } catch (err) {
      console.error(err);
      alert("Nạp Credit thất bại. Vui lòng thử lại.");
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    if (invoice && items.length > 0 && user?.id && !hasStarted) {
      handlePurchase(
        Number(items[0].id),
        Number(items[0].price),
        items[0].name
      );
      setHasStarted(true);
    }
  }, [invoice, items, user, hasStarted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white max-h-[80vh] overflow-hidden flex flex-col rounded-2xl w-full max-w-md animate-fade-in-up shadow-2xl">
        {/* Modal Header - Fixed */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                onClose();
              }}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {paying ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-6" />
                <p className="text-gray-700 font-medium">
                  Đang xử lý yêu cầu...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Vui lòng chờ trong giây lát
                </p>
              </div>
            ) : successMessage ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 text-green-500">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {successMessage}
                </h4>
                <button
                  onClick={() => router.push(`/pages/users/orders`)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Xem tài nguyên
                </button>
              </div>
            ) : qrUrl && invoice ? (
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-6">
                  Quét mã QR để thanh toán
                </h4>
                <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mb-6">
                  <img
                    src={qrUrl}
                    alt="Mã QR thanh toán"
                    width={220}
                    height={220}
                    className="rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Thanh toán thành công để nhận tài nguyên. Hệ thống sẽ tự động
                  cập nhật trong vài phút.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="space-y-4">
                    {/* Basic Package */}
                    <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Bản thường
                        </h4>
                        <span className="text-xl font-bold text-gray-900">
                          {item.price.toLocaleString("vi-VN")}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            Credit
                          </span>
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {[
                          "Web trang chủ & landing page",
                          "Source server & clients đầy đủ",
                          "Hỗ trợ setup online",
                          "Tool GM cơ bản",
                        ].map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-600 text-sm"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() =>
                          handlePurchase(item.id, item.price, item.name)
                        }
                        disabled={paying}
                        className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Chọn bản thường
                      </button>
                    </div>

                    {/* Premium Package */}
                    <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Bản thương mại
                          </h4>
                          <span className="text-xs text-blue-600 font-medium">
                            Phổ biến nhất
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          {(item.price + 1500000).toLocaleString("vi-VN")}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            Credit
                          </span>
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {[
                          "Web user & admin đầy đủ",
                          "Auto bank & giftcode system",
                          "Shop item & payment gateway",
                          "Hỗ trợ 24/7 priority",
                        ].map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-600 text-sm"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-blue-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() =>
                          handlePurchase(
                            item.id,
                            item.price + 1500000,
                            item.name
                          )
                        }
                        disabled={paying}
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Chọn bản thương mại
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Optional Footer - Fixed */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            Tất cả gói dịch vụ đều bao gồm hỗ trợ kỹ thuật
          </p>
        </div>
      </div>
    </div>
  );
}
