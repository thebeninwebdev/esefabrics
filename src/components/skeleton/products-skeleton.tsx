"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-7xl mx-auto">
      {Array(count)
        .fill(0)
        .map((_, idx) => (
          <Card
            key={idx}
            className="overflow-hidden border-2 rounded-md flex flex-col h-full bg-background dark:bg-background-dark max-w-80"
          >
            <div className="relative">
              {/* Image placeholder */}
              <div className="w-full h-52 md:h-64 bg-lighttext/20 dark:bg-accent-dark animate-pulse" />
              {/* Eye/Trash icon placeholder */}
              <div className="absolute top-2 right-2 p-2 rounded-full bg-primary/60 dark:bg-primary-dark/70 w-8 h-8 animate-pulse" />
            </div>
            <CardContent className="p-4 flex-grow flex flex-col justify-center space-y-2">
              {/* Product name placeholder */}
              <div className="h-4 bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded w-3/4" />
              <div className="h-4 bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded w-1/2" />

              {/* Price placeholders */}
              <div className="flex items-center gap-5 mt-2">
                <div className="h-5 w-20 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
                <div className="h-4 w-16 bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
              </div>
            </CardContent>
            <CardFooter className="pt-0 px-4 mt-auto pb-4">
              {/* Button placeholder */}
              <div className="h-12 w-full rounded-md bg-primary/60 dark:bg-primary-dark/70 animate-pulse" />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
