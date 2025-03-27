'use client'

import { useEffect, useState } from "react";
import { HomeSlider } from "@/components/HomeSlider";
import Marquee from "react-fast-marquee"
import { TbChristmasTree } from "react-icons/tb";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import SizeChart from '@/components/SizeChart';
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Eye } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "@/context";
import Link from "next/link"
import { IProduct, IImage, CartItem, VariationInterface } from '@/app/types';

import {
  Sheet,
  SheetContent,
  SheetTitle
} from "@/components/ui/sheet"

const CategoryCard = ({ title, image }:{
  title:string, image:string}) => {
  return (
    <Card className={`w-full h-full bg-background dark:bg-background-dark overflow-hidden border-none rounded-lg`}>
      <CardContent className="p-0 relative">
            <img 
              src={image}
              alt={title} 
              className="w-full h-full object-contain block hover:scale-110 transition-transform duration-1000 ease-in-out"
            />
          <div className="px-6 py-2 rounded-r-md bg-background dark:bg-background-dark absolute z-10 bottom-6 left-0">
            <h3 className="text-lg">{title}</h3>
          </div>
      </CardContent>
    </Card>
  );
};

const DiscoveryCard = () => {
  return (
    <div className="w-full overflow-hidden border border-neutral-900 rounded-lg dark:border-neutral-200 lg:max-w-72">
      <div className="p-4 flex justify-between items-center w-full lg:flex-col gap-10">
        <h2 className="text-xl lg:text-3xl">Discovery all new items</h2>
        <Link href="/categories">
        <div className="p-2 rounded-full border border-neutral-900 flex items-center justify-center -rotate-45 hover:bg-neutral-900 hover:text-text-dark cursor-pointer ease-in-out duration-500 transition-colors dark:border-neutral-200 dark:hover:bg-background hover:dark:text-text">
          <ArrowRight className="h-4 w-4" />
        </div>
        </Link>
      </div>
    </div>
  );
};

export default function Home() {
  const {categories, fetchCategories, products, fetchProducts, addToCart, updateQuantity, cart, variants, fetchVariations, variations} = useAppContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerId, setDrawerId] = useState("")
  const [cleanHtml, setCleanHtml] = useState('');
  const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct);
  
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
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {products?.map((product:IProduct,idx:number) => (
          <Card key={idx} className="overflow-hidden border-0 rounded-md flex flex-col h-full">
  <div className="relative">
    <img 
      src={product.images[0].url}
      alt={product.images[0].id} 
      className="w-full h-auto object-cover block hover:scale-110 transition-transform duration-1000 ease-in-out" 
    />
    <button className="absolute top-2 right-2 p-2 text-text-dark dark:text-text opacity-75 hover:opacity-100 bg-primary dark:bg-primary-dark rounded-full" onClick={() => {
      setDrawerId(product._id as string)
      setIsDrawerOpen(true)
      }}><Eye className="w-4 h-4" /></button>
  </div>
  <CardContent className="p-4 flex-grow flex flex-col justify-center space-y-2">
  <h3 className="text-sm font-normal line-clamp-2">
  {product.name}
</h3>
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
    <Button className="w-full text-text-dark dark:text-text">Add to cart</Button>
  </CardFooter>
</Card>

        ))}
      </div>
    </div>
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
    <SheetTitle>Quick view</SheetTitle>
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
              <div className="">
                <div className="flex justify-between">
                  <div className="flex w-full">
                    <div className="flex justify-between w-full">
                      <p>Variations Available:</p>
                      <SizeChart />
                    </div>
                  </div>
                </div>
                {variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.map((variation:any,idx:number) => (
                  <div key={idx} className="py-2 px-3 rounded-md border-primary border-2 dark:bg-primary-dark dark:text-text-dark text-text w-max">
                    {variation?.subVariant}
                  </div>
                ))}
              </div>

              {cart.find((item:CartItem) => item._id === currentProduct._id) ? (
                <div className="flex justify-between w-36 py-2 px-4 h-max text-2xl font-thin items-center text-text bg-neutral-300 rounded-md ">
                  <button onClick={() => updateQuantity(currentProduct._id,1)} className="">-</button>
                  <span className="text-lg font-normal">{cart.find((item:CartItem) => item._id === currentProduct._id)?.quantity}</span>
                  <button onClick={() => addToCart({_id:currentProduct._id,title:currentProduct.name,quantity:1,image:currentProduct.images[0],variants})}>+</button>
                </div>
              ) : (
                <Button onClick={() => addToCart({_id:currentProduct._id,title:currentProduct.name,quantity:1,image:currentProduct.images[0],variants})} className="w-full text-text-dark py-6">
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