// app/auth/login/page.tsx

import React, { Suspense } from 'react';
import Authentication from './Authentication';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Authentication />
    </Suspense>
  );
}
