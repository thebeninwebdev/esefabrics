"use client"

import { CartItem, Variant, VariationInterface, IProduct } from '@/app/types';
import React, {createContext, useContext, useState, useEffect
} from 'react'
import { toast } from 'sonner';

const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){
    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"
    const [categories, setCategories] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [selectedVariant, setSelectedVariant] = useState<any[]>([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [variations, setVariations] = useState<VariationInterface[]>([])
    const [isCartSelection, setIsCartSelection] = useState<boolean>(false)
    const [drawerId, setDrawerId] = useState("")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct);

    useEffect(() => {
      if(cart?.length > 0){
        toast.success("cart updated")
      }
    },[cart])

    const addVariant = (item:Variant) => {
      if (!item) return;
      
      const existingVariant = variants?.find((variant:any) => variant.variantType === item.variantType)
      if(existingVariant){
        const filteredvariants = variants?.filter((variant:Variant) => variant.variantType !== item.variantType) || []
        setVariants([...filteredvariants, item])
      } else {
        setVariants((prevState) => [...(prevState || []), item])
      }
    }

    const addToCart = (item: CartItem) => {
        if (!item) return;
        
        setCart((prevCart) => {
          const currentCart = prevCart || [];
          
          if(item?.variant){
            console.log(item)
            const duplicate = currentCart.find(
              (i) =>
                i?.variant?.reference_id === item.variant?.reference_id 
            ); 
            if(duplicate){
              return currentCart.map((i) =>
                i?.variant?.reference_id === item.variant?.reference_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              );
            }
            return [...currentCart, {...item}];
          }else{
            const existing = currentCart.find(
              (i) =>
                (i._id === item._id && !i?.variant)
            );
      
            if (existing) {
              return currentCart.map((i) =>
                (i._id === item._id && !i?.variant)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              );
            }
  
            return [...currentCart, {...item}];
          }
        });
      };
    
      const removeFromCart = (productId: string, reference_id: string) => {
        if (!productId) return;
        
        if (reference_id === "") {
          setCart((prevCart) => {
            const currentCart = prevCart || [];
            const targetItem = currentCart.find((i) => i._id === productId);
            if (targetItem?.quantity === 1) {
              return currentCart.filter((i) => i._id !== productId);
            } else {
              return currentCart.map((i) =>
                i._id === productId ? { ...i, quantity: i.quantity - 1 } : i
              );
            }
          });
        } else {
          setCart((prevCart) => {
            const currentCart = prevCart || [];
            const targetItem = currentCart.find((i) => i.variant?.reference_id === reference_id);
            if (targetItem?.quantity === 1) {
              return currentCart.filter((i) => i.variant?.reference_id !== reference_id);
            } else if(targetItem?.quantity === 0){
              return currentCart.filter((i) => i.variant?.reference_id !== reference_id);
            } else {
              return currentCart.map((i) =>
                i.variant?.reference_id === reference_id
                  ? { ...i, quantity: i.quantity - 1 }
                  : i
              );
            }
          });
        }
      };
      
    
      const clearCart = () => {
        setCart([]);
      };
    
      const updateQuantity = (productId: string, quantity: number) => {
        setCart((prevCart) =>
          prevCart.map((i) =>
            i._id === productId ? { ...i, quantity } : i
          )
        );
      };

      const fetchVariations = async () => {
        try {
          const response = await fetch('/api/variation') 

          if(!response.ok){
           console.log('failed to fetch categories')
          }

          const data = await response.json()
          setVariations(data.variations)
       } catch (error) {
           console.log(error)
       }
      }

    const fetchProducts = async () => {
        try {
           const response = await fetch('/api/products') 

           if(!response.ok){
            console.log('failed to fetch categories')
           }

           const data = await response.json()
           setProducts(data.products)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCategories = async () => {
        try {
           const response = await fetch('/api/category') 

           if(!response.ok){
            console.log('failed to fetch categories')
           }

           const data = await response.json()
           setCategories(data.categories)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchVariants = async () => {
        try {
           const response = await fetch('/api/variants') 

           if(!response.ok){
            console.log('failed to fetch categories')
           }

           const data = await response.json()
           setVariants(data.variants)

        } catch (error) {
            console.log(error)  
        }
    }
    return(
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen, categories, fetchCategories, variants, setVariants, fetchVariants, fetchProducts, products, selectedVariant, setSelectedVariant, cart, addToCart, removeFromCart, clearCart, updateQuantity, addVariant, variations, fetchVariations, isCartSelection, setIsCartSelection, drawerId, setDrawerId, isDrawerOpen, setIsDrawerOpen, isLoading, setIsLoading, currentProduct, setCurrentProduct}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}