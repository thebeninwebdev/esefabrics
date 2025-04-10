import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../utils/database";
import Order from "../../../../../models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../utils/authOptions";

// GET - Fetch all orders (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const allOrders = await Order.find()

    return NextResponse.json(allOrders, { status: 200 });
  } catch (error) {
    console.error("[ALL_ORDERS_GET]", error);
    return NextResponse.json({ message: "Failed to fetch all orders" }, { status: 500 });
  }
}
