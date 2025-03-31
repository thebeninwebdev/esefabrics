'use client'

import { useEffect, useState } from "react";
import { HomeSlider } from "@/components/HomeSlider";
import Marquee from "react-fast-marquee"
import { TbChristmasTree } from "react-icons/tb";
import SizeChart from '@/components/SizeChart';
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useAppContext } from "@/context";
import Link from "next/link"
import { IProduct, IImage, CartItem, VariationInterface } from '@/app/types';

import {
  Sheet,
  SheetContent,
  SheetTitle
} from "@/components/ui/sheet"
import VariationModal from "@/components/VariationModal";
import Products from "@/components/Product";
import { CategoryCard, DiscoveryCard } from "@/components/CategoryCards";


export default function Home() {
  const {categories, fetchCategories, products, fetchProducts, addToCart, cart, fetchVariations, variations, removeFromCart, setIsCartSelection, drawerId, isDrawerOpen, setIsDrawerOpen, currentProduct, setCurrentProduct} = useAppContext()

  const [cleanHtml, setCleanHtml] = useState('');
  
  
  useEffect(() => {
    fetchCategories()
    fetchVariations()
    fetchProducts()
  },[])

  useEffect(() => {

    if(drawerId) setCurrentProduct(products.find((product:IProduct) => product._id === drawerId))
  },[drawerId])

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

  return (
    <main className="text-text dark:text-text-dark w-full">
      <div className="p-3 sm:p-5">
      <HomeSlider/>
      </div>
      
    <Marquee pauseOnHover className="py-6 bg-complement dark:bg-complement-dark text-2xl text-text-dark cursor-pointer ">
      <div className="flex gap-5">
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      </div>
    </Marquee>
    <div className="w-full p-4 ">
      <div className="lg:flex">
        <Carousel className="w-full">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-xl sm:text-2xl font-bold uppercase">Shop by Categories</h2>
            <div className="flex w-10 relative">
              <CarouselPrevious className=" h-8 w-8 dark:bg-background-dark" />
              <CarouselNext className="right-0 h-8 w-8 dark:bg-background-dark" />
            </div>
          </div>
        <div className="flex flex-col lg:flex-row gap-5">
        <CarouselContent className="-ml-4">
          {categories?.length && categories?.map((category:any) => (
            <CarouselItem key={category?._id} className="pl-4 md:basis-1/3">
              <CategoryCard 
                title={category?.category} 
                image={category?.link} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
<DiscoveryCard />
        </div>
      </Carousel>
    </div>
  </div>
  <div className=" mx-auto px-2 py-16 space-y-20">
      <h1 className="text-4xl font-bold text-center mb-6">Today's Top Picks</h1>
      <Products products={products} variations={variations} />
    </div>
    <VariationModal variationsArray={variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations} currentProduct={currentProduct} />
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
    <SheetTitle className="sr-only">Quick view</SheetTitle>
      <SheetContent className="space-y-5 p-0 bg-background dark:bg-background-dark overflow-y-auto text-text dark:text-text-dark">
        {currentProduct && (
          <>
            <div className="overflow-auto pt-8 w-full">
              <div className="flex w-max gap-3">
                {currentProduct.images?.map((image:IImage,index:number) => (
                  <div key={index} className="w-36 h-44 block bg-red-500 mt-8">
                    <img
                      src={image.url}
                      alt={image.id}
                      className="bg-gray-100 object-cover relative w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 space-y-4">
              <p className="max-w-sm">{currentProduct.name}</p>
              <div className="flex items-center gap-5">
                <span className="font-semibold text-md">
                  {Number(currentProduct.discountedPrice || 0).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  })}
                </span>
                <span className="text-gray-400 line-through text-sm text-md">
                  {Number(currentProduct.retailPrice || 0).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  })}
                </span>
                <span className="text-xs bg-primary dark:bg-primary-dark text-text-dark px-1 rounded-lg">
                  -{Math.round(((currentProduct.retailPrice - currentProduct.discountedPrice) / currentProduct.retailPrice) * 100)}%
                </span>
              </div>
              {currentProduct.description && (
                <div
                  className="prose dark:prose-invert max-w-none w-full break-words whitespace-normal text-text dark:text-text-dark h-72 overflow-auto"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'inherit',
                  }}
                  dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
              )}
            </div>
            <div className="py-5 px-3 space-y-5">
            {
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
                {variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.map((variation:any,idx:number) => (
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
                <Button 
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
                  }} className="w-full text-text-dark py-6">
                  Add to cart
                </Button>
              )}
              

              <div className="pt-10">
                <Link href="/" className="underline">View full details</Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
    </main>
  );
}