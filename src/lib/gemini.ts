/**
 * Gọi Gemini qua REST (generateContent), không cần cài thêm thư viện.
 * Khóa API chỉ đọc ở phía máy chủ từ GEMINI_API_KEY (không bao giờ dùng biến NEXT_PUBLIC_*).
 */

const API_BASE = process.env.GEMINI_API_BASE?.replace(/\/+$/, "") || "https://generativelanguage.googleapis.com/v1beta";

// Model mặc định: nhanh, rẻ, hợp hỏi đáp có tài liệu. Có thể đổi bằng GEMINI_MODEL.
// "gemini-flash-latest" là bí danh luôn trỏ tới bản Flash mới nhất, dùng làm phương án dự phòng
// khi model chính bị gỡ hoặc tài khoản chưa có quyền dùng.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-flash-latest";

const REQUEST_TIMEOUT_MS = 20000;

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export type GeminiErrorKind = "not_configured" | "rate_limited" | "blocked" | "empty" | "upstream";

export class GeminiError extends Error {
  constructor(
    public kind: GeminiErrorKind,
    message: string
  ) {
    super(message);
  }
}

interface GenerateInput {
  system: string;
  history: ChatTurn[];
  question: string;
}

function modelList(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return primary === FALLBACK_MODEL ? [primary] : [primary, FALLBACK_MODEL];
}

async function callModel(model: string, apiKey: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Trả về văn bản câu trả lời, hoặc ném GeminiError với phân loại lỗi (không chứa khóa API). */
export async function generateAnswer({ system, history, question }: GenerateInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiError("not_configured", "Thiếu GEMINI_API_KEY");

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [
      ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      { role: "user", parts: [{ text: question }] },
    ],
    generationConfig: {
      temperature: 0.3,
      // Dư địa cho cả các model có "suy nghĩ" mặc định (token suy nghĩ cũng tính vào giới hạn này)
      maxOutputTokens: 1500,
    },
  };

  let lastStatus = 0;
  for (const model of modelList()) {
    let res: Response;
    try {
      res = await callModel(model, apiKey, body);
    } catch (e) {
      // Hết giờ hoặc lỗi mạng: thử model dự phòng một lần nữa
      lastStatus = 0;
      console.error(`[gemini] ${model}: ${(e as Error).name === "AbortError" ? "hết thời gian chờ" : (e as Error).message}`);
      continue;
    }

    lastStatus = res.status;

    if (res.status === 429) throw new GeminiError("rate_limited", "Gemini báo quá giới hạn lượt gọi");
    if (res.status === 404 || res.status === 400 || res.status === 403) {
      // Model không tồn tại / không có quyền / tham số không hợp lệ: thử model dự phòng
      const detail = (await res.text().catch(() => "")).slice(0, 200).replace(/key=[^&\s"]+/gi, "key=***");
      console.error(`[gemini] ${model}: HTTP ${res.status} ${detail}`);
      continue;
    }
    if (!res.ok) {
      console.error(`[gemini] ${model}: HTTP ${res.status}`);
      continue;
    }

    const data = (await res.json().catch(() => null)) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    } | null;

    if (data?.promptFeedback?.blockReason) {
      throw new GeminiError("blocked", `Nội dung bị chặn: ${data.promptFeedback.blockReason}`);
    }

    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    // Bỏ các phần "thought" (tóm tắt suy nghĩ) nếu model trả kèm
    const text = parts
      .filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      if (data?.candidates?.[0]?.finishReason === "SAFETY") throw new GeminiError("blocked", "Câu trả lời bị chặn bởi bộ lọc an toàn");
      throw new GeminiError("empty", "Model không trả về nội dung");
    }
    return text;
  }

  throw new GeminiError("upstream", `Không gọi được Gemini (HTTP ${lastStatus || "mạng/timeout"})`);
}
