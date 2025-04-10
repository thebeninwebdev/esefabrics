'use client';

import { Suspense } from 'react';
import SearchPage from '@/components/Search';

export default function Search() {

  return (
    <Suspense><SearchPage/></Suspense>
  );
} 