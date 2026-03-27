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

const API_BACKEND =
  parsedEnv.NEXT_PUBLIC_BACKEND_URL || "https://api.vietcod.com";

export const getImgUrl = (img: string | undefined | null) => {
  if (!img) return "/images/placeholder.png";

  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  const cleanImg = img.startsWith("/") ? img : `/${img}`;

  return `${API_BACKEND}${cleanImg}`;
};
