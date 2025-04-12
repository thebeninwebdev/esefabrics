import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../utils/database";
import Product from "../../../../../models/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "An id is required" }, { status: 400 });
    }

    await connectMongoDB();

    // Search in name, brand, and categories
    const product = await Product.findById(id)

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json({ message: "Failed to search products" }, { status: 500 });
  }
} 