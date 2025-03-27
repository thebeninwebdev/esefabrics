"use client"

import { CartItem, Variant, VariationInterface } from '@/app/types';
import React, {createContext, useContext, useState} from 'react'

const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){

    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"
    const [categories, setCategories] = useState([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [products, setProducts] = useState([])
    const [selectedVariant, setSelectedVariant] = useState([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [variations, setVariations] = useState<VariationInterface[]>([])
    const [isCartSelection, setIsCartSelection] = useState<boolean>(false)


    const addVariant = (item:Variant) => {
      
      const existingVariant = variants.find((variant:any) => variant.variantType === item.variantType)
      if(existingVariant){
        const filteredvariants = variants.filter((variant:Variant) => variant.variantType !== item.variantType)
        setVariants(
            [...filteredvariants,item])
      }
      setVariants((prevState) => {
        return([...prevState, item])
      }
    )
    }

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {

          if(item?.variant){
            const duplicate = prevCart.find(
              (i) =>
                i?.variant?.reference_id === item.variant?.reference_id 
            ); 
            if(duplicate){
              return prevCart.map((i) =>
                i?.variant?.reference_id === item.variant?.reference_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              );
            }
            return [...prevCart, {...item}];
          }else{
            const existing = prevCart.find(
              (i) =>
                i._id === item._id 
            );
      
            if (existing) {
              return prevCart.map((i) =>
                i._id === item._id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              );
            }
  
            return [...prevCart, {...item}];
          }
        });
      };
    
      const removeFromCart = (productId: string, reference_id:string) => {
        if(!reference_id){
          setCart((prevCart) => prevCart.filter((i) => i._id !== productId));
        }else{
          setCart((prevCart) => prevCart.filter((i) => i.variant?.reference_id !== reference_id));
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
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen, categories, fetchCategories, variants, setVariants, fetchVariants, fetchProducts, products, selectedVariant, setSelectedVariant, cart, addToCart, removeFromCart, clearCart, updateQuantity, addVariant, variations, fetchVariations, isCartSelection, setIsCartSelection}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}