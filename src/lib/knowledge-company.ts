import { products, giftSets } from "@/lib/products";
import { MAX_QR_SCANS } from "@/lib/qr-config";
import type { KnowledgeChunk } from "@/lib/knowledge";

/**
 * Kiến thức về sản phẩm, mã QR chống giả và cách liên hệ/đặt hàng, ghép vào kho kiến thức của chatbot.
 * Chỉ ghi những gì có thật trong dữ liệu website (products.ts, hệ thống QR). Chưa có giá niêm yết,
 * chính sách giao hàng hay địa chỉ nên bot phải chuyển khách sang hotline thay vì tự nêu.
 */
export function companyChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const p of products) {
    chunks.push({
      id: `product:${p.slug}`,
      title: `Sản phẩm nước mắm ${p.name}`,
      text: [
        `Nước mắm Phong Triều ${p.name}. ${p.subtitle}.`,
        p.description,
        `Điểm nổi bật: ${p.features.join("; ")}.`,
        `Xem chi tiết tại trang Sản phẩm (/san-pham). Giá bán và quy cách chai: vui lòng liên hệ hotline 0979 425 607.`,
      ].join("\n"),
    });
  }

  chunks.push({
    id: "product:chon-dong",
    title: "Tư vấn chọn dòng nước mắm Di Sản, Thanh Vị hay Dưỡng Vị",
    text: [
      "So sánh ba dòng sản phẩm của Phong Triều:",
      ...products.map((p) => `- ${p.name}: ${p.subtitle}. ${p.features.join("; ")}.`),
      "Gợi ý chọn: khách thích vị đậm đà truyền thống, dùng để chấm hoặc nêm nếm đậm thì chọn Di Sản.",
      "Gia đình muốn ăn nhạt hơn, giảm lượng muối trong bữa cơm hằng ngày thì cân nhắc Thanh Vị (giảm 16% độ mặn) hoặc Dưỡng Vị (giảm 24% độ mặn).",
      "Dưỡng Vị giảm mặn nhiều hơn Thanh Vị. Đây là thông tin về độ mặn, không phải lời khuyên y tế; ai có bệnh lý cần hỏi ý kiến bác sĩ.",
      "Muốn thử cả ba dòng: bộ quà Khai Vị Phong Triều.",
    ].join("\n"),
  });

  chunks.push({
    id: "product:qua-tang",
    title: "Bộ quà tặng nước mắm Phong Triều",
    text: [
      "Phong Triều có các bộ quà tặng:",
      ...giftSets.map((g) => `- ${g.name}: ${g.description}`),
      "Giá và cách đặt quà tặng: liên hệ hotline 0979 425 607 hoặc để lại thông tin ở trang Liên hệ.",
    ].join("\n"),
  });

  chunks.push({
    id: "qr:xac-thuc",
    title: "Kiểm tra hàng chính hãng bằng mã QR trên tem",
    text: [
      "Mỗi sản phẩm Phong Triều có một tem mã QR riêng để xác thực hàng chính hãng.",
      "Cách kiểm tra: dùng camera điện thoại quét mã QR trên tem, hoặc vào trang Xác thực (/xac-thuc) và nhập mã định danh in trên tem.",
      `Mỗi mã chỉ được xác thực thành công tối đa ${MAX_QR_SCANS} lần.`,
      "Lần quét đầu tiên báo xác thực thành công là dấu hiệu tốt. Những lần sau hệ thống báo mã đã được quét bao nhiêu lần.",
      `Nếu mã báo đã quét tối đa ${MAX_QR_SCANS} lần ngay ở lần đầu bạn quét, sản phẩm có thể không phải hàng chính hãng hoặc mã tem đã bị sao chép. Hãy giữ lại sản phẩm và tem, liên hệ hotline 0979 425 607.`,
      "Nếu hệ thống báo mã không tồn tại trong hệ thống chính hãng, đó là cảnh báo: không nên tin sản phẩm đó là của Phong Triều, và nên báo cho hotline 0979 425 607.",
      "Bot không tra cứu hay xác thực mã giúp khách. Khách tự quét hoặc nhập mã ở trang Xác thực để có kết quả chính xác.",
    ].join("\n"),
  });

  chunks.push({
    id: "contact:dat-hang",
    title: "Cách đặt hàng, xin báo giá và hợp tác đại lý",
    text: [
      "Đặt hàng, xin báo giá, mua số lượng lớn hoặc quà tặng doanh nghiệp: gọi hotline 0979 425 607, hoặc để lại họ tên và số điện thoại để đội ngũ gọi lại.",
      "Khách có thể để lại thông tin ngay trong khung chat này, hoặc gửi lời nhắn ở trang Liên hệ (/lien-he).",
      "Muốn làm đại lý hoặc tìm điểm bán: trang Đại lý (/dai-ly).",
      "Hiện chưa có thông tin công khai về giá niêm yết, phí giao hàng hay thời gian giao; những nội dung này do nhân viên xác nhận khi liên hệ.",
    ].join("\n"),
  });

  return chunks;
}
