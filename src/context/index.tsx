"use client"

import { CartItem, Variant } from '@/app/types';
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
        });
        setVariants([])
      };
    
      const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((i) => i._id !== productId));
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
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen, categories, fetchCategories, variants, setVariants, fetchVariants, fetchProducts, products, selectedVariant, setSelectedVariant, cart, addToCart, removeFromCart, clearCart, updateQuantity, addVariant}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}