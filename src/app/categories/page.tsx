// app/page.tsx
"use client";

import {useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context";

const categories = [
  {
    id: 1,
    name: "Women's Sunglasses",
    image: "/images/womens-sunglasses.jpg",
    category: "Women",
  },
  {
    id: 2,
    name: "Kids' Clothing",
    image: "/images/kids-clothing.jpg",
    category: "Kids",
  },
  {
    id: 3,
    name: "Men's Activewear",
    image: "/images/mens-activewear.jpg",
    category: "Men",
  },
  {
    id: 4,
    name: "Women's Activewear",
    image: "/images/womens-activewear.jpg",
    category: "Women",
  },
  {
    id: 5,
    name: "Women's Tops",
    image: "/images/womens-tops.jpg",
    category: "Women",
  },
  {
    id: 6,
    name: "Accessories",
    image: "/images/accessories.jpg",
    category: "Accessories",
  },
];

export default function Home() {
    const {categories, fetchCategories} = useAppContext()

    useEffect(() => {
        fetchCategories()
    },[])

  return (
    <div className="container mx-auto pb-10 px-4">
      <p className="text-md sm:text-lg font-semibold mb-8 text-center py-16">Shop through our latest selection of Fashion </p>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {categories && categories?.map((item:any,idx:number) => (
          <Link href={`/category/${item?.category.toLowerCase()}`} key={idx}>
            <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
              <CardContent className="p-0 relative">
                <div className="aspect-square relative">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <img src={item?.link} alt={item?.category} className="w-full h-full object-contain block hover:scale-110 transition-transform duration-1000 ease-in-out"/>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white px-6 py-2 rounded-sm text-sm font-medium sh
                  adow-md">
                    {item?.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}