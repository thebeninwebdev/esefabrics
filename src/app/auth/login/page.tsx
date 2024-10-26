"use client"

import {useState, useEffect} from 'react'
import {signIn} from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {IoCloseOutline} from "react-icons/io5"
import Image from 'next/image'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaSpinner } from 'react-icons/fa'
import { GoEyeClosed, GoEye } from 'react-icons/go'

export default function Authentication() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPassword = searchParams.get("reset")
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {


  },[resetPassword])

  const handleSubmit = async (e:React.FormEvent) => {
    try{
      e.preventDefault()
      setIsLoading(true)

    // Step 1: Verify the user
    const verifyResponse = await fetch('/api/verify-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      // Display error message from the verify-user response
      toast.error(verifyData.error);
      return;
    }

        // Step 2: Proceed to sign in with NextAuth if verification passed
        const authResponse = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
    
    
        if (authResponse?.error) {
          // Display error message from NextAuth response
          toast.error("Incorrect username or password");
          return
        } else {
          toast.success('Login successful');
        }
        router.push('/dashboard') // Redirect to dashboard or another page
        toast.success("Login successful")
        setEmail("")
        setPassword("")
    }catch(error){
      console.log(error)
      toast.error('Please check internet connection')
      setPassword('')
    }finally{
      setIsLoading(false)
    }
  }

  const submitResetPassword = async (e:React.FormEvent) => {
    e.preventDefault()
    
    try{
      setIsLoading(true)
      const response = await fetch('/api/reset',{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email})
      })
      if(response.ok){
        setEmail("")
        toast.success("We have sent you an email")
      }else{
        toast.error("Plaese Check your internet connection")
      }
    }catch(error){
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex text-text dark:text-text-dark">
      <div className='flex flex-row w-full'>
      <div className='bg-green-200 min-h-screen w-full lg:flex justify-center items-center hidden dark:bg-primary-dark'>
        <Image 
          src='/login.svg'
          width={500}
          height={500}
          alt='banner'
          priority
        />
      </div>
      <div className='max-w-md w-full px-10 py-20 flex flex-col justify-center mx-auto'>
      {resetPassword === "true" && 
      <div className='relative top-0 left-0 z-50 pb-10 cursor-pointer flex gap-2 items-center' onClick={() =>     router.push("?reset=false",
        {
          scroll:false
        }
      )}>
        
        <motion.div initial={{rotateZ:"0deg"}} whileHover={{rotateZ:"90deg"}}><IoCloseOutline className=' bg-neutral-700 w-7 h-7 p-1 rounded-full text-white dark:bg-slate-200  dark:text-black'/></motion.div> <span className='text-sm'>Close</span>
      </div>}
        <div>
          <h1 className="text-3xl font-bold text-complement dark:text-complement-dark">
            {resetPassword === "true"?
          "Reset password!":"Welcome back!"}
          </h1>
          <p className="py-2 text-sm">
            {
            resetPassword
            ?
            "Enter your email address so we can find your account."
            :
            "Securely access your account and take control of your cryptocurrency assets"
            }
          </p>
        </div>
        <div className="bg-base-100 w-full">
          {
            resetPassword === "true"?
            <form className="space-y-4 py-4 " onSubmit={submitResetPassword}>
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span className="">Email</span>
              </label>
              <input 
              type="email" 
              placeholder="johndoe@example.com" 
              className="border-2 p-2 rounded-md border-complement outline-none dark:border-complement-dark placeholder:text-text tracking-wider bg-transparent dark:placeholder:text-text-dark"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              className={
                `btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading?"cursor-not-allowed rounded-full":"cursor-pointer rounded-md"}  text-sm py-2 mt-2`
              } 
                      disabled={isLoading}
                      >
                        {!isLoading?"Reset password":<div className='w-full flex justify-center'>
          <FaSpinner className='w-5 h-5 animate-spin'/>
          </div>}
                      </motion.button>
            </div>
          </form>
          :
          <form className="space-y-4 py-5" onSubmit={handleSubmit}>
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span className="">Email or Username</span>
              </label>
              <input type="text" placeholder="email" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span className="">Password</span>
              </label>
              <div className='relative'>
              <input
              type={showPassword ? "text" : "password"}
          placeholder={showPassword?"password":"--------"}
          className={`border-2 p-2 rounded-md border-complement dark:border-complement-dark outline-none placeholder:text-text tracking-widest  dark:placeholder:text-text-dark dark:bg-transparent w-full ${!showPassword&&"placeholder:text-lg"}`}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textlight dark:text-text-dark focus:outline-none"
        >
          {showPassword ? <GoEyeClosed  className='w-4 h-4'/> : <GoEye className='w-4 h-4'/>}
        </button>
              </div>

              <div className="flex justify-between w-full pt-2">
              <div className="mt-2 ">
                <Link href="/auth/register"  className="mt-2 hover:underline text-textlight text-xs cursor-pointer">
                  Register
                </Link>
              </div>
              <div className="mt-2 ">
                <a onClick={() => router.push("?reset=true",
        {
          scroll:false
        }
      )} className="mt-2 hover:underline text-textlight text-xs cursor-pointer">
                  Forgot password?
                </a>
              </div>
              </div>

            </div>
            <div className="">
            <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              className={
                `btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading?"cursor-not-allowed rounded-full":"cursor-pointer rounded-md"}  text-sm py-2 mt-2`
              } 
        disabled={isLoading}
        >
          {isLoading?<div className='w-full flex justify-center'>
          <FaSpinner className='w-5 h-5 animate-spin'/>
          </div>:"Sign in"}
        </motion.button>
            </div>
          </form>
          }
        </div>
      </div>
      </div>

    </div>
  )
}