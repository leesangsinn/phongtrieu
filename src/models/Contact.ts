import mongoose, { Schema, Document, Model } from "mongoose";

export type ContactStatus = "new" | "contacted" | "resolved";

export interface IContact extends Document {
  name: string;
  /** SĐT khách để lại (bản ghi cũ chỉ có `contact`). */
  phone?: string;
  email?: string;
  /** Trường cũ "SĐT hoặc email" - giữ lại để các bản ghi trước đây vẫn hiển thị được. */
  contact?: string;
  topic: string;
  message: string;
  status: ContactStatus;
  /** true khi email thông báo cho team Sale đã gửi thành công. */
  emailSent: boolean;
  /** Ghi chú nội bộ của Sale (không hiển thị cho khách). */
  note?: string;
  /** Lần đầu tiên được đánh dấu "Đã liên hệ" (hoặc "Đã xử lý"). */
  contactedAt?: Date;
  /** Lần gần nhất đổi trạng thái. */
  statusUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    contact: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    topic: {
      type: String,
      required: [true, "Chủ đề liên hệ là bắt buộc"],
      default: "Tư vấn sản phẩm",
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, "Nội dung lời nhắn là bắt buộc"],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    contactedAt: {
      type: Date,
    },
    statusUpdatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Phục vụ sắp xếp "mới nhất trước" khi phân trang
ContactSchema.index({ createdAt: -1 });
// Phục vụ lọc theo trạng thái + đếm theo trạng thái
ContactSchema.index({ status: 1, createdAt: -1 });

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
