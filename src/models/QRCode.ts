import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IBatch } from "./Batch";

export interface IQRCode extends Document {
  codeId: string;
  batchId: Types.ObjectId | IBatch;
  scanCount: number;
  isScanned: boolean;
  firstScannedAt?: Date;
  lastScannedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema: Schema<IQRCode> = new Schema(
  {
    codeId: {
      type: String,
      required: [true, "Mã định danh QR là bắt buộc"],
      unique: true,
      index: true,
      trim: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "ID lô hàng là bắt buộc"],
      index: true,
    },
    scanCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isScanned: {
      type: Boolean,
      default: false,
      index: true,
    },
    firstScannedAt: {
      type: Date,
    },
    lastScannedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const QRCode: Model<IQRCode> =
  mongoose.models.QRCode || mongoose.model<IQRCode>("QRCode", QRCodeSchema);

export default QRCode;
