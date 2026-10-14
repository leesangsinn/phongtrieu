import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductLine = "Di Sản" | "Thanh Vị" | "Dưỡng Vị";
export type Volume = "500ml" | "300ml" | "100ml" | "60ml" | "30ml";

export interface IBatch extends Document {
  batchCode: string;
  productLine: ProductLine;
  volume: Volume;
  bottlingDate: Date;
  websiteUrl: string;
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema: Schema<IBatch> = new Schema(
  {
    batchCode: {
      type: String,
      required: [true, "Mã lô sản xuất là bắt buộc"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    productLine: {
      type: String,
      required: [true, "Dòng sản phẩm là bắt buộc"],
      enum: {
        values: ["Di Sản", "Thanh Vị", "Dưỡng Vị"],
        message: "{VALUE} không phải là dòng sản phẩm hợp lệ",
      },
    },
    volume: {
      type: String,
      required: [true, "Dung tích là bắt buộc"],
      enum: {
        values: ["500ml", "300ml", "100ml", "60ml", "30ml"],
        message: "{VALUE} không phải là dung tích hợp lệ",
      },
    },
    bottlingDate: {
      type: Date,
      required: [true, "Ngày đóng chai là bắt buộc"],
    },
    websiteUrl: {
      type: String,
      default: "https://phongtrieu.com",
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "0979425607",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model recompilation error in Next.js development HMR
export const Batch: Model<IBatch> =
  mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);

export default Batch;
