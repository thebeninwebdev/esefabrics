import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../utils/database";
import Order from "../../../../models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";

// POST - Create a New Order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const { products, totalAmount, shippingAddress } = await req.json();

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No products provided" }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ message: "Invalid total amount" }, { status: 400 });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.address) {
      return NextResponse.json({ message: "Incomplete shipping address" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId: session.user._id,
      products,
      totalAmount,
      shippingAddress,
      status: "paid",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("[ORDER_POST]", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}

// GET - Get All Orders for the Logged-In User
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const orders = await Order.find({ userId: session.user._id }).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
