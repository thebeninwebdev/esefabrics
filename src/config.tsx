import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Home, Settings, User } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Home',
      href: '/dashboard',
      icon: <Home size={20} />,
      active: isNavItemActive(pathname, '/dashboard'),
      position: 'top',
    },
    {
      name: 'Products',
      href: '/',
      icon: <User size={20} />,
      active: pathname === '/',
      position: 'top',
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, '/categories'),
      position: 'top',
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/projects'),
      position: 'top',
    },
  ];
};