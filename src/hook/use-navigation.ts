'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isWishlistActive,setIsWishlistActive] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isDashboardActive, setIsDashboardActive] = useState(false)
  useEffect(() => {
    setIsHomeActive(false);
    setIsWishlistActive(false);
    setIsDashboardActive(false);
    setIsSearchActive(false);

    switch (pathname) {
      case '/':
        setIsHomeActive(true);
        break;
      case '/wishlist':
        setIsWishlistActive(true);
        break;
      case '/dashboard':
        setIsDashboardActive(true);
        break;
      case '/search':
        setIsSearchActive(true);
        break;
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isDashboardActive,
    isSearchActive,
    isWishlistActive,
  };
};

export default useNavigation;