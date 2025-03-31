'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductCarousel = ({ images }:{images:{url:string, id:string}[]}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index:number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative p-4 flex-row-reverse lg:flex gap-4">
      <div className='relative'>
      {/* Main image display */}
      <div className="w-full h-[600px] relative">
        <img
          src={images[currentIndex]?.url}
          alt={images[currentIndex]?.id || "Product image"}
          className="w-full h-full object-cover bg-inherit"
        />
      </div>

      {/* Navigation arrows for main image */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer dark:text-text border-2" onClick={goToPrevious}>
        <ChevronLeft className="h-6 w-6" />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer dark:text-text border-2" onClick={goToNext}>
        <ChevronRight className="h-6 w-6" />
      </div>
      </div>


      {/* Thumbnail navigation */}
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 mt-4 pb-2 lg:gap-2">
        {images.map((image, index:number) => (
          <div 
            key={index}
            className={cn(
              "flex-shrink-0 w-20 h-20 cursor-pointer border-2 transition-all duration-300",
              currentIndex === index ? "border-text dark:text-text-dark" : "border-transparent"
            )}
            onClick={() => goToSlide(index)}
          >
            <img 
              src={image.url} 
              alt={image.id || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductCarousel;