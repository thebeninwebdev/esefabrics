'use client'
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Link from "next/link"


const banners = [
    { src: "/slide-1.webp", alt: 'Fashion 1', text: 'Style With Comfort', sideKickText: "You can have anything you want in life if you dress for it." },
    { src: "/slide-2.webp", alt: 'Fashion 2', text: 'Fashion Forward', sideKickText: "Style is a way to say who you are without having to speak." },
    { src: "/slide-3.webp", alt: 'Fashion 3', text: 'Express Yourself', sideKickText: "Clothes mean nothing until someone lives in them." },
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
          <div className="absolute inset-0 bg-black bg-opacity-40 text-slate-200 flex p-2 sm:p-5 flex-col justify-between">
            <div className="space-y-2">
            <p className="max-w-sm">{banners[index].sideKickText.toUpperCase()}</p>
            <Link href='/categories' className="underline text-sm lg:block hidden">SHOP NOW</Link>
            </div>
            
            <div className="space-y-3">
            <Link href='/' className="underline text-sm lg:hidden">SHOP NOW</Link>
            <h2 className=" text-4xl md:text-6xl font-bold uppercase tracking-widest">
              {banners[index].text}
            </h2>
            </div>
          </div>
        </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}