import { posts } from "@/lib/news";
import type { Block } from "@/lib/news";
import { companyChunks } from "@/lib/knowledge-company";

/**
 * Kho kiến thức của chatbot: lấy từ cùng dữ liệu với trang Tin tức (src/data/news-posts.json,
 * sinh từ src/tintuc.txt bằng `npm run news`), cắt thành các đoạn nhỏ rồi tìm đoạn liên quan
 * bằng BM25. Không dùng embedding nên không tốn thêm lệnh gọi API và hoạt động tức thì.
 */

export interface KnowledgeChunk {
  id: string;
  title: string; // "Tên bài — Tiêu đề mục"
  text: string;
  slug?: string; // bài viết nguồn (để hiển thị liên kết)
  articleTitle?: string;
}

export interface SearchHit {
  chunk: KnowledgeChunk;
  score: number;
}

const MAX_CHUNK_CHARS = 1600;

/** Thông tin chung luôn được đưa vào ngữ cảnh. Chỉ ghi những gì đã được xác nhận trên website. */
export const COMPANY_FACTS = [
  "Phong Triều là thương hiệu nước mắm truyền thống gắn với vùng biển Nghệ An.",
  "Ba dòng sản phẩm: Di Sản, Thanh Vị, Dưỡng Vị. Xem thông tin tại trang Sản phẩm (/san-pham).",
  "Hotline: 0979 425 607. Email: mamdisanphongtrieu@gmail.com.",
  "Gửi lời nhắn cho đội ngũ tại trang Liên hệ (/lien-he). Tìm điểm bán hoặc đăng ký làm đại lý tại trang Đại lý (/dai-ly).",
  "Địa chỉ doanh nghiệp: đang cập nhật.",
].join("\n");

// ───────────────── Chuẩn hóa & tách từ ─────────────────

export function normalize(text: string): string {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Từ nối phổ biến không mang nghĩa tìm kiếm. Loại bỏ TRƯỚC khi bỏ dấu để không nhầm
// "độ" (độ đạm) với "do", "có" với "cô"... Người gõ không dấu chỉ bị loại các từ không mơ hồ.
const STOP_ACCENTED = new Set(
  (
    "là và của có cho để với một những các này đó được khi như thế nào gì thì mà ở từ đến trong ngoài " +
    "về cũng nên cần phải sẽ đã đang bị rất hơn không nhiều ít mỗi mọi người mình bạn tôi em anh chị " +
    "xin vui lòng giúp hãy ơi nhé nha hả vậy sao ai đâu bao nhiêu làm"
  ).split(" ")
);
const STOP_UNACCENTED_SAFE = new Set(
  "la va cua cho voi nhung cac nay duoc nhu nao gi thi nen can phai se rat khong nhieu moi nhe nha vay sao".split(" ")
);

export function tokenize(text: string): string[] {
  const words: string[] = [];
  for (const raw of text.toLowerCase().normalize("NFC").split(/[^0-9a-z\u00c0-\u024f\u1e00-\u1eff]+/)) {
    if (raw.length < 2) continue;
    const plain = normalize(raw);
    const hasMarks = plain !== raw;
    if (STOP_ACCENTED.has(raw) || (!hasMarks && STOP_UNACCENTED_SAFE.has(raw))) continue;
    words.push(plain);
  }
  const grams: string[] = [...words];
  for (let i = 0; i < words.length - 1; i++) grams.push(`${words[i]}_${words[i + 1]}`);
  return grams;
}

// ───────────────── Cắt bài viết thành đoạn ─────────────────

function blockToText(b: Block): string {
  switch (b.t) {
    case "ul":
    case "ol":
      return b.items.map((i) => `- ${i}`).join("\n");
    case "table": {
      const rows = b.rows.map((r) => r.map((cell, i) => `${b.head[i] ?? ""}: ${cell}`).join("; "));
      return rows.join("\n");
    }
    case "h3":
      return `\n${b.text}`;
    default:
      return b.text;
  }
}

function splitLong(title: string, text: string, base: Omit<KnowledgeChunk, "id" | "title" | "text">, id: string) {
  const out: KnowledgeChunk[] = [];
  const parts = text.split(/\n{1,}/);
  let buf = "";
  let n = 0;
  const flush = () => {
    if (buf.trim()) out.push({ ...base, id: `${id}#${n++}`, title, text: buf.trim() });
    buf = "";
  };
  for (const p of parts) {
    if ((buf + "\n" + p).length > MAX_CHUNK_CHARS && buf) flush();
    buf += (buf ? "\n" : "") + p;
  }
  flush();
  return out;
}

export function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const post of posts) {
    // Gom block theo mục h2; phần trước h2 đầu tiên là phần mở đầu
    const sections: { heading: string; blocks: Block[] }[] = [{ heading: "Mở đầu", blocks: [] }];
    for (const b of post.blocks) {
      if (b.t === "h2") sections.push({ heading: b.text, blocks: [] });
      else sections[sections.length - 1].blocks.push(b);
    }

    sections.forEach((sec, i) => {
      const text = sec.blocks.map(blockToText).join("\n").trim();
      if (!text) return;
      chunks.push(
        ...splitLong(
          `${post.title} — ${sec.heading}`,
          text,
          { slug: post.slug, articleTitle: post.title },
          `${post.slug}:${i}`
        )
      );
    });
  }
  chunks.push(...companyChunks());
  return chunks;
}

// ───────────────── Chỉ mục BM25 ─────────────────

interface Index {
  chunks: KnowledgeChunk[];
  tf: Map<string, number>[];
  len: number[];
  df: Map<string, number>;
  avgLen: number;
}

let cached: Index | null = null;

function getIndex(): Index {
  if (cached) return cached;
  const chunks = buildChunks();
  const tf: Map<string, number>[] = [];
  const len: number[] = [];
  const df = new Map<string, number>();

  for (const c of chunks) {
    // Tiêu đề được tính hai lần để các từ trong tiêu đề có trọng số cao hơn
    const tokens = [...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.text)];
    const m = new Map<string, number>();
    for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1);
    tf.push(m);
    len.push(tokens.length);
    m.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1));
  }
  const avgLen = len.reduce((a, b) => a + b, 0) / Math.max(1, len.length);
  cached = { chunks, tf, len, df, avgLen };
  return cached;
}

const K1 = 1.4;
const B = 0.75;

export function search(query: string, k = 5): SearchHit[] {
  const idx = getIndex();
  const q = tokenize(query);
  if (!q.length) return [];
  const N = idx.chunks.length;
  const hits: SearchHit[] = [];

  for (let i = 0; i < N; i++) {
    let score = 0;
    for (const term of q) {
      const f = idx.tf[i].get(term);
      if (!f) continue;
      const n = idx.df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      // Cụm hai từ (bigram) khớp là tín hiệu mạnh hơn từ đơn
      const weight = term.includes("_") ? 1.6 : 1;
      score += weight * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * idx.len[i]) / idx.avgLen)));
    }
    if (score > 0) hits.push({ chunk: idx.chunks[i], score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, k);
}

/** Điểm tối thiểu để coi là "có liên quan" (đã hiệu chỉnh trên dữ liệu thật, xem phần kiểm thử). */
export const MIN_RELEVANT_SCORE = 8;

export function chunkCount(): number {
  return getIndex().chunks.length;
}
