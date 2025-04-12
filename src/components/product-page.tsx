'use client'

import { useAppContext } from '@/context'
import React, {useState, useEffect} from 'react'
import { IProduct, VariationInterface, CartItem } from '@/app/types'
import {Heart, Share2, Truck, Ship, Undo2} from "lucide-react"
import ProductCarousel from '@/components/ProductCarousel'
import VariationModal from '@/components/VariationModal'
import SizeChart from '@/components/SizeChart';
import {useSession} from "next-auth/react"
import Link from "next/link"
import { toast } from 'sonner'
import { useLoading } from '@/context/LoadingContext'
import { useRouter } from 'next/navigation'


export default function ProductComponent({resolvedParams}:any) {
    const {products, fetchProducts, variations, setIsCartSelection, removeFromCart, addToCart, cart, fetchVariations} = useAppContext()
    const {isLoading, setLoading} = useLoading();
    const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct)
    const [cleanHtml, setCleanHtml] = useState('');
    const [copied, setCopied] = useState(false);
    const [customText, setCustomText] = useState('Share');
      const {data:session} = useSession()
      const router = useRouter()
  
    const userId = session?.user?._id
  
    const copyToClipboard = async () => {
      // Get the full URL (base URL + current path)
      const fullUrl = window.location.origin + window.location.pathname;
      
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        
        // Reset the "Copied" state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy URL: ', err);
      }
    };
  
    useEffect(() => {
      fetchProducts()
      fetchVariations()
    },[])
  
    useEffect(() => {
      const product = products?.find((product:IProduct) => product._id === resolvedParams)
      setCurrentProduct(product)
    },[products, resolvedParams])
  
    useEffect(() => {
      (async () => {
        const DOMPurify = (await import('dompurify')).default;
  
        // Strip background color
        DOMPurify.removeAllHooks();
        DOMPurify.addHook('uponSanitizeElement', (node) => {
          // Narrow the type to Element
          if (node instanceof Element && node.hasAttribute('style')) {
            node.removeAttribute('style');
          }
        });
  
        const clean = DOMPurify.sanitize(currentProduct?.description, {
          USE_PROFILES: { html: true },
        });
        setCleanHtml(clean);
      })();
    }, [currentProduct?.description]);
  
    const addToWishlist = async (userId: string, productId: string): Promise<{ success: boolean; message: string }> => {
        if(!session?.user) router.push("/auth/login")
      try {
        setLoading(true)
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        });
    
        if (!res.ok) {
          const error = await res.json();
          toast.error(error.message || "Failed to add to wishlist")
          return { success: false, message: error.message || "Failed to add to wishlist" };
          
        }
        toast.success("Product added to wishlist")
        return { success: true, message: "Product added to wishlist" };
      } catch (error) {
        toast.error("addToWishlist error:" + error)
        return { success: false, message: "Something went wrong" };
      }finally{
        setLoading(false)
      }
    };
  return (
    <div className='pt-10 max-w-7xl w-full mx-auto'>
                {currentProduct && (
          <div className="md:grid grid-cols-2">
            {currentProduct?.images && currentProduct.images.length > 0 && (
              <ProductCarousel images={currentProduct.images} />
            )}
            
              <div className="overflow-y-auto">
              <VariationModal variationsArray={variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations} currentProduct={currentProduct} />
              <div className="px-3 space-y-4">
              <p className="max-w-2xl w-full text-xl lg:text-3xl">{currentProduct.name}</p>
              <div className="flex items-center gap-5">
                <span className="text-3xl">
                {Number(currentProduct.discountedPrice || 0).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  })}
                </span>
                <span className="text-gray-400 line-through text-lg">
                  {Number(currentProduct.retailPrice || 0).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  })}
                </span>
                <span className="text-xs bg-primary dark:bg-primary-dark text-text-dark rounded-2xl px-3 py-1">
                  {Math.round(((currentProduct.retailPrice - currentProduct.discountedPrice) / currentProduct.retailPrice) * 100)}% OFF
                </span>
              </div>
              
            </div>
            <div className="py-5 px-3 space-y-5">
            {variations &&
                variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id) &&
<div className="">
                <div className="flex justify-between">
                  <div className="flex w-full">
                    <div className="flex justify-between w-full">
                      <p>Variations Available:</p>
                      <SizeChart />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                {variations && variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.map((variation:any,idx:number) => (
                  <div key={idx} onClick={() => setIsCartSelection(true)} className="py-1 px-3 rounded-md border-primary border-2 dark:bg-primary-dark dark:text-text-dark text-text w-max">
                    {variation?.subVariant}
                  </div>
                ))}
                </div>
              </div>
                
              }
              
              {cart.find((item:CartItem) => item._id === currentProduct._id) ? (
                <div className="flex justify-between w-36 py-2 px-4 h-max text-2xl font-thin items-center text-text bg-neutral-300 rounded-md ">
                  <button onClick={() => {
                    if(variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.length > 0){
                      setIsCartSelection(true)
                    }else{
                      removeFromCart(currentProduct._id,'')}
                    }} className="">-</button>
                  <span className="text-lg font-normal">{cart
  .filter((item: CartItem) => item._id === currentProduct._id)
  .reduce((sum:number, item:CartItem) => sum + item.quantity, 0)}</span>
                  <button onClick={() => {
                  if(variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.length > 0){
                    setIsCartSelection(true)
                  }else{
                    addToCart({
                      _id:currentProduct?._id,
                      title:currentProduct.name,
                      quantity:1,
                      price:currentProduct.discountedPrice,
                      image:currentProduct.images[0].url
                    })
                  }
                  }}>+</button>
                </div>
              ) : (
                <div className="flex gap-5">
                <button
                onClick={() => {
                  if(variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.length > 0){
                    setIsCartSelection(true)
                  }else{
                    addToCart({
                      _id:currentProduct?._id,
                      title:currentProduct.name,
                      quantity:1,
                      price:currentProduct.discountedPrice,
                      image:currentProduct.images[0].url
                    })
                  }
                  }}
                className="relative overflow-hidden group bg-black dark:bg-primary-dark text-white px-6 py-3 rounded-md flex items-center justify-center font-semibold text-base transition duration-300 w-full">
  <span className="relative z-10">Add to cart</span>
  <div className="absolute inset-0 translate-x-full bg-gradient-to-l from-white/0 via-white/40 to-white/0 group-hover:translate-x-[-200%] transition-transform duration-1000 ease-in-out"></div>
                </button>
<div onClick={() => addToWishlist(userId as string, currentProduct._id as string)} className='cursor-pointer hover:text-primary transition-all duration-300'><Heart className="w-10 h-10"/></div>
</div>
              )}
              <div className='flex w-max gap-10'>
                <button onClick={() => copyToClipboard()} className="flex gap-2">
                <Share2/>
                <span>{copied ? 'Copied!' : customText || 'Share'}</span>
                </button>
                <Link href="/delivery-return">
                <div className="flex gap-3">
                <Truck/>
                <span>Delivery & Return</span>
               </div>
               </Link>
              </div>
              <div className="border-2 flex flex-col items-center py-8 gap-5">
              <Undo2/>
              <p className="max-w-lg text-center">
                Return within 30 days of purchase. Duties & taxes are non-refundable.
              </p>
              </div>
              <div className="border-2 flex flex-col items-center py-8 gap-5">
              <Ship/>
              <p className="max-w-lg text-center">Estimate delivery time 3-6 business days(Benin city)</p>
              </div>
            </div>
              </div>
            
          </div>
        )}

    </div>
  )
}
