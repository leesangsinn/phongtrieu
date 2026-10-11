"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, featured, type Category } from "@/lib/news-meta";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  group: Category;
  image: string;
  readMinutes: number;
};

const PAGE_SIZE = 6;
const filters = ["Tất cả", ...categories];

const normalize = (s: string) =>
  s
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export default function NewsExplorer({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = normalize(query.trim());
  const searching = q.length > 0;

  const list = useMemo(
    () =>
      posts.filter(
        (p) =>
          (active === "Tất cả" || p.group === active) &&
          (!q || normalize(`${p.title} ${p.excerpt}`).includes(q))
      ),
    [posts, active, q]
  );

  // Bài nổi bật chỉ hiện khi xem "Tất cả" hoặc nhóm chứa bài đó và không đang tìm kiếm
  const showFeatured = !searching && (active === "Tất cả" || active === featured.category);
  const grid = showFeatured ? list.filter((p) => p.slug !== featured.slug) : list;
  const shown = grid.slice(0, visible);

  return (
    <div>
      {/* Lọc & tìm kiếm */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Lọc bài viết">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              onClick={() => {
                setActive(f);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors duration-300",
                active === f
                  ? "bg-accent-primary text-white shadow-sm"
                  : "bg-white text-text-muted hover:text-accent-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="relative w-full sm:w-72">
          <span className="sr-only">Tìm kiếm bài viết</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Tìm kiếm bài viết..."
            className="w-full rounded-full border border-primary/10 bg-white py-2.5 pl-5 pr-11 text-sm text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/40"
          />
          <Search size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
        </label>
      </div>

      {/* Bài nổi bật */}
      {showFeatured && (
        <Link
          href={`/tin-tuc/${featured.slug}`}
          className="group mb-8 grid overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-brand lg:grid-cols-2"
        >
          <div className="relative min-h-[240px] overflow-hidden lg:min-h-[320px]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col p-8 md:p-10">
            <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {featured.category}
            </span>
            <h2 className="font-playfair text-2xl leading-snug text-foreground md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 flex-1">{featured.excerpt}</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-text-muted">{featured.date}</span>
              <span className="inline-flex items-center gap-2 font-medium text-primary">
                Đọc thêm <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Lưới bài viết */}
      {shown.length === 0 ? (
        <p className="py-16 text-center">Chưa có bài viết phù hợp. Hãy thử từ khóa hoặc chủ đề khác.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {shown.map((p) => (
            <article key={p.slug} className="group rounded-3xl bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand">
              <Link href={`/tin-tuc/${p.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 pb-3 pt-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {p.group}
                  </span>
                  <h3 className="mt-2 font-playfair text-xl font-bold leading-snug text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-text-muted">
                      <Clock size={14} /> {p.readMinutes} phút đọc
                    </span>
                    <span className="inline-flex items-center gap-2 font-medium text-primary">
                      Đọc thêm <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {grid.length > visible && (
        <div className="mt-12 text-center">
          <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
            Xem thêm bài viết
          </button>
        </div>
      )}
    </div>
  );
}
