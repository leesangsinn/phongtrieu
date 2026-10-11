import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { type Block, headingId, posts } from "@/lib/news";

// Các cụm CTA trong nội dung nguồn -> liên kết tới trang sản phẩm
const CTA = /(Xem thông tin sản phẩm|Xem thông tin nước mắm Phong Triều)/g;
const URL_RE = /(https?:\/\/[^\s]+)/g;

function inline(text: string): ReactNode {
  return text.split(CTA).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href="/san-pham" className="font-semibold text-primary underline underline-offset-4">
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

// "Nhãn: nội dung" -> in đậm nhãn ngắn ở đầu mục
function labelled(text: string): ReactNode {
  const m = text.match(/^([^.:?]{3,36}): (.+)$/);
  if (!m) return inline(text);
  return (
    <>
      <strong className="font-semibold text-foreground">{m[1]}:</strong> {inline(m[2])}
    </>
  );
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} id={headingId(b.text)} className="scroll-mt-28">
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "note":
            return (
              <p key={i} className="rounded-2xl bg-surface px-5 py-4 text-[0.95em]">
                {labelled(b.text)}
              </p>
            );
          case "formula":
            return (
              <p key={i} className="rounded-2xl border border-primary/15 bg-white px-5 py-3 text-center font-playfair italic text-foreground">
                {b.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{labelled(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it.replace(/^Bước \d+:\s*/, ""))}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="not-prose my-8 overflow-x-auto rounded-2xl border border-primary/10 bg-white">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-surface text-foreground">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="border-t border-primary/10">
                        {r.map((c, ci) => (
                          <td key={ci} className={ci === 0 ? "px-4 py-3 font-medium text-foreground" : "px-4 py-3 text-text-muted"}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

/** Danh sách "Gợi ý đọc thêm": khớp tiêu đề với bài trong hệ thống để tạo liên kết */
export function RelatedLinks({ titles }: { titles: string[] }) {
  if (!titles.length) return null;
  return (
    <ul>
      {titles.map((t) => {
        const target = posts.find((p) => headingId(p.title) === headingId(t));
        return (
          <li key={t}>
            {target ? (
              <Link href={`/tin-tuc/${target.slug}`} className="text-primary underline underline-offset-4">
                {t}
              </Link>
            ) : (
              t
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function References({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2 text-sm">
      {items.map((r) => (
        <li key={r} className="break-words">
          {r.split(URL_RE).map((part, i) =>
            i % 2 === 1 ? (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
                {part}
              </a>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            )
          )}
        </li>
      ))}
    </ul>
  );
}
