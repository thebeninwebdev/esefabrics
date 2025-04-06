import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../utils/database";
import Product from "../../../../models/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 });
    }

    await connectMongoDB();

    // Create a case-insensitive regex for the search query
    const searchRegex = new RegExp(query, 'i');

    // Search in name, brand, and categories
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { categories: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json({ message: "Failed to search products" }, { status: 500 });
  }
} 