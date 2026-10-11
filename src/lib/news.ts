import raw from "@/data/news-posts.json";

// Dữ liệu bài viết được sinh từ src/tintuc.txt bằng scripts/build-news.py

export type Block =
  | { t: "p" | "h2" | "h3" | "note" | "formula"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

import type { Category } from "./news-meta";
export { categories, featured } from "./news-meta";
export type { Category } from "./news-meta";

export type Post = {
  slug: string;
  title: string;
  group: Category;
  excerpt: string;
  image: string;
  readMinutes: number;
  blocks: Block[];
  refs: string[];
  related: string[];
};

// Ảnh minh họa (dùng lại ảnh có sẵn trong /public) theo thứ tự bài
const images = [
  "/thuyen-cauchuyen.jpg",
  "/1790930439418_5418089955404882545_g7806269425997013012_bbfcaca38aef6dda8de5faea44647bb4.jpg",
  "/1790930439399_5418089955404882545_g7806269425997013012_7663adbe877c25673d62534f15ada54e.jpg",
  "/chum-mam.jpg",
  "/doi-moi-co-chon-loc.jpg",
  "/ca-com-tuoi-5.jpg",
  "/di-san-nghe-mam.jpg",
  "/nen-2031.jpg",
];

type Raw = Omit<Post, "image">;

export const posts: Post[] = (raw as unknown as Raw[]).map((p, i) => ({
  ...p,
  image: images[i % images.length],
}));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const getRelated = (post: Post, n = 3) =>
  [...posts.filter((p) => p.slug !== post.slug && p.group === post.group), ...posts.filter((p) => p.group !== post.group)].slice(0, n);

export function headingId(text: string) {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
