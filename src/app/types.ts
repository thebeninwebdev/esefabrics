import { Document } from "mongoose";

// Define a type for the sub-menu items
interface SubMenuItem {
    name: string; // Name of the sub-menu item
    desc: string; // Description of the sub-menu item
    icon: React.ElementType; // Icon component type
  }
  
  //type for the product image
  export interface IImage {
    id: string;
    url: string;
    color?: string;
  }
  
  // type for the main menu item
 export interface MainMenuItem {
    name: string; 
    subMenuHeading?: string[]; 
    subMenu?: SubMenuItem[]; 
    gridCols?: number; 
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
    variants: {
      size: string;
      color: string;
      stock: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }