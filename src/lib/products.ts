export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  /** Nền pastel của khung ảnh, theo màu nhãn chai */
  panel: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "di-san",
    name: "Di Sản",
    subtitle: "Đậm vị truyền thống · 40° đạm tổng",
    description:
      "Hương vị mặn êm, hậu vị ngọt thanh, giữ trọn tinh túy của cá cơm và thời gian ủ chượp.",
    features: ["40° đạm tổng", "Đặc sản mắm cốt Nghệ An"],
    image: "/disan-cutout.png",
    panel: "from-[#FBEFDD] to-[#F0D3B1]",
    featured: true,
  },
  {
    slug: "thanh-vi",
    name: "Thanh Vị",
    subtitle: "Giảm mặn · Nhẹ vị, dễ dùng",
    description:
      "Giảm bớt độ mặn, vẫn giữ trọn hương vị truyền thống, phù hợp cho bữa cơm hằng ngày.",
    features: ["Giảm 16% độ mặn", "Nhẹ vị, dễ dùng"],
    image: "/thanhvi-cutout.png",
    panel: "from-[#EEF5E8] to-[#CFE0CC]",
  },
  {
    slug: "duong-vi",
    name: "Dưỡng Vị",
    subtitle: "Giảm mặn · Hài hòa vị ngon",
    description:
      "Hương vị cân bằng, dễ kết hợp trong nhiều món ăn, phù hợp cho cả gia đình.",
    features: ["Giảm 24% độ mặn", "Hài hòa vị ngon"],
    image: "/duongvi-cutout.png",
    panel: "from-[#E8F3F1] to-[#C3DDDA]",
  },
];

export type GiftSet = {
  name: string;
  description: string;
  image: string;
};

export const giftSets: GiftSet[] = [
  {
    name: "Khai Vị Phong Triều",
    description: "Bộ ba Di Sản, Thanh Vị, Dưỡng Vị để khám phá trọn vẹn các sắc vị.",
    image: "/khai-vi-phong-trieu.jpg",
  },
  {
    name: "Di Sản Thượng Hạng",
    description: "Nước mắm Di Sản trong hộp quà trang nhã, gói trọn tình thân.",
    image: "/di-san-thuong-hang.jpg",
  },
  {
    name: "An Sức Khỏe",
    description: "Thanh Vị và Dưỡng Vị, hai lựa chọn nhẹ vị cho bữa cơm gia đình.",
    image: "/an-suc-khoe.jpg",
  },
];
