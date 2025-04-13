"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const CategoryCardSkeleton = () => {
  return (
    <Card className="w-full h-full bg-background dark:bg-background-dark overflow-hidden border-none rounded-lg">
      <CardContent className="p-0 relative">
        {/* Image placeholder - fixed height and full width */}
        <div className="w-full h-48 md:h-64 bg-lighttext/20 dark:bg-accent-dark animate-pulse" />
        {/* Title placeholder */}
        <div className="px-6 py-2 rounded-r-md bg-background dark:bg-background-dark absolute z-10 bottom-6 left-0">
          <div className="h-6 w-24 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function CategoriesPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full p-4">
      <div className="lg:flex">
        <Carousel className="w-full">
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            <CarouselContent className="-ml-4 w-full">
              {Array(count)
                .fill(0)
                .map((_, idx) => (
                  <CarouselItem key={idx} className="pl-4 md:basis-1/3 min-w-[250px]">
                    <CategoryCardSkeleton />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </div>
        </Carousel>
      </div>
    </div>
  )
}