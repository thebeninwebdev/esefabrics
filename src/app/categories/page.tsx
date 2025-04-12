// app/page.tsx
"use client";

import {useEffect} from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context";

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
                  <span className="bg-white dark:text-text px-6 py-2 rounded-sm text-sm font-medium sh
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