"use client"
import React from 'react'
import { signOut } from 'next-auth/react'

export default function page() {
  return (
    <div className="w-full flex justify-between">
      Page<button onClick={() => signOut()}>sign out</button>
    </div>
  )
}
