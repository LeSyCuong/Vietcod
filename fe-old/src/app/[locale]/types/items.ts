export type Product = {
  id: number;
  name: string;
  img?: string;
  img_demo?: string;
  price: number;
  category: string;
  content?: string;
  localImage?: string;
  link_youtube?: string;
  link_source?: string;
  link_view?: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  localImage: string;
};

export type DataItem = {
  id: number;
  componentId: number;
  index: number;
  lang: string;
  title: string;
  content: string;
  description: string;
  listImg: string | null;
  listVideo: string | null;
  video: string | null;
  img: string;
  updatedAt: string;
  link: string | null;
};

export type NewsItem = {
  id: number;
  groupId: number;
  title: string;
  lang: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  slug?: string;
  tag?: string;
};
