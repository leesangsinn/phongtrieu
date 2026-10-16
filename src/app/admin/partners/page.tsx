"use client";

import React, { useState, useEffect } from "react";
import { Handshake, RefreshCw, Phone, MapPin, Search } from "lucide-react";

interface PartnerItem {
  _id: string;
  name: string;
  phone: string;
  type: string;
  city: string;
  note?: string;
  status: "pending" | "contacted" | "partnered" | "rejected";
  createdAt: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads/partner", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPartners(data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải đối tác:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#7A0221]/10 text-[#7A0221] border border-[#7A0221]/15">
              <Handshake size={24} />
            </span>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#2C1A14]">
              Đối Tác &amp; Đại Lý Phân Phối
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#7A6458]">
            Danh sách các đơn vị đăng ký làm đại lý phân phối, cửa hàng và đối tác kinh doanh mắm Phong Triều.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6458]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, SĐT, tỉnh thành..."
              className="bg-white border border-[#E5D7C7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2C1A14] placeholder-[#7A6458]/70 focus:outline-none focus:ring-1 focus:ring-[#7A0221] w-52 md:w-64 transition"
            />
          </div>
          <button
            onClick={loadPartners}
            disabled={loading}
            className="p-2 bg-white hover:bg-[#F4ECE1] text-[#7A6458] hover:text-[#2C1A14] rounded-xl border border-[#E5D7C7] transition"
            title="Làm mới"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#7A0221]" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EADFCF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C1A14]">
            <thead className="bg-[#F8F3EA] text-[11px] uppercase tracking-wider text-[#7A6458] border-b border-[#EADFCF]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Đại Diện</th>
                <th scope="col" className="px-6 py-4 font-bold">Số Điện Thoại</th>
                <th scope="col" className="px-6 py-4 font-bold">Hình Thức Hợp Tác</th>
                <th scope="col" className="px-6 py-4 font-bold">Khu Vực</th>
                <th scope="col" className="px-6 py-4 font-bold">Ghi Chú Nhu Cầu</th>
                <th scope="col" className="px-6 py-4 font-bold">Thời Gian</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#7A6458]">
                    <RefreshCw size={24} className="animate-spin text-[#7A0221] mx-auto mb-2" />
                    Đang tải danh sách đối tác...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#7A6458]">
                    Chưa có đối tác đăng ký nào.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2C1A14]">{item.name}</td>
                    <td className="px-6 py-4 text-xs text-[#7A0221] font-mono font-semibold">
                      <a href={`tel:${item.phone}`} className="hover:underline flex items-center gap-1.5">
                        <Phone size={13} />
                        {item.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-[#F4ECE1] border border-[#E5D7C7] text-[#2C1A14] font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="flex items-center gap-1 text-[#2C1A14]">
                        <MapPin size={13} className="text-[#7A0221]" />
                        {item.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7A6458] max-w-xs break-words">
                      {item.note || <span className="italic text-[#A8988C]">Không có</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7A6458]">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Chờ liên hệ
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
