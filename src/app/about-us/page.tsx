'use client'

import React from 'react';
import QualityFeatures from '@/components/QualityFeatures';
import ReviewSlider from '@/components/ReviewSlider';

import {motion} from "framer-motion"

const transition = {duration: 1, ease: [.25,.1,.25,1]};
const variants = {
    hidden: {filter: "blur(10px)", transform: "translateY(20%)", opacity: 0},
    visible: {filter: "blur(0)", transform: "translateY(0)", opacity: 1},
}

const text = "Fashion Reimagined With us"

export default function page() {
    const words = text.split(" ");
  return (
    <div className='space-y-5 overflow-x-hidden'>
        <div className='relative h-[400px] w-full bg-cover bg-center' style={{backgroundImage: "url('/about-us.webp')"}}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <motion.div 
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.04}}
            viewport={{
                once: true,
                amount: "all"
            }}
            className='relative z-10 flex flex-col items-center justify-center h-full text-center px-4'>
                <h1 className='text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 tracking-light max-w-xl'>
                    {
                    words.map((word, index:number) => (
                        <React.Fragment key={index}>
                            <motion.span className='inline-block' transition={transition} variants={variants}>
                                {word}
                            </motion.span>
                            {index < words.length - 1 && ' '}
                        </React.Fragment>
                    ))}
                </h1>
            </motion.div>
        </div>
        <main className='space-y-5'>
        <div 
        className="px-8 text-center py-8 space-y-5 max-w-[60ch] mx-auto"
        
        >
            <h2 className="text-2xl font-bold">We are Esefabrics</h2>
            <p className="md:text-md">Welcome to our classic men's clothing store, where we believe that timeless style never goes out of fashion, Our collection features classic pieces that are both stylish and versatile, perfect for building a wardrobe that will last for years.</p>
        </div>
        <hr/>
        <motion.div 
        className="container mx-auto px-4 py-16"
        initial={{
            opacity: 0,
            scale:0.75
        }}
        whileInView={{
            opacity: 1,
            scale: 1,
            transition:{
                duration: 2
            }
        }}
        viewport={{
            once: true,
            amount: .4
        }}
        >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                <div
                        
                 className="w-full aspect-square">
                    <img
                        src="/founder.webp"
                        alt="Our Story"
                        className='w-full h-full object-cover shadow-lg'
                    />
                </div>
                <div className="space-y-6">
                    <h2 className='text-3xl md:text-4xl font-bold'>Established - 1993</h2>
                    <div className="space-y-4">
                        <p>Esefabrics was founded in 1995 by John Doe, a fashion lover with a passion for timeless style. John had always been drawn to classic pieces that could be worn season after season, and he believed that there was a gap in the market for a store that focused solely on classic men's clothing. He opened the first store in a small town in Benin, where it quickly became a local favourite.</p>
                    </div>
                </div>
            </div>
        </motion.div>
        <div className="container mx-auto px-4 py-16">
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <motion.div 
            className="w-full aspect-square lg:order-2"
            initial={{
                x: "100%",
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
                    <img
                        src="/about-2.webp"
                        alt="Our Story"
                        className='w-full h-full object-cover shadow-lg'
                    />
                </motion.div>
                <div className="space-y-6 lg:order-1">
                    <h2 className='text-3xl md:text-4xl font-bold'>Our mission</h2>
                    <div className="space-y-4">
                        <p>Our mission is to empower people throught sustainable fashion. We want everyone to look and feel good, while also doing our part to help the environment. We believe that fashion should be stylish, affordable and accessible to everyone. Body posistivity and inclusivity are values that are at the heart of our brand.</p>
                    </div>
                </div>
            </div>
        </div>
        <QualityFeatures />
        <ReviewSlider/>
        </main>

    </div>
  )
}
