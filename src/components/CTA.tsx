// components/ClothingCTA.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function ClothingCTA() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission, like sending to an API
    console.log('Submitted email:', email);
    // Reset form after submission
    setEmail('');
    // Show success message or trigger a toast notification
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cta-background.svg"
          alt="Fashion collection background"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Elevate Your Style</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join our community and get early access to new collections, 
              exclusive offers, and styling tips from our fashion experts.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 dark:border-white/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-black hover:bg-white/90 hover:text-black flex items-center gap-2"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-white/70">
                By subscribing, you agree to receive marketing communications from us.
                Don't worry, we respect your privacy and you can unsubscribe anytime.
              </p>
            </form>
          </div>

          {/* Right column - Visual element/card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xl">MEMBER BENEFITS</h3>
              <div className="h-1 w-16 bg-white rounded-full"></div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Early Access</h4>
                  <p className="text-sm text-white/80">Shop new collections 24 hours before everyone else</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Exclusive Discounts</h4>
                  <p className="text-sm text-white/80">Enjoy member-only promotions and seasonal sales</p>
                </div>
              </li>
            </ul>
            
            <Button 
              className="w-full mt-6 bg-white text-black hover:bg-white/90 hover:text-black"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}