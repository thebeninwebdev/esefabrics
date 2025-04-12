"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context';
import { CartItem, IProduct, VariationInterface } from '../types';
import VariationModal from '@/components/VariationModal';
import { useSession } from 'next-auth/react';
import { ShoppingCart as ShoppingCartIcon, VariableIcon } from "lucide-react"

export default function CartPage() {
  const {cart, clearFromCart, variations, fetchProducts, fetchVariations, removeFromCart, setIsCartSelection, addToCart, products, currentProduct, setCurrentProduct} = useAppContext()
  const {data:session} = useSession()
  const [productId, setProductId] = useState("")

  useEffect(() => {
    fetchVariations()
    fetchProducts()
  },[])

  useEffect(() => {
    if(productId && products) setCurrentProduct(products.find((product:IProduct) => product._id === productId))
  },[productId])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className='bg-primary text-text-dark text-center py-14 text-2xl mb-10'>
        <h1 className="text-3xl font-bold mb-6">Shopping cart</h1>
      </div>
      
      {productId.length > 0 && <VariationModal
       variationsArray={variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations} currentProduct={currentProduct as IProduct}
        />}
      {cart.length > 0 ? (
        <>
          {/* Desktop view - Cart table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 border-b pb-4 mb-4 font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>
          
          {/* Cart items */}
          {cart?.map((item:CartItem) => {
            let productCheck = products.find((product:IProduct) => product._id === item._id);
            let variationCheck = variations.find((variation:any) => 
            variation?.reference_id === productCheck._id
            )

  // Determine if the product details have changed
  const titleChanged = productCheck && productCheck.name !== item.title;
  const priceChanged = 
  productCheck && item?.variant ? variationCheck?.variations.find((variation:any) => variation?.subVariant[0] === (item?.variant as {variant:string}).variant)?.discountedPrice !== item?.price :productCheck.discountedPrice !== item?.price;
  const isChanged = titleChanged || priceChanged;

  // Use the updated values if they have changed
  const displayTitle = titleChanged ? productCheck?.title : item.title;
  const displayPrice = priceChanged ? productCheck?.discountedPrice : item?.price;

            return(
              <div key={item?.variant?.reference_id || item?._id}>
<div className="mb-6">
              {/* Desktop view */}
              <div className="hidden md:grid grid-cols-12 gap-4 border-b py-6 items-center">
                {/* Product details */}
                <div className="col-span-6 flex">
                  <div className="w-20 h-24 relative mr-4 bg-gray-100">
                    <img 
                      src={item?.image} 
                      alt={displayTitle}
                      className="rounded"
                    />
                  </div>
                  <div>
                  <Link href={`/product-page/${item?._id}`}>
              <h3 className="font-medium flex items-center gap-2">
                {displayTitle}
                {isChanged && (
                  <span className="ml-2 px-2 py-1 bg-yellow-300 text-xs rounded">
                    Updated
                  </span>
                )}
              </h3>
            </Link>
                    <p className="text-gray-500 text-sm mb-2">{item?.variant ? item.variant.variant : ""}</p>
                    <button 
                      onClick={() => clearFromCart(item?._id,item?.variant ? item?.variant.variant : "")}
                      className="text-gray-500 dark:text-text-dark text-sm underline hover:text-black dark:hover:text-primary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {/* Price */}
        <div className="col-span-2 text-center">
          {Number(displayPrice || 0).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
          })}
          {priceChanged && (
            <div className="text-xs text-yellow-600 mt-1">(Price updated)</div>
          )}
        </div>
                
                {/* Quantity */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center">
                    <div className="flex justify-between w-36 py-2 px-4 h-max text-2xl font-thin items-center text-text bg-neutral-300 rounded-md">
                      <button onClick={() => {
                        if(variations?.find((variation:VariationInterface) => variation?.reference_id === item?._id)?.variations?.length > 0){
                          setIsCartSelection(true)
                          setProductId(item?._id)
                        }else{
                          removeFromCart(item?._id,'')}
                        }} className="">-</button>
                      <span className="text-lg font-normal">
                      {
                        item?.variant ? item?.variant?.quantity:
                        item?.quantity}
                        </span>
                      <button 
                        onClick={() => {
                          if(variations?.find((variation:VariationInterface) => variation?.reference_id === item?._id)?.variations?.length > 0){
                            setIsCartSelection(true)
                            setProductId(item?._id)
                          }else{
                            addToCart({
                              _id:item?._id,
                              title:item?.title,
                              quantity:1,
                              price:item?.price,
                              image:item?.image
                            })
                          }
                        }}>+</button>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className="col-span-2 text-center font-medium">
                {Number((item?.price || 0) * ((item?.quantity || 0) + (item?.variant?.quantity || 0))).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    })}
                </div>
              </div>

              {/* Mobile view - Card style */}
              <div className="md:hidden border rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex mb-4">
                  <div className="w-20 h-24 relative mr-4 bg-gray-100">
                    <img 
                      src={item?.image} 
                      alt={item?.title}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <Link href={`/product-page/${item?._id}`}><h3 className="font-medium">{item?.title}</h3></Link>
                    <p className="text-gray-500 text-sm mb-1">{item?.variant ? item.variant.variant : ""}</p>
                    <p className="font-medium mb-1">
                      {Number(item?.price || 0).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex justify-between w-28 py-1 px-3 text-xl font-thin items-center text-text bg-neutral-300 rounded-md">
                      <button onClick={() => {
                        if(variations?.find((variation:VariationInterface) => variation?.reference_id === item?._id)?.variations?.length > 0){
                          setIsCartSelection(true)
                          setProductId(item?._id)
                        }else{
                          removeFromCart(item?._id,'')}
                        }} className="">-</button>
                      <span className="text-base font-normal">
                        {
                        item?.variant ? item?.variant?.quantity:
                        item?.quantity}
                      </span>
                      <button 
                        onClick={() => {
                          if(variations?.find((variation:VariationInterface) => variation?.reference_id === item?._id)?.variations?.length > 0){
                            setIsCartSelection(true)
                            setProductId(item?._id)
                          }else{
                            addToCart({
                              _id:item?._id,
                              title:item?.title,
                              quantity:1,
                              price:item?.price,
                              image:item?.image
                            })
                          }
                        }}>+</button>
                    </div>
                  </div>
                  <div className="font-medium">
                    Total: {Number((item?.price || 0) * ((item?.quantity || 0) + (item?.variant?.quantity || 0))).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <button 
                    onClick={() => clearFromCart(item?._id,item?.variant ? item?.variant.reference_id : "")}
                    className="text-gray-500 dark:text-text-dark text-sm underline hover:text-black dark:hover:text-primary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            
            
              </div>
            )
})}
<div className='w-full flex justify-center'>
            <Link className='bg-primary text-text-dark px-10 rounded-md py-2 hover:opacity-90 flex gap-1 hover:scale-105 transition-transform duration-300 ease-in-out' href="/checkout" >Checkout<ShoppingCartIcon/></Link>
            </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="mb-6">Add items to your cart to continue shopping</p>
          <Link href="/" className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}