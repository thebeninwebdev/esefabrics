export default function ProductSkeleton() {
  return (
    <div className="pt-10 max-w-7xl w-full mx-auto">
      <div className="md:grid grid-cols-2 gap-8">
        {/* Product Image Carousel Skeleton */}
        <div className="space-y-4">
          <div className="h-[400px] w-full rounded-lg bg-lighttext/20 dark:bg-accent-dark animate-pulse" />
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-16 rounded-md bg-lighttext/20 dark:bg-accent-dark animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="overflow-y-auto space-y-6 mt-6 md:mt-0">
          <div className="h-10 w-3/4 bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
          <div className="flex items-center gap-5">
            <div className="h-8 w-32 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
            <div className="h-6 w-24 bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
            <div className="h-6 w-16 rounded-2xl bg-lighttext/20 dark:bg-accent-dark animate-pulse" />
          </div>

          {/* Variations Skeleton */}
          <div className="py-5 space-y-5">
            <div className="flex justify-between">
              <div className="h-6 w-40 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
              <div className="h-6 w-24 bg-lighttext/30 dark:bg-secondary-dark animate-pulse rounded" />
            </div>
            <div className="flex flex-wrap gap-2 pt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-16 rounded-md border-2 border-primary/50 dark:border-primary-dark bg-lighttext/20 dark:bg-accent-dark animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="flex gap-5">
            <div className="h-12 w-full rounded-md bg-primary/60 dark:bg-primary-dark/70 animate-pulse" />
            <div className="h-12 w-12 rounded-md bg-lighttext/30 dark:bg-accent-dark animate-pulse" />
          </div>

          {/* Share and Delivery Skeleton */}
          <div className="flex w-max gap-10">
            <div className="h-6 w-24 bg-lighttext/30 dark:bg-accent-dark animate-pulse rounded" />
            <div className="h-6 w-36 bg-lighttext/30 dark:bg-accent-dark animate-pulse rounded" />
          </div>

          {/* Return Policy Skeleton */}
          <div className="h-32 w-full rounded-md border-2 border-lighttext/30 dark:border-accent-dark bg-lighttext/10 dark:bg-secondary-dark animate-pulse" />

          {/* Shipping Info Skeleton */}
          <div className="h-32 w-full rounded-md border-2 border-lighttext/30 dark:border-accent-dark bg-lighttext/10 dark:bg-secondary-dark animate-pulse" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="my-16 px-5 space-y-4">
        <div className="h-6 w-full max-w-4xl mx-auto bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
        <div className="h-6 w-full max-w-4xl mx-auto bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
        <div className="h-6 w-3/4 max-w-4xl mx-auto bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
        <div className="h-6 w-5/6 max-w-4xl mx-auto bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
        <div className="h-6 w-full max-w-4xl mx-auto bg-lighttext/20 dark:bg-accent-dark animate-pulse rounded" />
      </div>
    </div>
  )
}
