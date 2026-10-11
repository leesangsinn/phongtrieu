"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Fish, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/lib/products";

const filters = ["Tất cả", ...products.map((p) => p.name)];
const sorts = [
  { value: "default", label: "Mặc định" },
  { value: "name", label: "Tên A–Z" },
];

export default function ProductExplorer() {
  const [active, setActive] = useState("Tất cả");
  const [sort, setSort] = useState("default");

  const list = useMemo(() => {
    const filtered = active === "Tất cả" ? products : products.filter((p) => p.name === active);
    return sort === "name"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, "vi"))
      : filtered;
  }, [active, sort]);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Lọc sản phẩm">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
                active === f
                  ? "bg-accent-primary text-white shadow-sm"
                  : "bg-white text-foreground hover:text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-text-muted">
          Sắp xếp:
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer appearance-none rounded-full bg-white py-2 pl-4 pr-9 font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </span>
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {list.map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col overflow-hidden rounded-3xl bg-white/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-brand"
          >
            <div className={cn("relative aspect-[4/3.4] bg-gradient-to-br", p.panel)}>
              {p.featured && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-accent-primary px-3 py-1 text-xs font-medium text-white">
                  Sản phẩm nổi bật
                </span>
              )}
              <Leaf
                size={64}
                strokeWidth={1}
                className="absolute bottom-3 left-4 -rotate-12 text-primary/15"
                aria-hidden
              />
              <Fish
                size={44}
                strokeWidth={1}
                className="absolute right-5 top-6 rotate-12 text-primary/15"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-3 top-6">
                <Image
                  src={p.image}
                  alt={`Nước mắm Phong Triều ${p.name}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 25vw"
                  className="object-contain drop-shadow-[0_14px_16px_rgba(44,26,20,0.2)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-playfair text-2xl font-bold text-foreground">{p.name}</h3>
              <p className="mt-2 text-sm font-medium text-foreground">{p.subtitle}</p>
              <p className="mt-3 text-sm">{p.description}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check size={14} className="text-accent-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/lien-he"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Xem chi tiết <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
