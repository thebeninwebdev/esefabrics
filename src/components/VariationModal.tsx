import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { VariationInterface, IProduct, CartItem, Variant } from '@/app/types';
import { useAppContext } from '@/context';

const VariationModal = ({variationsArray,currentProduct}:{variationsArray:VariationInterface[],currentProduct:IProduct}) => {
  const {isCartSelection, setIsCartSelection, addToCart, removeFromCart, cart} = useAppContext()
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0
  });

  const updateQuantity = (size: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta)
    }));
  };

  return (
    <div className="flex flex-col gap-2">
<Dialog open={isCartSelection} onOpenChange={setIsCartSelection}>
      <DialogContent className="sm:max-w-[425px] bg-background dark:bg-background-dark">
        <DialogHeader>
          <DialogTitle className="sr-only">Select a Variation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
        <div 
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Standard product</span>
                  <Badge variant="secondary" className="text-xs bg-primary">
                    {currentProduct?.stock}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary font-bold">
                    ₦{currentProduct?.retailPrice?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground line-through text-sm">
                    ₦{currentProduct?.discountedPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:opacity-80 hover:bg-transparent"
                  onClick={() => removeFromCart(currentProduct._id,'')}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3">
                  {cart.find((item:CartItem) => (!item?.variant && item._id === currentProduct._id))?.quantity || "0"}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:opacity-80 hover:bg-transparent"
                  onClick={() => addToCart({
                    _id:currentProduct?._id,
                    title:currentProduct.name,
                    quantity:1,
                    price:currentProduct.discountedPrice,
                    image:currentProduct.images[0].url
                  })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          {variationsArray?.map((variation,idx:number) => (
            <div 
              key={idx} 
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase">{variation?.subVariant}</span>
                  <Badge variant="secondary" className="text-xs bg-primary">
                    {variation?.stock}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary font-bold">
                    ₦{variation?.retailPrice?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground line-through text-sm">
                    ₦{variation?.discountedPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:opacity-80 hover:bg-transparent"
                  onClick={() => removeFromCart(currentProduct._id, variation?._id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3">
                  {cart.find((item:CartItem) => (item._id === currentProduct._id && (item?.variant as Variant)?.variant === variation.subVariant))?.quantity || "0"}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:opacity-80 hover:bg-transparent"
                  onClick={() => {
                    addToCart({
                    _id:currentProduct?._id,title:currentProduct.name,quantity:1,price:currentProduct.discountedPrice,image:currentProduct.images[0].url,variant:{reference_id:variation?._id,variantType:variation?.variantType,variant:variation?.subVariant}
                  })}}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            className='bg-primary text-text-dark hover:bg-primary-dark'
            onClick={() => setIsCartSelection(false)}
          >
            Continue Shopping
          </Button>
          <Button className='bg-primary text-text-dark hover:bg-primary-dark'>Go to Cart</Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
    
  );
};

export default VariationModal;