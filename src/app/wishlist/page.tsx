"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Products from "@/components/Product";
import { useAppContext } from "@/context";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { variations, fetchVariations, fetchWishlist, wishlist, wishlistDisplay, products } = useAppContext();

  useEffect(() => {
    if(products.length){
    if (session?.user?._id && loading) {
      Promise.all([
        fetchWishlist(session.user._id),
        fetchVariations()
      ]).then(() => {
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    }
  }
  }, [session, fetchWishlist, fetchVariations, loading, products]);

  // Check for authentication loading state
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Check for unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Please log in to view your wishlist</h2>
        <Link href="/auth/signin" className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md">
          Sign In
        </Link>
      </div>
    );
  }
  
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : wishlistDisplay?.length < 1 ? (
        <div className="flex flex-col items-center justify-center rounded-lg p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-xl font-medium mb-2">Your wishlist is empty</p>
          <p className=" mb-6">Items you save to your wishlist will appear here</p>
          <Link href="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="my-8">
          <Products products={wishlistDisplay} variations={variations} wishlist={true} />
        </div>
      )}
    </div>
  );
}