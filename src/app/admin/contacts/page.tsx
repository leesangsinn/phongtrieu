"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, RefreshCw, Search } from "lucide-react";

interface ContactItem {
  _id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads/contact", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải liên hệ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#8A2E1B]/10 text-[#8A2E1B] border border-[#8A2E1B]/15">
              <MessageSquare size={24} />
            </span>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#2C1A14]">
              Khách Hàng Liên Hệ
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#7A6458]">
            Danh sách tin nhắn, câu hỏi và phản hồi của khách hàng gửi qua biểu mẫu liên hệ trên Website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6458]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, sđt..."
              className="bg-white border border-[#E5D7C7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2C1A14] placeholder-[#7A6458]/70 focus:outline-none focus:ring-1 focus:ring-[#8A2E1B] w-52 md:w-64 transition"
            />
          </div>
          <button
            onClick={loadContacts}
            disabled={loading}
            className="p-2 bg-white hover:bg-[#F4ECE1] text-[#7A6458] hover:text-[#2C1A14] rounded-xl border border-[#E5D7C7] transition"
            title="Làm mới"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#8A2E1B]" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EADFCF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C1A14]">
            <thead className="bg-[#F8F3EA] text-[11px] uppercase tracking-wider text-[#7A6458] border-b border-[#EADFCF]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Khách Hàng</th>
                <th scope="col" className="px-6 py-4 font-bold">Thông Tin Liên Hệ</th>
                <th scope="col" className="px-6 py-4 font-bold">Chủ Đề</th>
                <th scope="col" className="px-6 py-4 font-bold">Nội Dung</th>
                <th scope="col" className="px-6 py-4 font-bold">Thời Gian</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A6458]">
                    <RefreshCw size={24} className="animate-spin text-[#8A2E1B] mx-auto mb-2" />
                    Đang tải danh sách liên hệ...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A6458]">
                    Chưa có liên hệ nào từ khách hàng.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2C1A14]">{item.name}</td>
                    <td className="px-6 py-4 text-xs text-[#8A2E1B] font-mono font-semibold">{item.contact}</td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="px-2.5 py-1 rounded-full bg-[#F4ECE1] border border-[#E5D7C7] text-[#2C1A14]">
                        {item.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7A6458] max-w-xs break-words">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7A6458]">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Mới
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
