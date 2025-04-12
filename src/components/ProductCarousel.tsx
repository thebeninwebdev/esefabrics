"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import ImageMagnifier from "./ImageMagnifier"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProductImage {
  url: string
  id: string
}

interface ProductCarouselProps {
  images: ProductImage[]
}

const ProductCarousel = ({ images }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Preload images for smoother experience
  useEffect(() => {
    if (!images || images.length === 0) return

    const preloadImages = async () => {
      setIsLoading(true)
      try {
        await Promise.all(
          images.map((image) => {
            return new Promise((resolve, reject) => {
              const img = new Image()
              img.src = image.url
              img.onload = resolve
              img.onerror = reject
            })
          }),
        )
      } catch (error) {
        console.error("Failed to preload images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [images])

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 flex items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4">
        {/* Thumbnails - vertical on desktop, horizontal on mobile */}
        <div
          className={cn(
            "order-2 lg:order-1",
            "flex lg:flex-col",
            "overflow-x-auto lg:overflow-y-auto",
            "gap-2 mt-4 lg:mt-0",
            "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
            "pb-2 lg:pb-0 lg:pr-2",
            "lg:max-h-[600px]",
          )}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-300",
                "border-2 rounded overflow-hidden",
                "w-16 h-16 sm:w-20 sm:h-20",
                "hover:opacity-90",
                currentIndex === index ? "border-primary dark:border-primary" : "border-gray-200 dark:border-gray-700",
              )}
              onClick={() => goToSlide(index)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.id || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main image display */}
        <div className="order-1 lg:order-2 relative">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-lg",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]",
            )}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ImageMagnifier
                src={images[currentIndex]?.url || "/placeholder.svg"}
                magnifierWidth={isMobile ? 280 : 300}
                magnifierHeight={isMobile ? 280 : 300}
                zoomLevel={2.5}
                alt={images[currentIndex]?.id || "Product image"}
              />
            )}

            {/* Zoom indicator for desktop */}
            {!isMobile && !isLoading && (
              <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-sm flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <ZoomIn className="h-4 w-4" />
                <span className="hidden sm:inline">Hover to zoom</span>
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          <button
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2",
              "bg-white/90 dark:bg-gray-800/90",
              "rounded-full p-1 sm:p-2",
              "shadow-md border border-gray-200 dark:border-gray-700",
              "text-gray-700 dark:text-gray-200",
              "hover:bg-white dark:hover:bg-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "transition-all duration-200",
            )}
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "bg-white/90 dark:bg-gray-800/90",
              "rounded-full p-1 sm:p-2",
              "shadow-md border border-gray-200 dark:border-gray-700",
              "text-gray-700 dark:text-gray-200",
              "hover:bg-white dark:hover:bg-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "transition-all duration-200",
            )}
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Image counter */}
      <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default ProductCarousel
