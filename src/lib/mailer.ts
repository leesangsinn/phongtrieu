import nodemailer, { type Transporter } from "nodemailer";

/** Người nhận thông báo khách hàng mới (có thể đổi bằng biến môi trường CONTACT_NOTIFY_EMAIL). */
const DEFAULT_NOTIFY_TO = "mamdisanphongtrieu@gmail.com";
const SUBJECT = "[Phong Triều] Khách hàng mới liên hệ";

export interface ContactMailData {
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
  createdAt: Date;
}

let cached: Transporter | null = null;

/**
 * Tạo transporter Gmail từ SMTP_EMAIL / SMTP_PASSWORD (mật khẩu ứng dụng Gmail).
 * Trả về null nếu chưa cấu hình. Có thể dùng SMTP_HOST / SMTP_PORT cho nhà cung cấp khác.
 */
function getTransporter(): Transporter | null {
  const user = process.env.SMTP_EMAIL?.trim();
  // Gmail hiển thị mật khẩu ứng dụng dạng "abcd efgh ijkl mnop": bỏ khoảng trắng
  const pass = process.env.SMTP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  if (!cached) {
    const timeouts = { connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000 };
    const host = process.env.SMTP_HOST?.trim();
    if (host) {
      const port = Number(process.env.SMTP_PORT) || 587;
      cached = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, ...timeouts });
    } else {
      cached = nodemailer.createTransport({ service: "gmail", auth: { user, pass }, ...timeouts });
    }
  }
  return cached;
}

/** Thoát ký tự HTML: dữ liệu khách nhập không bao giờ được chèn thẳng vào nội dung email. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 14px;background:#F8F3EA;color:#7A6458;font-size:13px;width:130px;vertical-align:top;border-bottom:1px solid #EADFCF;">${label}</td>
    <td style="padding:10px 14px;color:#2C1A14;font-size:14px;vertical-align:top;border-bottom:1px solid #EADFCF;">${valueHtml}</td>
  </tr>`;
}

function buildHtml(d: ContactMailData): string {
  const time = d.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const message = escapeHtml(d.message).replace(/\r?\n/g, "<br>");
  return `<!doctype html>
<html lang="vi"><body style="margin:0;padding:24px;background:#FCF9F2;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #EADFCF;border-radius:12px;overflow:hidden;">
    <div style="background:#8C3A21;color:#ffffff;padding:18px 22px;">
      <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.8;">Phong Triều</div>
      <div style="font-size:18px;font-weight:bold;margin-top:4px;">Khách hàng mới liên hệ</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Họ và tên", `<strong>${escapeHtml(d.name)}</strong>`)}
      ${row("Số điện thoại", escapeHtml(d.phone))}
      ${row("Email", d.email ? escapeHtml(d.email) : "<em style=\"color:#7A6458;\">Không cung cấp</em>")}
      ${row("Chủ đề", escapeHtml(d.topic))}
      ${row("Lời nhắn", message)}
      ${row("Thời gian", escapeHtml(time))}
    </table>
    <div style="padding:14px 22px;color:#7A6458;font-size:12px;">
      Email tự động từ website Phong Triều. Xem toàn bộ danh sách tại trang quản trị.
    </div>
  </div>
</body></html>`;
}

function buildText(d: ContactMailData): string {
  return [
    "Khách hàng mới liên hệ - Phong Triều",
    "",
    `Họ và tên: ${d.name}`,
    `Số điện thoại: ${d.phone}`,
    `Email: ${d.email || "Không cung cấp"}`,
    `Chủ đề: ${d.topic}`,
    `Lời nhắn: ${d.message}`,
    `Thời gian: ${d.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
  ].join("\n");
}

/**
 * Gửi email thông báo cho team Sale. KHÔNG bao giờ ném lỗi: trả về true nếu gửi thành công,
 * false nếu chưa cấu hình hoặc gửi thất bại (lỗi được ghi log, không chứa thông tin đăng nhập).
 */
export async function sendContactNotification(data: ContactMailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] Chưa cấu hình SMTP_EMAIL / SMTP_PASSWORD nên bỏ qua việc gửi email thông báo.");
    return false;
  }

  // Khách đang chờ phản hồi: không để email chậm kéo dài request quá SEND_TIMEOUT_MS
  const SEND_TIMEOUT_MS = 8000;
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const sending = transporter.sendMail({
      from: `"Website Phong Triều" <${process.env.SMTP_EMAIL!.trim()}>`,
      to: process.env.CONTACT_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_TO,
      // Chỉ đặt Reply-To khi email khách hợp lệ (đã được kiểm tra, không chứa ký tự xuống dòng)
      ...(data.email ? { replyTo: data.email } : {}),
      subject: SUBJECT,
      text: buildText(data),
      html: buildHtml(data),
    });
    sending.catch(() => undefined); // tránh "unhandled rejection" nếu hết giờ rồi mới lỗi
    await Promise.race([
      sending,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Hết thời gian chờ gửi email")), SEND_TIMEOUT_MS);
      }),
    ]);
    return true;
  } catch (error) {
    console.error("[mailer] Gửi email thông báo thất bại:", (error as Error).message);
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
