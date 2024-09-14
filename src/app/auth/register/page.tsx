"use client"

import { useAppContext } from '@/context'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import {toast} from 'sonner'

export default function Register() {
    const {COMPANY_NAME} = useAppContext()
  
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')

    const handleSubmit = async (e:React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      if(!name || !email || !password  || !username) {
          toast.error("All Fields are required")
          return;
      }
      try {
          const response = await fetch('/api/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,email,password, username
          })
    })

    const data = await response.json()

    if(response.ok){
      setName("")
      setEmail("")
      setPassword("")
      setUsername("")
      toast.success(data.message)
    }else{
      console.log("User Registration failed")
      toast.error(data.message)
      setPassword("")
    }
      } catch (error) {
        console.log(error)
    toast.error("An Error Occured during sign-up")
    setPassword("")
      }finally{
    setIsLoading(false)
  }
  }
  return (
    <div className='bg-base-200 min-h-screen flex'>
   <div className='flex flex-row w-full'>
        <div className='bg-green-200 h-screen w-full lg:flex justify-center items-center hidden'>
        <Image 
          src='/login.svg'
          width={500}
          height={500}
          alt='banner'
        />
        </div>
        <div className='max-w-md w-full px-10 py-20 flex flex-col justify-center mx-auto min-h-screen lg:h-screen overflow-y-auto'>
          <div className=''>
          <h1 className="text-3xl font-bold">Welcome to {" "+COMPANY_NAME}</h1>
        <p className='py-2 text-sm'>
          Join in on our thriving community
        </p>
          </div>
          <div className="bg-base-100 w-full">
          <form className="space-y-4 py-5" onSubmit={handleSubmit}>
            <div className="text-sm flex flex-col gap-2">
          <label className="font-semibold">
            <span>Full name</span>
          </label>
          <input
           type="text" 
           placeholder="John Doe" 
           className="border-2 p-2 rounded-md"
           value={name}
           onChange={(e) => setName(e.target.value)} 
           required 
           />
        </div>
        <div className="text-sm flex flex-col gap-2">
          <label className="font-semibold">
            <span>Password</span>
          </label>
          <input
           type="password" 
           placeholder="password" 
           className="border-2 p-2 rounded-md"
           value={password}
           onChange={(e) => setPassword(e.target.value)} 
           required />
        </div>
        <div className="text-sm flex flex-col gap-2">
          <label className="font-semibold">
            <span>username*</span>
          </label>
          <input 
            type="text"
            placeholder="username"
            className="border-2 p-2 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="text-sm flex flex-col gap-2">
          <label className="font-semibold">
            <span>Email</span>
          </label>
          <input 
            type="email"
            placeholder="email"
            className="border-2 p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
                        <label className="mt-2 text-right">
                <span className="mt-2 hover:underline text-xs pt-2">
                Already have an account?{" "} 
          <Link 
            href="login" 
            className='font-bold'
          >
            Log In
          </Link>
                </span>
              </label>
        </div>
        <button 
        className={
          `btn bg-[#f7931a] text-slate-100 w-[90%] hover:bg-[#ff8c00] ${isLoading?"cursor-not-allowed":"cursor-pointer"} rounded-md ml-[5%] text-sm py-2 mt-2`} 
        disabled={isLoading}
        >
          {isLoading?"Signing up...":"Create Account"}
        </button>
        </form>
          </div>

        </div>
    </div>
    </div>
 
  )
}
