"use client"
import React from 'react'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  return (
    <div className="w-full flex justify-between text-text dark:text-text">
      Page<button onClick={() => signOut()}>sign out</button>
    </div>
  )
}
