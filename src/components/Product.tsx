'use client'

import React from 'react'
import { IProduct, CartItem, VariationInterface, IVariationArray, IVariantArray } from '@/app/types';
import { Trash } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react";
import { useAppContext } from '@/context';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLoading } from '@/context/LoadingContext';

export default function Products({products, variations, wishlist}: {products: IProduct[], variations: IVariationArray[], wishlist?:boolean}) {
  const {setDrawerId, setIsDrawerOpen, cart, removeFromCart, addToCart, setIsCartSelection, setCurrentProduct, removeFromWishlist} = useAppContext()
  const { data: session } = useSession();
  const {isLoading, setLoading} = useLoading()
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {products?.map((product:IProduct,idx:number) => (
          <Card key={idx} className="overflow-hidden border-2 rounded-md flex flex-col h-full bg-background dark:bg-background-dark ">
  <div className="relative">
    <img 
      src={product.images[0].url}
      alt={product.images[0].id} 
      className="w-full h-auto object-cover block hover:scale-110 transition-transform duration-1000 ease-in-out" 
    />
    {wishlist?
    <button className="absolute top-2 right-2 p-2 text-text-dark dark:text-text opacity-75 hover:opacity-100 bg-primary dark:bg-primary-dark rounded-full" onClick={() => {
      setLoading(true);
    removeFromWishlist(product._id, session?.user?._id)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
      }}>
        <Trash className="w-4 h-4 text-text-dark" />
      </button>
    
    :<button className="absolute top-2 right-2 p-2 text-text-dark dark:text-text opacity-75 hover:opacity-100 bg-primary dark:bg-primary-dark rounded-full" onClick={() => {
      setDrawerId(product._id as string)
      setIsDrawerOpen(true)
      }}>
        <Eye className="w-4 h-4 text-text-dark" />
      </button>
      }
  </div>
  <CardContent className="p-4 flex-grow flex flex-col justify-center space-y-2">
  <Link href={`/product-page/${product._id}`} className="text-sm font-normal line-clamp-2">
  {product.name}
</Link>
    <div className="flex items-center gap-5">
    <span className="font-semibold">
        {Number(product.discountedPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        })}
      </span>
      <span className="text-gray-400 line-through text-sm">
        {Number(product.retailPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        })}
      </span>
      
    </div>
  </CardContent>
  <CardFooter className="pt-0 px-4 mt-auto">
  {cart.find((item:CartItem) => item._id === product._id) ? (
                <div className="flex justify-between w-36 py-2 px-4 h-max text-2xl font-thin items-center text-text bg-neutral-300 rounded-md ">
                  <button onClick={() => {
                    if(variations?.find((variation) => variation?.reference_id === product?._id)?.variations?.length){
                      setCurrentProduct(product)
                      setIsCartSelection(true)
                    }else{
                      removeFromCart(product._id,'')}
                    }} className="">-</button>
                  <span className="text-lg font-normal">
                    {cart
  .filter((item: CartItem) => item._id === product._id)
  .reduce((sum:number, item:CartItem) => sum + (item.quantity || 0) + (item?.variant?.quantity || 0), 0)}
  </span>
                  <button onClick={() => {
                  if(variations?.find((variation) => variation?.reference_id === product?._id)?.variations?.length){
                    setCurrentProduct(product)
                    setIsCartSelection(true)
                  }else{
                    addToCart(
                    {
                      _id:product?._id,
                      title:product.name,
                      quantity:1,
                      price:product.discountedPrice,
                      image:product.images[0].url
                    }
                  )
                  }
                  }}>+</button>
                </div>
              ) : (
                <Button 
                onClick={() => {
                  if(variations?.find(
                    (variation) => variation?.reference_id == product?._id)?.variations?.length){
                    setCurrentProduct(product)
                    setIsCartSelection(true)
                  }else{
                    addToCart({
                      _id:product?._id,
                      title:product.name,
                      quantity:1,
                      price:product.discountedPrice, 
                      image:product.images[0].url
                    })
                  }
                  }} className="w-full text-text-dark py-6">
                  Add to cart
                </Button>
              )}
  </CardFooter>
</Card>

        ))}
    </div>
  )
}
