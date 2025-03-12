import mongoose,{Schema, models} from 'mongoose'
import { IProduct, IImage } from '@/app/types';

const ImageSchema = new Schema<IImage>({
  id: {type: String, required: true},
  url: { type: String, required: true },
  color: String,
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    retailPrice: {type: Number, required: true},
    discountedPrice: { type: Number, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    categories: [{ type: String, required: true }],
    images: [ImageSchema], // Array of images with optional color and size
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product