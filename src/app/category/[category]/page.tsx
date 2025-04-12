'use client'

import React, {useState, useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { useAppContext } from '@/context';
import { Eye } from "lucide-react";
import SizeChart from '@/components/SizeChart';
import Link from 'next/link';
import Products from '@/components/Product';
import {
    Sheet,
    SheetContent,
    SheetTitle
  } from "@/components/ui/sheet"
  import { Variant } from "@/components/Variant";
  import { IProduct, IImage, GroupedVariant, CartItem } from '@/app/types';
  import { groupVariants } from "@/lib/utils";
  import { VariationInterface } from '@/app/types';
  import VariationModal from '@/components/VariationModal';

export default function CategoryPage({params}: {params: Promise<{category: string}>}) {
  const {fetchCategories, products, fetchProducts, addToCart, removeFromCart, cart, variants, variations, setIsCartSelection,drawerId,isDrawerOpen, setIsDrawerOpen, currentProduct, setCurrentProduct} = useAppContext()
  const resolvedParams = React.use(params);
  const [cleanHtml, setCleanHtml] = useState('');
  const [groupedArray, setGroupedArray] = useState<GroupedVariant[]>([] as GroupedVariant[])
        
      
        useEffect(() => {
          fetchCategories()
          fetchProducts()
        },[])
      
        useEffect(() => {
          if(currentProduct?.description && variations){
            setGroupedArray(groupVariants(variations.find((variation:any) => variation?.reference_id === currentProduct?._id)?.variations))
          }
        },[currentProduct, variations])
      
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

      if(products?.find((product:any) => product?.categories?.includes(resolvedParams.category))) {
        return ( 
        <main> 
          <div className=" mx-auto px-2 py-16 space-y-20">
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">{resolvedParams.category}</h1>
           
      <Products products={products} variations={variations} />
      {variations?.length > 0 && <VariationModal variationsArray={variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations} currentProduct={currentProduct} />}
</div>
<Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
    <SheetTitle className="sr-only">Quick view</SheetTitle>
      <SheetContent className="space-y-5 p-0 bg-background dark:bg-background-dark overflow-y-auto text-text dark:text-text-dark">
        <div className="overflow-auto pt-8 w-full">
        <div className="flex w-max gap-3">
        {drawerId && currentProduct?.images?.map((image:IImage,index:number) => (
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
        <p className="max-w-sm">{currentProduct?.name}</p>
        <div className="flex items-center gap-5">
    <span className="font-semibold text-md">
        {Number(currentProduct.discountedPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        })}
      </span>
      <span className="text-gray-400 line-through text-sm text-md">
        {Number(currentProduct.retailPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        })}
      </span>
      <span className="text-xs bg-primary dark:bg-primary-dark text-text-dark px-1 rounded-lg">-{Math.round(((currentProduct?.retailPrice - currentProduct?.discountedPrice) / currentProduct?.retailPrice) * 100)}%
      </span>

    </div>
    {currentProduct?.description && (
  <div
  className="prose dark:prose-invert max-w-none w-full break-words whitespace-normal text-text dark:text-text-dark h-72 overflow-auto"
  style={{
    backgroundColor: 'transparent',
    color: 'inherit',
  }}
    dangerouslySetInnerHTML={{ __html: cleanHtml }}
  />
)}</div>
<div className="py-5 px-3 space-y-5">
 {groupedArray?.map((group,idx:number) => (
  <div className="" key={idx}>
    <div className="flex justify-between">
      <div className="flex w-max gap-4">
    <p>{group?.variantType[0].toUpperCase()+group?.variantType.slice(1)}:</p>
    {
    <p className="">{variants.find((variant:any) => variant.variantType === group?.variantType)?.variant.toUpperCase()}</p>}
    </div>
    {group?.variantType === "size" && <SizeChart />}
    </div>
    <Variant subVariants={group?.variants} variantType={group?.variantType}/>
  </div>
 ))}
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
                  addToCart(
                  {
                    _id:currentProduct?._id,
                    title:currentProduct.name,
                    quantity:1,
                    price:currentProduct.discountedPrice,
                    image:currentProduct.images[0].url
                  }
                  )}
                }} className="w-full text-text-dark py-6">
                  Add to cart
                </Button>
              )}

 <div className="pt-10">
 <Link href={`/product-page/${currentProduct?._id}`} className="underline">View full details</Link> </div>
 
</div>
  </SheetContent>
    </Sheet>
</main>
)
      }else{
        return(<div className='py-20 container mx-auto text-2xl'>There are no available products under this category</div>)
      }


  
}
