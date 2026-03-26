// app/templates/data.ts
import { env } from "@/lib/env";

export type GameProduct = {
  id: number;
  name: string;
  img: string;
  price: number;
  category: string;
  content: string;
  link_youtube: string;
};

const parsedEnv = env();

export const API_URL = parsedEnv.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const API_BACKEND =
  parsedEnv.NEXT_PUBLIC_BACKEND_URL || "https://tienkiemtruyenky.click";

export const getImgUrl = (img: string | undefined | null) => {
  if (!img) return "/images/placeholder.png";

  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  const cleanImg = img.startsWith("/") ? img : `/${img}`;

  return `${API_BACKEND}${cleanImg}`;
};
