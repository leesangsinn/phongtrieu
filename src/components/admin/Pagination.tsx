"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

/** Dãy số trang gọn: luôn có trang đầu, cuối và 1 trang mỗi bên trang hiện tại, dùng "…" cho khoảng trống. */
export function getPageItems(page: number, totalPages: number): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("ellipsis-start");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("ellipsis-end");
  items.push(totalPages);
  return items;
}

export default function Pagination({ page, totalPages, total, limit, onChange, disabled }: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const base =
    "min-w-9 h-9 px-3 rounded-xl text-xs font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-3 border-t border-[#EADFCF] bg-[#FBF8F2] px-6 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs text-[#7A6458]">
        Hiển thị <strong className="text-[#2C1A14]">{from}–{to}</strong> trên{" "}
        <strong className="text-[#2C1A14]">{total}</strong> bản ghi
      </p>

      <nav aria-label="Phân trang" className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={disabled || page <= 1}
          className={`${base} inline-flex items-center gap-1 border-[#E5D7C7] bg-white text-[#2C1A14] hover:bg-[#F4ECE1]`}
        >
          <ChevronLeft size={14} />
          Trang trước
        </button>

        {getPageItems(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <span key={item} className="px-1 text-xs text-[#7A6458]" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              disabled={disabled}
              aria-current={item === page ? "page" : undefined}
              className={`${base} ${
                item === page
                  ? "border-[#8C3A21] bg-[#8C3A21] text-white"
                  : "border-[#E5D7C7] bg-white text-[#2C1A14] hover:bg-[#F4ECE1]"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={disabled || page >= totalPages}
          className={`${base} inline-flex items-center gap-1 border-[#E5D7C7] bg-white text-[#2C1A14] hover:bg-[#F4ECE1]`}
        >
          Trang tiếp
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
}
