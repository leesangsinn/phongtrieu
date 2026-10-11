"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

const field =
  "w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/40";

export default function StoreLocator() {
  const [searched, setSearched] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <label>
          <span className="sr-only">Tỉnh / Thành phố</span>
          <input name="province" className={field} placeholder="Tỉnh / Thành phố" autoComplete="address-level1" />
        </label>
        <label>
          <span className="sr-only">Quận / Huyện</span>
          <input name="district" className={field} placeholder="Quận / Huyện" autoComplete="address-level2" />
        </label>
        <label>
          <span className="sr-only">Tên cửa hàng</span>
          <input name="store" className={field} placeholder="Tên cửa hàng" />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-secondary"
        >
          <Search size={16} />
          Tìm điểm bán
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-white/70 px-6 py-10 text-center" aria-live="polite">
        <MapPin size={30} strokeWidth={1.25} className="mx-auto mb-3 text-primary/60" aria-hidden />
        {searched ? (
          <>
            <p className="font-playfair text-lg text-foreground">Chưa có điểm bán nào để hiển thị.</p>
            <p className="mt-2 text-sm">
              Danh sách điểm bán chính thức đang được cập nhật. Bạn có thể{" "}
              <Link href="/lien-he" className="font-semibold text-primary underline underline-offset-4">
                liên hệ Phong Triều
              </Link>{" "}
              hoặc gọi <a href="tel:0979425607" className="font-semibold text-primary">0979 425 607</a> để được hướng dẫn nơi mua hàng chính hãng.
            </p>
          </>
        ) : (
          <p className="text-sm">Danh sách điểm bán chính thức sẽ được cập nhật liên tục. Hãy nhập khu vực để tra cứu.</p>
        )}
      </div>
    </div>
  );
}
