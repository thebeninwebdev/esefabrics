// components/ReviewSlider.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

type Review = {
  id: number;
  text: string;
  author: string;
  imageSrc: string;
};

const reviews: Review[] = [
  {
    id: 1,
    text: "I have been shopping with this web fashion site for over a year now and I can confidently say it is the best online fashion site out there. The shipping is always fast and the customer service team is friendly and helpful. I highly recommend this site to anyone looking for affordable clothing.",
    author: "Robert Smith",
    imageSrc: "/tets3.jpg",
  },
  {
    id: 2,
    text: "The quality of their products is exceptional. I've ordered multiple items and have never been disappointed. Their sizing is accurate and the materials are durable. Customer support responds quickly to any inquiries.",
    author: "Emma Johnson",
    imageSrc: "/tets4.jpg",
  },
];

export default function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? reviews.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === reviews.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <motion.div 
    className="w-full max-w-6xl mx-auto py-12"
    initial={{
      x: "-100%",
  }}
  whileInView={{
      x: 0,
      transition:{
          duration: 2
      }
  }}
  viewport={{
      once: true
  }}
    >
      <h2 className="text-4xl font-bold mb-8">Our customer's reviews</h2>
      
      <div className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden">
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-6xl mb-6"><Quote className=" w-10 h-10 mb-6" /></div>
          <p className="text-lg mb-6">
            {reviews[currentIndex].text}
          </p>
          <p className="font-medium">{reviews[currentIndex].author}</p>
          
          <div className="flex mt-8 space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-transparent hover:bg-inherit opacity-95" 
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full hover:bg-inherit bg-transparent opacity-95" 
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 relative min-h-[500px]">
          <Image
            src={reviews[currentIndex].imageSrc}
            alt={`Review by ${reviews[currentIndex].author}`}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}