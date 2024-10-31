'use client'
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"


const banners = [
    { src: "/slide-1.jpg", alt: 'Fashion 1', text: 'Style With Comfort' },
    { src: "/slide-2.jpg", alt: 'Fashion 2', text: 'Fashion Forward' },
    { src: "/slide-3.jpg", alt: 'Fashion 3', text: 'Express Yourself' },
  ];

export function HomeSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full cursor-pointer h-max"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
              <div key={index} className="relative w-full overflow-hidden h-[calc(100vh_-_200px)]">
          <Image
            src={banners[index].src}
            alt={banners[index].alt}
            width={1920}
            height={1280}
            className="object-cover w-full h-full"
            priority
            style={{objectPosition: '15% 15%'}}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-4xl md:text-6xl font-extrabold uppercase tracking-widest">
              {banners[index].text}
            </h2>
          </div>
        </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}