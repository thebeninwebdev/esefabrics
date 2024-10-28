'use client'

import React from "react"
import { SessionProvider } from "next-auth/react"

interface Props{
    children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({children}) => {
    return <SessionProvider> {children} </SessionProvider>
}