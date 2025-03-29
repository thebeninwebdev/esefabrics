// components/Footer.tsx
'use client';

import Link from 'next/link';
import {
  ArrowRight 
} from 'lucide-react';
import {motion} from "framer-motion"
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Top section - Benefits */}
      <div className="border-t border-b border-text py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="text-center border-r border-primary last:border-r-0">
            <h3 className="font-bold text-lg mb-2">Multiple Payment</h3>
            <p className=" text-sm">Pay with Multiple Credit Cards</p>
          </div>
          
          <div className="text-center border-r border-primary last:border-r-0">
            <h3 className="font-bold text-lg mb-2">Return Policy</h3>
            <p className=" text-sm">Within 30 days for an exchange</p>
          </div>
          
          <div className="text-center border-r border-primary last:border-r-0">
            <h3 className="font-bold text-lg mb-2">Premium Support</h3>
            <p className=" text-sm">Outstanding premium support</p>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand and Contact */}
            <div>
              <Link href="/" className="inline-block mb-6">
                <h2 className="text-2xl font-bold">esefabrics</h2>
              </Link>
              
              <div className="space-y-2 ">
                <p>Address: 1234 Fashion Street, Suite 567,</p>
                <p>Benin city, Edo state</p>
                <p>Email: info@esefabrics.com</p>
                <p>Phone: +234 901 411 6505</p>
                <div className='py-6'>
                <Link href="/directions" className="inline-flex items-center font-medium border-b border-gray-400 text-nowrap">
                  Get direction <motion.span className='w-full' initial={{x:0}} whileHover={{x:8}}>
                  <ArrowRight className="ml-1 w-4 h-4" />
                    </motion.span>
                </Link>
                </div>
               
                
                <div className="flex space-x-2 mt-6">
                  <Link href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:opacity-75">
                    <FaFacebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:opacity-75">
                    <FaTwitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:opacity-75">
                    <FaInstagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" aria-label="TikTok" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:opacity-75">
                    <FaTiktok className="w-5 h-5" />
                  </Link>
                  <Link href="#" aria-label="Pinterest" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:opacity-75">
                    <FaPinterest className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Help */}
            <div>
  <h3 className="text-lg font-bold mb-6">Help</h3>
  <ul className="space-y-4">
    <li>
      <Link
        href="/privacy-policy"
        className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
      >
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link
        href="/delivery-return"
        className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
      >
        Returns + Exchanges
      </Link>
    </li>
    <li>
      <Link
        href="/terms"
        className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
      >
        Terms & Conditions
      </Link>
    </li>
    <li>
      <Link
        href="#"
        className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
      >
        FAQ's
      </Link>
    </li>
    <li>
      <Link
        href="#"
        className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
      >
        My Wishlist
      </Link>
    </li>
  </ul>
</div>

            
            {/* About us */}
            <div>
              <h3 className="text-lg font-bold mb-6">About us</h3>
              <ul className="space-y-4">
                <li><Link 
                className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
                href="#">Visit Our Store</Link></li>
                <li><Link 
                className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
                href="#">Contact Us</Link></li>
                <li><Link 
                className="relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-0 after:bg-text dark:after:bg-text-dark after:transition-all after:duration-500 hover:after:w-full"
                href="/about-us">About Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section - Copyright and payment */}
      <div className="border-t border-primary py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="">© 2025 Esefabrics Store. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}