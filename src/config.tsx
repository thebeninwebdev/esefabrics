import { usePathname } from 'next/navigation';

import { Shapes, Home, ArrowLeftRight, User, SquareChartGantt, Ungroup, Eye } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Dashboard',
      href: 'dashboard',
      icon: <Home size={20} />,
      active: isNavItemActive(pathname, '/dashboard'),
      position: 'top',
    },
    {
      name: 'Products',
      href: 'products',
      icon: <SquareChartGantt size={20} />,
      active: pathname === '/products',
      position: 'top',
    },
    {
      name: 'Categories',
      href: 'categories',
      icon: <Ungroup size={20} />,
      active: isNavItemActive(pathname, '/categories'),
      position: 'top',
    },
    {
      name: 'Orders',
      href: 'orders',
      icon: <ArrowLeftRight size={20} />,
      active: isNavItemActive(pathname, '/projects'),
      position: 'top',
    },
    {
      name: 'Users',
      href: 'users',
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/users'),
      position: 'top',
    },
    {
      name: 'Variants',
      href: 'variants',
      icon: <Shapes size={20} />,
      active: isNavItemActive(pathname, '/variants'),
      position: 'top',
    },
    {
      name: 'Visitors',
      href: 'visitors',
      icon: <Eye size={20} />,
      active: isNavItemActive(pathname, '/visitors'),
      position: 'top',
    },
  ];
};