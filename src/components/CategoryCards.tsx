import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from 'next/link'

export const CategoryCard = ({ title, image }:{
    title:string, image:string}) => {
    return (
      <Card className={`w-full h-full bg-background dark:bg-background-dark overflow-hidden border-none rounded-lg`}>
        <CardContent className="p-0 relative">
              <img 
                src={image}
                alt={title} 
                className="w-full h-full object-contain block hover:scale-110 transition-transform duration-1000 ease-in-out"
              />
            <div className="px-6 py-2 rounded-r-md bg-background dark:bg-background-dark absolute z-10 bottom-6 left-0">
              <h3 className="text-lg">{title}</h3>
            </div>
        </CardContent>
      </Card>
    );
  };
  
  export const DiscoveryCard = () => {
    return (
      <div className="w-full overflow-hidden border border-neutral-900 rounded-lg dark:border-neutral-200 lg:max-w-72">
        <div className="p-4 flex justify-between items-center w-full lg:flex-col gap-10">
          <h2 className="text-xl lg:text-3xl">Discovery all new items</h2>
          <Link href="/categories">
          <div className="p-2 rounded-full border border-neutral-900 flex items-center justify-center -rotate-45 hover:bg-neutral-900 hover:text-text-dark cursor-pointer ease-in-out duration-500 transition-colors dark:border-neutral-200 dark:hover:bg-background hover:dark:text-text">
            <ArrowRight className="h-4 w-4" />
          </div>
          </Link>
        </div>
      </div>
    );
  };
