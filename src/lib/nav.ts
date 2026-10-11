export const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/cau-chuyen", label: "Câu chuyện" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/dai-ly", label: "Đại lý" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
