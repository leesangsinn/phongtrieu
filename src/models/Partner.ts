import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartner extends Document {
  name: string;
  phone: string;
  type: string;
  city: string;
  note?: string;
  status: "pending" | "contacted" | "partnered" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema<IPartner> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ tên người đăng ký là bắt buộc"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Hình thức hợp tác là bắt buộc"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Tỉnh/Thành phố kinh doanh là bắt buộc"],
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "partnered", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);

export default Partner;
