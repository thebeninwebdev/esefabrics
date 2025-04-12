import { Document } from "mongoose";

// Define a type for the sub-menu items
interface SubMenuItem {
    name: string; // Name of the sub-menu item
    desc: string; // Description of the sub-menu item
    icon: React.ElementType; // Icon component type
    link?: string;
  }
  
  //type for the product image
  export interface IImage {
    id: string;
    url: string;
    color?: string;
  }

  export type CartItem = {
    _id: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
    variant?: Variant;
  };

  export interface VariationInterface {
    reference_id?:string; 
    _id?:string;
    retailPrice: string; 
    discountedPrice: string; 
    variantType: string; 
    subVariant: string, 
    stock:string,
    variations?: IVariation[]
  }

  export type GroupedVariant = {
      variantType: string;
      variants: string[];
    };

  export interface IVariantArray {
    variantType: string;
    subVariant: string;
  }
  
  // type for the main menu item
 export interface MainMenuItem {
    name: string; 
    subMenuHeading?: string[]; 
    subMenu?: SubMenuItem[]; 
    gridCols?: number; 
    link?: string;
  }
  
  //type for product
  export interface IProduct extends Document {
    name: string;
    description: string;
    retailPrice: number;
    discountedPrice: number;
    slug: string;
    brand: string;
    stock: number;
    categories: string[];
    rating: number;
    numReviews: number;
    images: IImage[];
    variantArray: IVariantArray[]
    createdAt: Date;
    updatedAt: Date;
  }


 interface IVariation {
    retailPrice: number;
    discountedPrice: number;
    variantType: string;
    subVariant: string;
    stock: number;
  }

  export interface IVariationArray {
    reference_id: string;
    variations: IVariation[];
  }

  export interface Variant {
    reference_id: string;
    variantType: string;
    variant: string;
    quantity: number
  }
  
  // Define the Cart interface extending Document
  export interface ICart extends Document {
    userId: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }