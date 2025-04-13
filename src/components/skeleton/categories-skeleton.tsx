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

const DiscoveryCardSkeleton = () => {
  return (
    <div className="w-full overflow-hidden border border-neutral-900 rounded-lg dark:border-neutral-200 lg:max-w-72">
      <div className="p-4 flex justify-between items-center w-full lg:flex-col gap-10">
        {/* Title placeholder */}
        <div className="h-8 w-48 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
        {/* Button placeholder */}
        <div className="p-2 rounded-full border border-neutral-900 dark:border-neutral-200 flex items-center justify-center">
          <div className="h-4 w-4 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function CategoriesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full p-4">
      <div className="lg:flex">
        <Carousel className="w-full">
          <div className="flex items-center justify-between my-6">
            {/* Header placeholder */}
            <div className="h-8 w-64 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
            <div className="flex w-10 relative">
              <CarouselPrevious className="h-8 w-8 dark:bg-background-dark opacity-50" />
              <CarouselNext className="right-0 h-8 w-8 dark:bg-background-dark opacity-50" />
            </div>
          </div>
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
            <DiscoveryCardSkeleton />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
