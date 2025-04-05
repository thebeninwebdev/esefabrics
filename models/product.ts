import mongoose,{Schema, models, model} from 'mongoose'
import { IProduct, IImage } from '@/app/types';

const ImageSchema = new Schema<IImage>({
  id: {type: String, required: true},
  url: { type: String, required: true }
});

const ProductSchema = new Schema<IProduct>(
  { name: { type: String, required: true },
    description: { type: String, required: true },
    retailPrice: {type: Number, required: true},
    discountedPrice: { type: Number, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    categories: [{ type: String, required: true }],
    images: [ImageSchema],},
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;