'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IProduct, IImage, CartItem } from "../app/types";
import Products from '@/components/Product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAppContext } from '@/context';
import VariationModal from "@/components/VariationModal";
import { VariationInterface } from '@/app/types';
import SizeChart from '@/components/SizeChart';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Link from 'next/link';

export default function SearchPage() {
    const {variations, currentProduct, setCurrentProduct, drawerId, isDrawerOpen, setIsDrawerOpen, setIsCartSelection, cart, removeFromCart, addToCart, fetchVariations} = useAppContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [cleanHtml, setCleanHtml] = useState('');
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchVariations()
  },[])

  useEffect(() => {

    if(drawerId) setCurrentProduct(products.find((product:IProduct) => product?._id === drawerId))
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

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
        />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      {variations.length > 0 && <VariationModal variationsArray={variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations || []} currentProduct={currentProduct} />}
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
              {
              currentProduct.description && (
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
                variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._i) &&
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
              
              {cart.find((item:CartItem) => item?._id === currentProduct?._id) ? (
                <div className="flex justify-between w-36 py-2 px-4 h-max text-2xl font-thin items-center text-text bg-neutral-300 rounded-md">
                  <button onClick={() => {
                    if(variations?.find((variation:VariationInterface) => variation?.reference_id === currentProduct?._id)?.variations?.length > 0){
                      setIsCartSelection(true)
                    }else{
                      removeFromCart(currentProduct._id,'')}
                    }} className="">-</button>
                  <span className="text-lg font-normal">
  {cart
  .filter((item: CartItem) => item?._id === currentProduct?._id)
  .reduce((sum:number, item:CartItem) => sum + (item.quantity || 0) + (item?.variant?.quantity || 0), 0)}
  </span>
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
                <Link href="/" className="underline">
                View full details
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : products?.length > 0 && variations.length > 0 ? 
      <Products products={products} variations={variations} />
      :
    searchQuery ? (
        <div className="text-center text-gray-500">
          No products found matching "{searchQuery}" or you havent clicked the search button
        </div>
      ) : null}
    </div>
  );
} 