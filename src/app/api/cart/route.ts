import { NextRequest, NextResponse } from 'next/server';
import Cart from '../../../../models/cart';
import { connectMongoDB } from '../../../../utils/database';

// GET: Fetch a user's cart
export async function GET(req: NextRequest) {
  await connectMongoDB();
  
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cart = await Cart.findOne({ userId });
    return NextResponse.json(cart || { userId, items: [], totalPrice: 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Create or update a user's cart
export async function POST(req: NextRequest) {
  await connectMongoDB();

  try {
    const body = await req.json();
    const { userId, items } = body;

    if (!userId || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE: Clear a user's cart
export async function DELETE(req: NextRequest) {
  await connectMongoDB();

  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await Cart.findOneAndDelete({ userId });
    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
