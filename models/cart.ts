import { Schema, model, models } from 'mongoose'
import { ICart } from '@/app/types';


// Define the Variant Schema
const VariantSchema = new Schema({
  reference_id: { type: String, required: true },
  variantType: { type: String, required: true },
  variant: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

// Define the CartItem Schema
const CartItemSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  variant: VariantSchema
});

// Define the Cart Schema
const CartSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
      set: function(val: number) {
        return parseFloat(val.toFixed(2));
      }
    }
  },
  { timestamps: true }
);

// Add a method to calculate the total price
CartSchema.pre('save', function(next) {
  const cart = this as ICart;
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

// Create and export the Cart model
const Cart = models.Cart || model<ICart>('Cart', CartSchema);

export default Cart;