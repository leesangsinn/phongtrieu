import { MAX_QR_SCANS } from "@/lib/qr-config";
import type { KnowledgeChunk } from "@/lib/knowledge";

/**
 * Kiến thức chính thức về thương hiệu, sản phẩm, giá và cách đặt hàng cho chatbot, soạn từ tài liệu
 * thương hiệu do chủ dự án cung cấp. Khi cần đổi giá hoặc thông tin sản phẩm, sửa tại đây.
 *
 * Nguyên tắc: chỉ ghi điều đã được xác nhận. Các hạng mục mới là định hướng (IoT, trợ lý AI, QR gợi ý
 * thực đơn) được ghi rõ là dự kiến. Chưa có chính sách giao hàng, thanh toán, khuyến mãi hay hạn dùng
 * cụ thể (số tháng) nên bot không được tự nêu.
 */

type Price = { s100: string; s300: string; s500: string };

const LINES = [
  {
    name: "Di Sản",
    english: "Heritage",
    salt: "25°",
    focus: "Hương vị truyền thống, đậm đà. Hợp món chấm, món kho và tẩm ướp; hợp người yêu nước mắm truyền thống và khách mua quà biếu.",
    price: { s100: "43.000đ", s300: "98.000đ", s500: "149.000đ" } as Price,
  },
  {
    name: "Thanh Vị",
    english: "Daily",
    salt: "21° (giảm 16% độ mặn so với nguyên bản)",
    focus: "Dòng chủ lực dùng hằng ngày cho bữa ăn gia đình. Hương vị cân bằng, độ mặn thấp hơn Di Sản, dễ kết hợp khi nấu; hợp chấm, nêm nếm, kho, xào và tẩm ướp.",
    price: { s100: "52.000đ", s300: "116.000đ", s500: "179.000đ" } as Price,
  },
  {
    name: "Dưỡng Vị",
    english: "Care",
    salt: "19° (giảm 24% độ mặn so với nguyên bản)",
    focus: "Dòng có độ mặn thấp nhất trong ba dòng, dành cho người quan tâm điều chỉnh lượng muối trong chế độ ăn và chất lượng gia vị; hợp nấu ăn và dùng trong gia đình.",
    price: { s100: "56.000đ", s300: "131.000đ", s500: "199.000đ" } as Price,
  },
];

