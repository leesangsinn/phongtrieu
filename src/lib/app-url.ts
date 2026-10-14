/**
 * Tên miền chính thức dùng để sinh link xác minh in trên tem QR.
 * Bắt buộc cấu hình NEXT_PUBLIC_APP_URL; không có giá trị mặc định để tránh in tem
 * trỏ nhầm sang tên miền không thuộc thương hiệu (tem đã in thì không sửa được).
 *
 * Lưu ý: biến NEXT_PUBLIC_* được nhúng vào bản build, nên đổi giá trị cần deploy lại.
 */
export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!raw) {
    throw new Error(
      "Chưa cấu hình NEXT_PUBLIC_APP_URL. Hãy đặt tên miền chính thức của website (ví dụ https://tenmien.vn) rồi deploy lại trước khi sinh hoặc xuất mã QR."
    );
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_APP_URL không phải địa chỉ hợp lệ. Hãy nhập đầy đủ, ví dụ https://tenmien.vn."
    );
  }

  if (process.env.NODE_ENV === "production") {
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname);
    if (url.protocol !== "https:" || isLocal) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL trên môi trường thật phải là tên miền chính thức dùng https (không phải localhost)."
      );
    }
  }

  return url.origin;
}
