import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  products: {
    productId: Types.ObjectId;
    quantity: number;
    variant: string
  }[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        variant: String
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