export function companyChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const add = (id: string, title: string, lines: string[]) => chunks.push({ id, title, text: lines.join("\n") });

  add("brand:gioi-thieu", "Giới thiệu thương hiệu nước mắm Phong Triều", [
    "Phong Triều là thương hiệu nước mắm truyền thống Việt Nam, gắn với vùng biển Nghệ An (câu chuyện bắt đầu từ vùng biển Quỳnh).",
    "Sản phẩm là nước mắm truyền thống làm từ cá cơm và muối, theo phương pháp ủ chượp truyền thống.",
    "Thông điệp: \"Gió đưa vị biển, quyện về vị quê\". Triết lý: \"Giữ gìn cốt vị, mở lối trải nghiệm\".",
    "Phong Triều có ba dòng nước mắm với ba mức độ mặn khác nhau: Di Sản, Thanh Vị và Dưỡng Vị, để phù hợp khẩu vị và nhu cầu khác nhau của gia đình Việt.",
    "Website: https://www.mamdisanphongtrieu.com. Hotline: 0979 425 607. Email: mamdisanphongtrieu@gmail.com.",
  ]);

  add("brand:cau-chuyen", "Câu chuyện, ý nghĩa tên gọi, tầm nhìn và sứ mệnh Phong Triều", [
    "Câu chuyện: vùng biển Quỳnh (Nghệ An), nơi người dân gắn với những chuyến thuyền ra khơi, mẻ cá cơm tươi và nghề làm nước mắm truyền thống. Cá cơm kết hợp muối biển miền Trung rồi ủ chượp tự nhiên; một giọt nước mắm ngon cần thời gian, sự kiên nhẫn và tâm huyết của người làm nghề.",
    "Ý nghĩa tên: \"Phong\" là gió biển, hành trình, sức sống bền bỉ của người miền biển. \"Triều\" là thủy triều, vòng tuần hoàn của biển và sự tiếp nối qua nhiều thế hệ làm nước mắm. Hợp lại là hành trình gìn giữ, tiếp nối và lan tỏa giá trị của biển cả và nghề nước mắm Việt Nam.",
    "Tầm nhìn: đến năm 2031 trở thành thương hiệu nước mắm di sản từ Nghệ An được nhận diện trên thị trường.",
    "Sứ mệnh: gìn giữ nghề làm nước mắm truyền thống Nghệ An và phát triển sản phẩm phù hợp nhu cầu hiện đại, qua hợp tác với người làm nghề, quản lý chất lượng có trách nhiệm, minh bạch thông tin và đổi mới có chọn lọc.",
    "Giá trị cốt lõi: tay nghề và tính chính trực; lấy khách hàng làm trung tâm; minh bạch trong vận hành; đổi mới có mục đích.",
  ]);

  add("brand:san-xuat", "Nhà máy, nơi sản xuất và đối tác sản xuất nước mắm Phong Triều ở đâu", [
    "Khu vực sản xuất: Quỳnh Phú, Nghệ An.",
    "Phong Triều hợp tác sản xuất độc quyền với đối tác làm nước mắm truyền thống tại Nghệ An. Đối tác phụ trách ủ chượp, lên men, hoàn thiện và đóng chai theo yêu cầu hai bên thống nhất.",
    "Phong Triều phụ trách nghiên cứu khẩu vị, định hướng ba dòng sản phẩm, yêu cầu về độ mặn, độ đạm và chất lượng, thiết kế bao bì, quản lý tiêu chuẩn chất lượng, phát triển thị trường và phân phối.",
  ]);

  for (const l of LINES) {
    add(`product:${l.name}`, `Nước mắm Phong Triều ${l.name} (${l.english} Line): độ mặn, độ đạm và giá`, [
      `Phong Triều ${l.name} (${l.english} Line). Chỉ số độ mặn: ${l.salt}. Độ đạm: 40°N.`,
      l.focus,
      `Giá tham khảo: 100ml ${l.price.s100}; 300ml ${l.price.s300}; 500ml ${l.price.s500}.`,
    ]);
  }

  add("product:so-sanh", "So sánh Di Sản, Thanh Vị, Dưỡng Vị và gợi ý chọn dòng", [
    "Cả ba dòng đều có độ đạm 40°N; khác nhau ở độ mặn và định hướng sử dụng.",
    ...LINES.map((l) => `- ${l.name} (${l.english}): độ mặn ${l.salt}. ${l.focus}`),
    "Thanh Vị mặn nhẹ hơn Di Sản; Dưỡng Vị có độ mặn thấp nhất.",
    "Gợi ý chọn: thích vị đậm đà truyền thống, chấm, kho, tẩm ướp, làm quà biếu thì chọn Di Sản. Nấu ăn gia đình hằng ngày thì chọn Thanh Vị. Muốn điều chỉnh lượng muối trong bữa ăn thì chọn Dưỡng Vị. Chưa biết hợp khẩu vị nào thì thử combo Khai Vị Phong Triều (3 chai 100ml).",
    "Đây là thông tin về độ mặn, không phải lời khuyên y tế; người có bệnh lý cần hỏi ý kiến bác sĩ.",
  ]);

  add("price:bang-gia", "Bảng giá nước mắm Phong Triều theo dung tích và combo (giá tham khảo)", [
    "Giá tham khảo của từng dòng:",
    ...LINES.map((l) => `- ${l.name}: 100ml ${l.price.s100}; 300ml ${l.price.s300}; 500ml ${l.price.s500}.`),
    "Combo:",
    "- Khai Vị Phong Triều (combo dùng thử): 139.000đ.",
    "- Di Sản Thượng Hạng (combo quà biếu): 369.000đ.",
    "- An Sức Khỏe (combo gia đình): 359.000đ.",
    "Đây là giá tham khảo; giá cuối cùng, phí giao hàng và ưu đãi (nếu có) do nhân viên xác nhận khi đặt hàng. Mua số lượng lớn hoặc cho doanh nghiệp: liên hệ hotline 0979 425 607.",
  ]);

  add("price:combo", "Các combo Khai Vị, Di Sản Thượng Hạng, An Sức Khỏe: thành phần và giá", [
    "- Khai Vị Phong Triều (Discovery Box, combo dùng thử): 1 chai Thanh Vị 100ml + 1 chai Dưỡng Vị 100ml + 1 chai Di Sản 100ml. Giá tham khảo 139.000đ. Giúp khách thử cả ba dòng để tìm khẩu vị phù hợp.",
    "- Di Sản Thượng Hạng (Gift Set, combo quà biếu): 1 chai Thanh Vị 500ml + 1 chai Di Sản 500ml + 1 chai Dưỡng Vị 100ml tặng kèm. Giá tham khảo 369.000đ. Hợp làm quà cho người thân, đối tác, doanh nghiệp, dịp lễ Tết.",
    "- An Sức Khỏe (combo gia đình): 1 chai Thanh Vị 500ml + 1 chai Dưỡng Vị 500ml. Giá tham khảo 359.000đ. Dành cho gia đình quan tâm điều chỉnh lượng muối trong bữa ăn. Dự kiến kèm mã QR gợi ý thực đơn và cẩm nang dùng gia vị hợp lý.",
  ]);

  add("product:nguyen-lieu", "Nguyên liệu nước mắm Phong Triều", [
    "Hai nguyên liệu chính: cá cơm tươi (gắn với vùng biển Nghệ An) và muối. Cá phối trộn với muối thành chượp để lên men và hình thành hương vị nước mắm.",
    "Tỷ lệ nguyên liệu cụ thể và công bố về phụ gia chưa được đăng tải; vui lòng đọc thành phần in trên nhãn chai hoặc hỏi hotline 0979 425 607.",
  ]);

  add("product:quy-trinh", "Quy trình sản xuất và thời gian ủ chượp nước mắm Phong Triều: ủ bao lâu", [
    "Nước mắm Phong Triều ủ bao lâu? Phong Triều định hướng sản xuất theo phương pháp ủ chượp truyền thống, lên men tự nhiên trong thời gian 18–24 tháng (thời gian ủ chượp, không phải hạn sử dụng).",
    "Các bước: 1) chọn nguyên liệu cá cơm và muối; 2) phối trộn cá và muối; 3) ủ chượp; 4) theo dõi, chăm sóc mẻ chượp; 5) thu nhận nước mắm; 6) kiểm tra chất lượng và chọn lô đạt tiêu chuẩn; 7) hoàn thiện, đóng chai, dán nhãn, quản lý theo mã lô; 8) lưu kho và phân phối.",
  ]);

  add("product:cach-dung", "Cách dùng nước mắm Phong Triều", [
    "Chấm trực tiếp hoặc pha nước chấm với chanh, tỏi, ớt, đường, nước tùy khẩu vị; hợp thịt luộc, rau luộc, cá hấp, nem rán và nhiều món Việt.",
    "Nêm nếm canh, xào, kho; tẩm ướp thịt, cá trước khi chế biến; làm cá kho, thịt kho.",
    "Chọn theo nhu cầu: Di Sản cho người thích vị truyền thống đậm đà; Thanh Vị cho nấu ăn hằng ngày; Dưỡng Vị cho người muốn dòng có độ mặn thấp hơn.",
  ]);

  add("product:bao-quan-han-dung", "Bảo quản nước mắm và hạn sử dụng", [
    "Bảo quản: để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp và nguồn nhiệt; đóng kín nắp sau mỗi lần dùng; hạn chế để nước hoặc nguyên liệu khác lọt vào chai.",
    "Hạn sử dụng: xem thông tin in trên nhãn/bao bì của từng chai (ngày sản xuất, hạn sử dụng, mã lô). Phong Triều chưa công bố một con số thời hạn chung bằng tháng, nên bot không nêu số tháng cụ thể và hướng khách đọc nhãn hoặc hỏi hotline 0979 425 607.",
    "Hệ thống QR động của Phong Triều hướng tới cho xem thông tin theo mã lô như ngày đóng chai và hạn sử dụng; thông tin hiển thị tùy hệ thống đã triển khai.",
  ]);

  add("qr:xac-thuc", "Kiểm tra hàng chính hãng bằng mã QR trên tem", [
    "Mỗi sản phẩm Phong Triều có một tem mã QR riêng để xác thực hàng chính hãng.",
    "Cách kiểm tra: dùng camera điện thoại quét mã QR trên tem, hoặc vào trang Xác thực (/xac-thuc) và nhập mã định danh in trên tem.",
    `Mỗi mã chỉ được xác thực thành công tối đa ${MAX_QR_SCANS} lần.`,
    "Lần quét đầu tiên báo xác thực thành công là dấu hiệu tốt. Những lần sau hệ thống báo mã đã được quét bao nhiêu lần.",
    `Nếu mã báo đã quét tối đa ${MAX_QR_SCANS} lần ngay ở lần đầu bạn quét, sản phẩm có thể không phải hàng chính hãng hoặc mã tem đã bị sao chép. Hãy giữ lại sản phẩm và tem, liên hệ hotline 0979 425 607.`,
    "Nếu hệ thống báo mã không tồn tại trong hệ thống chính hãng, đó là cảnh báo: không nên tin sản phẩm đó là của Phong Triều, và nên báo cho hotline 0979 425 607.",
    "Bot không tra cứu hay xác thực mã giúp khách. Khách tự quét hoặc nhập mã ở trang Xác thực để có kết quả chính xác.",
  ]);

  add("tech:dinh-huong", "Công nghệ Phong Triều: QR truy xuất, IoT, trợ lý AI (định hướng)", [
    "Dynamic QR Code truy xuất nguồn gốc: kết nối thông tin sản phẩm với mã lô. Thông tin dự kiến tra cứu: tên sản phẩm, nguyên liệu, nguồn gốc, quy trình, mã lô, ngày đóng chai, hạn sử dụng, hướng dẫn sử dụng và bảo quản.",
    "IoT theo dõi ủ chượp (nhiệt độ, pH, dữ liệu mẻ chượp) và trợ lý ẩm thực AI trên website (tư vấn sản phẩm, gợi ý món ăn, công thức) là KẾ HOẠCH/ĐỊNH HƯỚNG phát triển. Chưa xác nhận đã triển khai nên không được nói là đã có.",
  ]);

  add("contact:dat-hang", "Cách đặt hàng, hợp tác đại lý và liên hệ tư vấn", [
    "Đặt hàng, mua số lượng lớn, quà tặng doanh nghiệp, hợp tác đại lý: để lại họ tên và số điện thoại trong khung chat để nhân viên gọi lại, hoặc gọi hotline 0979 425 607, hoặc gửi lời nhắn ở trang Liên hệ (/lien-he).",
    "Đại lý, điểm bán: trang Đại lý (/dai-ly). Email: mamdisanphongtrieu@gmail.com.",
    "Phí giao hàng, thời gian giao, hình thức thanh toán và khuyến mãi chưa có thông tin công khai; nhân viên sẽ xác nhận khi liên hệ.",
  ]);

  return chunks;
}
