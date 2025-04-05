import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    addedAt: Date;
  }[];
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wishlist per user
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in development
const Wishlist = models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
