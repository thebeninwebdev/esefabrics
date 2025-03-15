'use client'

import { useEffect } from "react";
import { HomeSlider } from "@/components/HomeSlider";
import Marquee from "react-fast-marquee"
import { TbChristmasTree } from "react-icons/tb";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ArrowRight } from "lucide-react";
import { useAppContext } from "@/context";


const CategoryCard = ({ title, image }:{
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

const DiscoveryCard = () => {
  return (
    <div className="w-full overflow-hidden border border-neutral-900 rounded-lg dark:border-neutral-200 lg:max-w-72">
      <div className="p-4 flex justify-between items-center w-full lg:flex-col gap-10">
        <h2 className="text-xl lg:text-3xl">Discovery all new items</h2>
        <div className="p-2 rounded-full border border-neutral-900 flex items-center justify-center -rotate-45 hover:bg-neutral-900 hover:text-text-dark cursor-pointer ease-in-out duration-500 transition-colors dark:border-neutral-200 dark:hover:bg-background hover:dark:text-text">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const {categories, fetchCategories} = useAppContext()
  useEffect(() => {
    fetchCategories()
  },[])

  useEffect(() => {
    fetchCategories()
  },[])
  return (
    <main className=" w-full">
      <div className="p-3 sm:p-5">
      <HomeSlider/>
      </div>
      
    <Marquee pauseOnHover className="py-6 bg-complement dark:bg-complement-dark text-2xl text-text-dark cursor-pointer ">
      <div className="flex gap-5">
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex items-center"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      </div>
    </Marquee>
    <div className="w-full p-4 ">
      <div className="lg:flex">
        <Carousel className="w-full">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-xl sm:text-2xl font-bold uppercase">Shop by Categories</h2>
            <div className="flex w-10 relative">
              <CarouselPrevious className=" h-8 w-8 dark:bg-background-dark" />
              <CarouselNext className="right-0 h-8 w-8 dark:bg-background-dark" />
            </div>
          </div>
        <div className="flex flex-col lg:flex-row gap-5">
        <CarouselContent className="-ml-4">
          {categories?.length && categories?.map((category:any) => (
            <CarouselItem key={category?._id} className="pl-4 md:basis-1/3">
              <CategoryCard 
                title={category?.category} 
                image={category?.link} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
<DiscoveryCard />
        </div>

      </Carousel>

      
    </div>
  </div>
    </main>
  );
}
