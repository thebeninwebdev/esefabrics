import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IImage } from '@/app/types';

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  color: { type: String },
  size: { type: String },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    retailPrice: {type: Number, required: true},
    discountedPrice: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    categories: [{ type: String, required: true }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    images: [ImageSchema], // Array of images with optional color and size
    variants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);