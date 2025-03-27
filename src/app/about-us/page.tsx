import React from 'react'

export default function page() {
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
        </main>

    </div>
  )
}
