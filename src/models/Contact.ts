import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  contact: string;
  topic: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Số điện thoại hoặc email liên hệ là bắt buộc"],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "Chủ đề liên hệ là bắt buộc"],
      default: "Tư vấn sản phẩm",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Nội dung lời nhắn là bắt buộc"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
