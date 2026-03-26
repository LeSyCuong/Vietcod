import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { url, id, key } = await req.json();

    if (!url || !id || !key) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    // 1. Phân tích tên file
    const filename = path.basename(url);

    // 2. Đường dẫn vật lý đến file cũ trên FE
    const localFilePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "images",
      "products",
      filename
    );

    if (!fs.existsSync(localFilePath)) {
      return NextResponse.json({ newUrl: url, status: "skipped_file_missing" });
    }

    // 3. Đọc file thành Buffer
    const fileBuffer = fs.readFileSync(localFilePath);

    // 4. Xác định MimeType
    const ext = path.extname(filename).toLowerCase();
    const mimeType =
      {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
      }[ext] || "application/octet-stream";

    /**
     * GIẢI PHÁP SỬA LỖI TYPE:
     * Thay vì dùng Blob từ thư viện 'buffer', ta dùng Global Blob.
     * Hoặc an toàn nhất là dùng File object (có sẵn trong Global của Node 20+)
     */
    const fileObject = new File([fileBuffer], filename, { type: mimeType });

    // 5. Chuẩn bị FormData
    const formData = new FormData();
    formData.append("file", fileObject); // File kế thừa từ Blob nên hoàn toàn hợp lệ

    const backendUrl =
      process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

    // 6. Upload sang Backend
    const uploadRes = await fetch(`${backendUrl}/config/upload`, {
      method: "POST",
      body: formData,
      // Không set Content-Type header để fetch tự động generate boundary
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(
        `Backend upload failed: ${uploadRes.status} - ${errorText}`
      );
    }

    const uploadData = await uploadRes.json();

    if (!uploadData.success || !uploadData.filePath) {
      throw new Error("Backend không trả về filePath");
    }

    const newBackendUrl = uploadData.filePath;

    // 7. Cập nhật Database qua Patch
    const patchRes = await fetch(`${backendUrl}/sanpham-game/${id}/images`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [key]: newBackendUrl }),
    });

    if (!patchRes.ok) {
      console.error(`[Migrate] DB Update failed for ID ${id}`);
    }

    return NextResponse.json({
      newUrl: newBackendUrl,
      status: "success",
    });
  } catch (error: any) {
    console.error("[Migrate Error]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
