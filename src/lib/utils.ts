import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GroupedVariant } from "@/app/types";
import { CiBag1, CiDeliveryTruck, CiFileOn, CiMap, CiShoppingCart, CiTrash, CiUnlock, CiViewList } from "react-icons/ci";
import { LogIn } from "lucide-react";

type VariantItem = {
    variantType: string;
    subVariant: string;
  };
  
  export const groupVariants = (variantArray: VariantItem[]): GroupedVariant[] => {
    return variantArray?.reduce((acc: GroupedVariant[], curr) => {
      const found = acc.find(item => item.variantType === curr.variantType);
      
      if (found) {
        if (!found.variants.includes(curr.subVariant)) {
          found.variants.push(curr.subVariant);
        }
      } else {
        acc.push({
          variantType: curr.variantType,
          variants: [curr.subVariant[0]]
        });
      }
  
      return acc;
    }, []);
  };

export const Menus = [
  {
    name: "Home",
    link: "/"
  },
  {
    name: "Account",
    subMenuHeading: ["Get started", "account", "shop"],
    subMenu: [
      {
        name: "Orders",
        desc: "View, track, and manage orders.",
        icon: CiBag1,
        link: '/orders'
      },
      {
        name: "Wishlist",
        desc: "Save favorites for future purchases.",
        icon: CiMap,
        link: '/wishlist'
      },
      {
        name: "Cart",
        desc: "Review items before completing purchase.",
        icon: CiShoppingCart,
        link: '/cart'
      },
      {
        name: "Account details",
        desc: "View your account information",
        icon: CiTrash,
        link: '/account-details'
      },
    ],
    gridCols: 2,
  },
  {
    name: "Support",
    subMenu: [
      {
        name: "FAQs",
        desc: "A section addressing common questions about orders, shipping, returns, and payments.",
        icon: CiFileOn,
        link: '/faq'
      },
      {
        name: "Shipping & delivery",
        desc: "Information on shipping options, delivery times, and any international shipping policies.",
        icon: CiDeliveryTruck,
        link: '/delivery-return'
      },
      {
        name:"Terms and conditions",
        desc:"",
        icon: CiViewList,
        link: '/terms'
      },
      {
        name:"Privacy Policy",
        desc:"",
        icon: CiUnlock,
        link:'/privacy-policy'
      },
    ],
    gridCols: 2,
  },
  {
    name: "About us",
    link: "/about-us"
  },
  {
    name: "Contact",
    link: '/contact'
  },
];

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}