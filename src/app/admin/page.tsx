'use client'

import React from 'react'
import { signOut } from 'next-auth/react'
import { NewProductForm } from '@/components/NewProductForm'

export default function AdminPage() {
  return (
    <div>Admin page 
      <button onClick={() => signOut()}>sign out</button>
      <NewProductForm/>
      </div>
  )
}
