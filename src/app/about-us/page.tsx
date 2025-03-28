'use client'

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample review data 
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "March 15, 2024",
    comment: "Absolutely amazing product! Exceeded all my expectations. The quality is outstanding and it arrived much faster than I anticipated.",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4,
    date: "February 28, 2024",
    comment: "Great product with excellent customer service. Minor packaging issue, but the team resolved it quickly.",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    date: "January 10, 2024",
    comment: "I've been recommending this to all my friends. The design is sleek and functional. Truly a top-notch product!",
    avatar: "/api/placeholder/40/40"
  }
];

export default function page() {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => 
      (prev + 1) % reviews.length
    );
  };

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => 
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const renderStars = (rating:number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  const currentReview = reviews[currentReviewIndex];

  return (
    <div className='space-y-5'>
        <div className='relative h-[400px] w-full bg-cover bg-center' style={{backgroundImage: "url('/about-us.jpg')"}}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className='relative z-10 flex flex-col items-center justify-center h-full text-center px-4'>
                <h1 className='text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 tracking-light'>
                    Fashion Reimagined
                    <span className="block text-sm md:text-base lg:text-lg mt-2 bg-primary font-bold w-max mx-auto px-3 py-1 rounded-md">
                        With us
                    </span>
                </h1>
            </div>
        </div>
        <main className='space-y-5'>
        <div className="px-8 text-center py-8 space-y-5 max-w-[60ch] mx-auto">
            <h2 className="text-2xl font-bold">We are Esefabrics</h2>
            <p className="md:text-md">Welcome to our classic men's clothing store, where we believe that timeless style never goes out of fashion, Our collection features classic pieces that are both stylish and versatile, perfect for building a wardrobe that will last for years.</p>
        </div>
        <hr/>
        <div className="container mx-auto px-4 py-16">
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                <div className="w-full aspect-square">
                    <img
                        src="/founder.jpg"
                        alt="Our Story"
                        className='w-full h-full object-cover rounded-lg shadow-lg'
                    />
                </div>
                <div className="space-y-6">
                    <h2 className='text-3xl md:text-4xl font-bold'>Established - 1993</h2>
                    <div className="space-y-4">
                        <p>Esefabrics was founded in 1995 by John Doe, a fashion lover with a passion for timeless style. John had always been drawn to classic pieces that could be worn season after season, and he believed that there was a gap in the market for a store that focused solely on classic men's clothing. He opened the first store in a small town in Benin, where it quickly became a local favourite.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className="w-full aspect-square lg:order-2">
                    <img
                        src="/about-2.jpg"
                        alt="Our Story"
                        className='w-full h-full object-cover rounded-lg shadow-lg'
                    />
                </div>
                <div className="space-y-6 lg:order-1">
                    <h2 className='text-3xl md:text-4xl font-bold'>Our mission</h2>
                    <div className="space-y-4">
                        <p>Our mission is to empower people throught sustainable fashion. We want everyone to look and feel good, while also doing our part to help the environment. We believe that fashion should be stylish, affordable and accessible to everyone. Body posistivity and inclusivity are values that are at the heart of our brand.</p>
                    </div>
                </div>
                
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                <div className="w-full aspect-square">
                    <img
                        src="/founder.jpg"
                        alt="Our Story"
                        className='w-full h-full object-cover rounded-lg shadow-lg'
                    />
                </div>
                <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {/* Review Navigation Buttons */}
        <button 
          onClick={handlePrevReview} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button 
          onClick={handleNextReview} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>

        {/* Review Content */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Avatar className="mr-4">
              <AvatarImage src={currentReview.avatar} alt={currentReview.name} />
              <AvatarFallback>{currentReview.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {currentReview.name}
              </h3>
              <p className="text-sm text-gray-500">
                {currentReview.date}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center mb-4">
            {renderStars(currentReview.rating)}
          </div>

          {/* Review Text */}
          <p className="text-gray-700 italic mx-4 mb-4">
            "{currentReview.comment}"
          </p>

          {/* Review Indicators */}
          <div className="flex justify-center space-x-2">
            {reviews.map((_, index) => (
              <span 
                key={index} 
                className={`h-2 w-2 rounded-full ${
                  index === currentReviewIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
            </div>
        </div>

        </main>

    </div>
  )
}
