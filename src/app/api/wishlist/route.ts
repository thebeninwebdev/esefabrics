import { NextResponse } from "next/server";
import Wishlist from "../../../../models/wishlist";
import Product from "../../../../models/product";
import { connectMongoDB } from "../../../../utils/database";
import { Types } from "mongoose";

// GET - Get a user's wishlist
export async function GET(req: Request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid or missing userId" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");

    return NextResponse.json(wishlist || { products: [] });
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ message: "Failed to fetch wishlist" }, { status: 500 });
  }
}

// POST - Add a product to wishlist
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: "userId and productId are required" }, { status: 400 });
    }

    // Check if product already exists in wishlist
    const existingWishlist = await Wishlist.findOne({ userId });

    if (existingWishlist) {
      const isDuplicate = existingWishlist.products.some(
        (item: { productId: string }) => item.productId.toString() === productId
      );

      if (isDuplicate) {
        return NextResponse.json({ message: "Product already in wishlist" }, { status: 409 });
      }
    }

    // Add product to wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          products: { productId },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json({ message: "Failed to add product to wishlist" }, { status: 500 });
  }
}

// DELETE - Remove a product from wishlist
export async function DELETE(req: Request) {
  try {
    await connectMongoDB();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: "userId and productId are required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: { productId },
        },
      },
      { new: true }
    );

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return NextResponse.json({ message: "Failed to remove product from wishlist" }, { status: 500 });
  }
}
