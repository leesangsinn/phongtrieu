import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import type { QueryFilter } from "mongoose";
import { Contact, type ContactStatus, type IContact } from "@/models/Contact";
import { requireAdmin } from "@/lib/require-admin";
import { sendContactNotification } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const TOPICS = ["Tư vấn sản phẩm", "Hợp tác kinh doanh", "Góp ý và phản hồi"];
const DEFAULT_TOPIC = TOPICS[0];

const LIMITS = { name: 100, email: 254, message: 2000 };
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const MAX_SEARCH_LENGTH = 100;

const NO_STORE = { "Cache-Control": "no-store" };
const STATUSES = ["new", "contacted", "resolved"] as const;

/** Chuỗi một dòng: bỏ ký tự điều khiển (chặn chèn header email), gộp khoảng trắng. */
function singleLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

/** Chuỗi nhiều dòng: giữ xuống dòng, bỏ các ký tự điều khiển khác. */
function multiLine(value: unknown): string {
  return typeof value === "string"
    ? value
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
        .trim()
    : "";
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^[0-9+().\s-]{8,20}$/.test(phone) && digits.length >= 8 && digits.length <= 15;
}

function isValidEmail(email: string): boolean {
  return email.length <= LIMITS.email && /^[^\s@<>"',;:()\[\]\\]+@[^\s@<>"',;:()\[\]\\]+\.[^\s@<>"',;:()\[\]\\]+$/.test(email);
}

function fail(message: string, status: number, extra?: HeadersInit) {
  return NextResponse.json({ success: false, message }, { status, headers: { ...NO_STORE, ...extra } });
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Khách điền form ở trang Liên hệ: lưu MongoDB, rồi gửi email thông báo cho team Sale. */
export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`contact:${clientIp(req)}`, { max: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) {
      return fail("Bạn đã gửi quá nhiều lời nhắn. Vui lòng thử lại sau ít phút.", 429, {
        "Retry-After": String(limit.retryAfter),
      });
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return fail("Dữ liệu gửi lên không hợp lệ.", 400);
    }

    // Ô ẩn "website": người thật không điền, bot thì có. Giả vờ thành công, không lưu, không gửi mail.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json(
        { success: true, message: "Cảm ơn bạn đã liên hệ với Phong Triều. Chúng tôi sẽ phản hồi sớm nhất!" },
        { status: 201, headers: NO_STORE }
      );
    }

    // Chấp nhận fullName (theo yêu cầu) hoặc name (tương thích form cũ)
    const name = singleLine(body.fullName ?? body.name);
    const phone = singleLine(body.phone);
    const email = singleLine(body.email).toLowerCase();
    const message = multiLine(body.message);
    const requestedTopic = singleLine(body.topic);
    const topic = TOPICS.includes(requestedTopic) ? requestedTopic : DEFAULT_TOPIC;

    if (!name || !phone || !message) {
      return fail("Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung lời nhắn.", 400);
    }
    if (name.length > LIMITS.name) {
      return fail(`Họ tên tối đa ${LIMITS.name} ký tự.`, 400);
    }
    if (!isValidPhone(phone)) {
      return fail("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.", 400);
    }
    if (email && !isValidEmail(email)) {
      return fail("Email không hợp lệ. Vui lòng kiểm tra lại hoặc để trống.", 400);
    }
    if (message.length > LIMITS.message) {
      return fail(`Lời nhắn tối đa ${LIMITS.message} ký tự.`, 400);
    }

    await connectDB();

    // 1) Lưu vào cơ sở dữ liệu TRƯỚC: dữ liệu khách không bao giờ mất dù gửi email lỗi
    const saved = await Contact.create({
      name,
      phone,
      ...(email ? { email } : {}),
      // Giữ trường cũ "contact" để tương thích với dữ liệu và công cụ cũ
      contact: email ? `${phone} | ${email}` : phone,
      topic,
      message,
      status: "new",
      emailSent: false,
    });

    // 2) Gửi email thông báo; hàm không ném lỗi nên khách luôn nhận phản hồi thành công
    const emailSent = await sendContactNotification({
      name,
      phone,
      email: email || undefined,
      topic,
      message,
      createdAt: saved.createdAt ?? new Date(),
    });

    if (emailSent) {
      await Contact.updateOne({ _id: saved._id }, { $set: { emailSent: true } }).catch((e: Error) =>
        console.error("Không cập nhật được cờ emailSent:", e.message)
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn đã liên hệ với Phong Triều. Chúng tôi sẽ phản hồi sớm nhất!",
        data: { id: String(saved._id) },
      },
      { status: 201, headers: NO_STORE }
    );
  } catch (error: unknown) {
    console.error("Lỗi khi lưu thông tin liên hệ:", error);
    return fail("Đã xảy ra lỗi máy chủ khi gửi lời nhắn. Vui lòng thử lại sau.", 500);
  }
}

/** Danh sách khách hàng liên hệ cho trang quản trị, có phân trang (?page=&limit=&q=). */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const params = req.nextUrl.searchParams;

    const pageParam = parseInt(params.get("page") ?? "", 10);
    const limitParam = parseInt(params.get("limit") ?? "", 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    // Tìm kiếm tùy chọn (thoát ký tự regex để người dùng không chèn được biểu thức)
    const q = singleLine(params.get("q") ?? "").slice(0, MAX_SEARCH_LENGTH);
    const searchFilter = q
      ? {
          $or: ["name", "phone", "email", "contact", "topic"].map((field) => ({
            [field]: { $regex: escapeRegex(q), $options: "i" },
          })),
        }
      : {};

    // Lọc theo trạng thái xử lý (new = chưa liên hệ); giá trị lạ bị bỏ qua
    const statusParam = params.get("status") ?? "";
    const status = (STATUSES as readonly string[]).includes(statusParam) ? (statusParam as ContactStatus) : null;
    // "new" cũng gồm bản ghi rất cũ chưa có trường status (khớp với cách đếm bên dưới)
    const filter: QueryFilter<IContact> = status
      ? { ...searchFilter, status: status === "new" ? { $in: ["new", null] } : status }
      : searchFilter;

    await connectDB();

    const [contacts, total, grouped] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1, _id: -1 }) // _id làm khóa phụ để thứ tự ổn định khi trùng thời gian
        .skip(skip)
        .limit(limit)
        .select("name phone email contact topic message status emailSent note contactedAt statusUpdatedAt createdAt")
        .lean(),
      Contact.countDocuments(filter),
      // Số lượng theo từng trạng thái (có áp dụng ô tìm kiếm, không áp dụng bộ lọc trạng thái)
      Contact.aggregate<{ _id: string; n: number }>([
        { $match: searchFilter },
        { $group: { _id: "$status", n: { $sum: 1 } } },
      ]),
    ]);

    const counts = { all: 0, new: 0, contacted: 0, resolved: 0 };
    for (const g of grouped) {
      const key = (STATUSES as readonly string[]).includes(g._id) ? (g._id as (typeof STATUSES)[number]) : "new";
      counts[key] += g.n;
      counts.all += g.n;
    }

    return NextResponse.json(
      {
        success: true,
        data: contacts,
        counts,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
      { headers: NO_STORE }
    );
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách liên hệ:", error);
    return fail("Đã xảy ra lỗi máy chủ khi tải danh sách liên hệ.", 500);
  }
}
