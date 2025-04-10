import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../utils/database";
import Visitor from "../../../../../models/visitor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../utils/authOptions";

// GET - Fetch all visitors (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const allVisitors = await Visitor.find()

    return NextResponse.json(allVisitors, { status: 200 });
  } catch (error) {
    console.error("[ALL_VISITORS_GET]", error);
    return NextResponse.json({ message: "Failed to fetch all visitors" }, { status: 500 });
  }
}
