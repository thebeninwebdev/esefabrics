// components/QualityFeatures.tsx
'use client';

import { Leaf, PiIcon, Asterisk } from 'lucide-react';
import {motion} from "framer-motion"

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 max-w-xs">
      {description}
    </p>
  </div>
);

export default function QualityFeatures() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "High-Quality Materials",
      description: "Crafted with precision and excellence, our activewear is meticulously engineered using premium materials to ensure unmatched comfort and durability.",
    },
    {
      icon: <PiIcon className="w-8 h-8" />,
      title: "Laconic Design",
      description: "Simplicity refined. Our activewear embodies the essence of minimalistic design, delivering effortless style that speaks volumes.",
    },
    {
      icon: <Asterisk className="w-8 h-8" />,
      title: "Various Sizes",
      description: "Designed for every body and anyone, our activewear embraces diversity with a wide range of sizes and shapes, celebrating the beauty of individuality.",
    },
  ];

  return (
    <section className="w-full py-16 relative">
      <motion.div 
      className="max-w-6xl mx-auto px-4"
      initial={{
        opacity: 0,
    }}
    whileInView={{
        opacity: 1,
        transition:{
            duration: 3
        }
    }}
    viewport={{
        once: true,
        amount:.4
    }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Quality is our priority</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Our talented stylists have put together outfits that are perfect for the season. 
            They've variety of ways to inspire your next fashion-forward look.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}