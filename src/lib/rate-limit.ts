/**
 * Giới hạn tần suất đơn giản theo khóa (thường là IP), lưu trong bộ nhớ của từng instance.
 * Trên serverless (Vercel) đây chỉ là lớp chặn cơ bản chống gửi rác hàng loạt; cần giới hạn
 * ở tầng hạ tầng nếu muốn chặt hơn.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_KEYS = 5000;

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Dọn bớt khi map phình to để không rò rỉ bộ nhớ
  if (buckets.size > MAX_KEYS) {
    buckets.forEach((v, k) => {
      if (v.resetAt <= now) buckets.delete(k);
    });
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > max) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
