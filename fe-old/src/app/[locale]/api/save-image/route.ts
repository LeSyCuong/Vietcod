import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir, stat } from "fs/promises";
import sharp from "sharp";
import axiosInstance from "../../utils/axiosInstance";

function getFileName(url: string) {
  const base = path.basename(new URL(url).pathname).split("?")[0];
  if (!base || !base.includes(".")) {
    return `image_${Date.now()}.jpg`;
  }
  return base;
}

async function fileExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, id, key } = await req.json();

    if (!url || !id || !key) {
      return NextResponse.json(
        { error: "Thiếu url, id hoặc key" },
        { status: 400 }
      );
    }

    const fileName = getFileName(url);
    const dir = path.join(process.cwd(), "public", "uploads", "items");
    const fullPath = path.join(dir, fileName);

    if (!(await fileExists(fullPath))) {
      await mkdir(dir, { recursive: true });

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Không tải được ảnh từ ${url}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      const resized = await sharp(buffer)
        .resize({ width: 500 })
        .jpeg({ quality: 80 })
        .toBuffer();

      await writeFile(fullPath, resized);
    }

    const localUrl = `/en/api/media/items/${fileName}`;

    // Gửi lên backend tuỳ theo key
    const updateBody =
      key === "img"
        ? { img: localUrl }
        : key === "img_demo"
        ? { img_demo: localUrl }
        : {};

    const updateRes = await axiosInstance.patch(
      `/server/sanpham-game/${id}/images`,
      updateBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Update response backend:", updateRes.data);

    return NextResponse.json({ localUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
