'use client';

import React from 'react';

import Link from 'next/link';
import { CiShop, CiHeart, CiShoppingCart, CiUser, CiSearch } from 'react-icons/ci';

import useNavigation from '@/hook/use-navigation';
import useScrollingEffect from '@/hook/use-scroll';

const BottomNav = () => {
  const scrollDirection = useScrollingEffect(); // Use the custom hook
  const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';

  const {
    isHomeActive,
    isWishlistActive,
    isSearchActive,
    isDashboardActive
  } = useNavigation();

  return (
    <div
      className={`fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ${navClass} text-accent dark:text-accent-dark`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        <Link href="/" className="flex items-center relative">
          {isHomeActive ? (
            <CiShop className="w-6 h-6" />
          ) : (
            <CiShop className="w-6 h-6" />
          )}
        </Link>
        <Link href="/search" className="flex items-center">
          {isSearchActive ? (
            <CiSearch
            className="w-6 h-6"
            />
          ) : (
            <CiSearch className="w-6 h-6" />
          )}
        </Link>
        <Link href="/dashboard" className="flex items-center">
          {isDashboardActive ? (
            <CiUser className="w-6 h-6" />
          ) : (
            <CiUser className="w-6 h-6" />
          )}
        </Link>
        <Link href="/wishlist" className="flex items-center">
          {isWishlistActive ? (
            <CiHeart className="w-6 h-6" />
          ) : (
            <CiHeart className="w-6 h-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;