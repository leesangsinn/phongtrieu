// Phần dữ liệu nhẹ, không kéo theo toàn bộ nội dung bài viết vào bundle client
export type Category =
  | "Thương hiệu & Truyền thống"
  | "Thông tin sản phẩm"
  | "Tin cậy & Minh bạch"
  | "Cách sử dụng"
  | "Thông tin mua hàng";

export const categories: Category[] = [
  "Thương hiệu & Truyền thống",
  "Thông tin sản phẩm",
  "Tin cậy & Minh bạch",
  "Cách sử dụng",
  "Thông tin mua hàng",
];

export const featured = {
  // Nội dung thẻ nổi bật lấy từ phần "Bài viết nổi bật" trong tintuc.txt
  title: "Cách phân biệt các loại nước mắm và tìm hiểu độ đạm",
  excerpt:
    "Nước mắm có nhiều loại và mỗi loại mang một đặc điểm riêng. Bài viết này sẽ giúp bạn hiểu rõ cách phân biệt và ý nghĩa của chỉ số độ đạm.",
  date: "12.10.2026",
  category: "Thông tin sản phẩm" as Category,
  image: "/1790930439399_5418089955404882545_g7806269425997013012_7663adbe877c25673d62534f15ada54e.jpg",
  // Bài 2 (đánh dấu 👍) trong nhóm "Thông tin sản phẩm"
  slug: "do-dam-nuoc-mam-la-gi-cach-doc-thong-so-tren-nhan-san-pham",
};

