"use client"

import { CartItem, Variant, VariationInterface, IProduct, ICart } from '@/app/types';
import React, {createContext, useContext, useState, useEffect, useCallback} from 'react'
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useLoading } from './LoadingContext';

type WishlistItem = {
  _id: string;
  productId: string;
  product: {
    name: string;
    price: number;
    image: string;
  };
};


const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){
    const {isLoading, setLoading} = useLoading()
    const {data:session} = useSession();
    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"
    const delivery = 1500;
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
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct);
    const [wishlistDisplay, setWishlistDisplay] = useState([])

    useEffect(() => {
      if(session?.user?._id){
        fetchCart(session?.user?._id)
      }
    },[session])

    useEffect(() => {
      fetchProducts()
    },[])
 
    async function createOrder(orderData: {
      userId: string;
      products: { productId: string; quantity: number; variant?: string }[];
      totalAmount: number;
      shippingAddress: { fullName: string; address: string };
    }) {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
    
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create order");
        }
    
        const newOrder = await res.json();
        return newOrder;
      } catch (error) {
        console.error("[CREATE_ORDER_FRONTEND]", error);
        throw error;
      }
    }
    
    

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

    const removeFromCart = async (productId: string, reference_id: string) => {
      if (!productId) return;

      const userId = session?.user?._id as string
    
      try {
        setLoading(true)
        // 1. Fetch the current cart from the API
        const response = await fetchCart(userId)
        const currentCart = response?.items || []

        let updatedCart:CartItem[] = []

          if (reference_id === "") {
            const targetItem = currentCart.find((i) => i._id === productId);
            if (targetItem?.quantity === 1) {
              updatedCart = currentCart.filter((i) => i._id !== productId);
            } else {
              updatedCart = currentCart.map((i) =>
                i._id === productId ? { ...i, quantity: i.quantity - 1 } : i
              );
            }
          } else {
            const targetItem = currentCart.find((i) => i.variant?.reference_id === reference_id);
            if (targetItem?.quantity === 1 || targetItem?.quantity === 0) {
              updatedCart = currentCart.filter((i) => i.variant?.reference_id !== reference_id);
            } else {
              updatedCart = currentCart.map((i) =>
                i.variant?.reference_id === reference_id
                  ? { ...i, quantity: i.quantity - 1 }
                  : i
              );
            }
          }

          setCart(updatedCart)
    
        // 2. POST the updated cart back to the database
        const postRes = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            items: updatedCart,
          }),
        });

        if (!postRes.ok) {
          toast.error('Failed to update cart');
        }
        if (session?.user?._id) {
          fetchCart(session.user._id);
        }
        toast.success('Item removed from cart');

      } catch (error) {
        console.error('Failed to remove from cart:', error);
        toast.error("failed to remove item from cart")
        // (optional) You could roll back the cart update here if you want
      } finally {
        setLoading(false)
      }
    };

    const clearFromCart = async (productId: string, reference_id: string) => {
      const userId = session?.user?._id as string
      if (!productId || !userId) return;
      try{
        setLoading(true)

        const response = await fetchCart(userId)
        const currentCart = response?.items || []

        let updatedCart:CartItem[] = []

        if (reference_id === "") {
            updatedCart = currentCart.filter((i) => i._id !== productId);
        } else{
             updatedCart = currentCart.filter((i) => i.variant?.reference_id !== reference_id);
        }

        // 2. POST the updated cart back to the database
        const postRes = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            items: updatedCart,
          }),
        });

        if (!postRes.ok) {
          toast.error('Failed to update cart');
        }
        if (session?.user?._id) {
          fetchCart(session.user._id);
        }
        toast.success('Item cleared from cart');

      } catch (error) {
        console.log('Failed to clear from cart:', error);
        toast.error("failed to clear item from cart")
        // (optional) You could roll back the cart update here if you want
      }finally{
        setLoading(false)
      }
    }

    const clearCart = async () => {
      const userId = session?.user?._id

      if(!userId) return

      try{
        setLoading(true)
        
        const postRes = await fetch(`/api/cart?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        
        if (!postRes.ok) {
          toast.error('Failed to update cart');
        }

        fetchCart(userId);

        setCart([]);

      }catch(error){
        console.log(error)
        toast.error("Failed to clear cart")
      }finally{
        setLoading(false)
      }
      
    };

    const addToCart = async (item: CartItem) => {
      const userId = session?.user?._id as string

      if (!item || !userId) return;
    
      try {
        setLoading(true)
        // 1. Fetch the current cart from the API
        const res = await fetch(`/api/cart?userId=${userId}`);
        const data: ICart = await res.json();
        const currentItems = data?.items || [];
    
        let updatedItems: CartItem[] = [];
    
        if (item?.variant) {
          const duplicate = currentItems.find(
            (i) => i?.variant?.reference_id === item.variant?.reference_id
          );
    
          if (duplicate) {
            updatedItems = currentItems.map((i) =>
              i?.variant?.reference_id === item.variant?.reference_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            updatedItems = [...currentItems, { ...item }];
          }
        } else {
          const existing = currentItems.find(
            (i) => i._id === item._id && !i?.variant
          );
    
          if (existing) {
            updatedItems = currentItems.map((i) =>
              i._id === item._id && !i?.variant
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            updatedItems = [...currentItems, { ...item }];
          }
        }
    
        // 2. POST the updated cart back to the database
        const postRes = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            items: updatedItems,
          }),
        });
    
        if (!postRes.ok) {
          toast.error('Failed to update cart');
        }
        if (session?.user?._id) {
          fetchCart(session.user._id);
        }
        toast.success('Item added to cart');

      } catch (error) {
        toast.error('Could not update cart. Please try again.');
      } finally {
        setLoading(false)
      }
    };

    const fetchCart = async (userId: string): Promise<ICart | null> => {
      if (!userId) return null;
    
      try {
        const res = await fetch(`/api/cart?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
    
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await res.json();
        
        setCart(data.items);

        return data;

      } catch (error) {
        toast.error("fetchCart error");
        console.log('fetchCart error:', error);
        return null;
      }
    };

    const fetchWishlist = useCallback(async (userId:string) => {
        try {
            const res = await fetch(`/api/wishlist?userId=${userId}`);
            const data = await res.json();
            if (res.ok) {
                setWishlist(data.products);
            } else {
                console.error(data.message);
            }
            setWishlistDisplay(data.products.map((item: WishlistItem) => item.productId));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }, []);

    const fetchVariations = useCallback(async () => {
        try {
            const response = await fetch('/api/variation');
            if (!response.ok) {
                console.log('failed to fetch categories');
            }
            const data = await response.json();
            setVariations(data.variations);
        } catch (error) {
            console.log(error);
        }
    }, []);

    async function removeFromWishlist(productId: string, userId:string) {
      try {
        setLoading(true)
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
  
        if (res.ok) {
          setWishlist((prev) => prev.filter((item) => item.productId !== productId));
          fetchWishlist(userId)
          toast.success("wishlist updated")
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Error removing from wishlist:");

      }finally{
        setLoading(false)
      }
    }
    
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
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen, categories, fetchCategories, variants, setVariants, fetchVariants, fetchProducts, products, selectedVariant, setSelectedVariant, cart, addToCart, removeFromCart, clearCart, updateQuantity, addVariant, variations, fetchVariations, isCartSelection, setIsCartSelection, drawerId, setDrawerId, isDrawerOpen, setIsDrawerOpen, currentProduct, setCurrentProduct, clearFromCart, fetchWishlist, removeFromWishlist, wishlistDisplay, fetchCart, delivery, createOrder}}>
            { children }
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}