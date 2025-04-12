import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../utils/database";
import User from "../../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";

// GET - Fetch all users (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const allUsers = await User.find()

    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error("[ALL_USERS_GET]", error);
    return NextResponse.json({ message: "Failed to fetch all users" }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Connect to database
    await connectMongoDB();

    // Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find user by ID from session
    const user = await User.findById(session.user._id).select('-password'); // exclude sensitive fields

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
