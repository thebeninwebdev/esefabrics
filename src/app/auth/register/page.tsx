"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { motion } from "framer-motion"
import { FaSpinner } from 'react-icons/fa'
import { GoEyeClosed, GoEye } from 'react-icons/go'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"



export default function Register() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [phoneNumber, setPhoneNumuber] = useState("")
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(true)

  interface Country {
    name: string;
    dialCode: string;
    countryCode: string;
    format: string;
  }

  const handleChange = (value:string, country:Country) => {
    setPhoneNumuber(value);
    setValidPhoneNumber(validatePhoneNumber(value, country))
  }

  const validatePhoneNumber = (phoneNumber:string, country:Country) => {

    // Check if phoneNumber starts with the country's dial code
    if (phoneNumber.startsWith(country.dialCode)) {
      // Remove the dial code from the phone number
      phoneNumber = phoneNumber.slice(country.dialCode.length);
    }

    const phoneNumberPattern = /^\d{10,15}$/

    const isValid = phoneNumberPattern.test(phoneNumber)

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (!name || !email || !password || !username) {
      toast.error("All Fields are required")
      return
    }
    try {
      const response = await fetch('/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, username })
      })

      const data = await response.json()
      if (response.ok) {
        setName("")
        setEmail("")
        setPassword("")
        setUsername("")
        toast.success(data.message)
      } else {
        toast.error(data.message)
        setPassword("")
      }
    } catch (error) {
      toast.error("An Error Occurred during sign-up")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex text-text dark:text-text-dark'>
      <div className='flex flex-row w-full'>
        <div className='bg-green-200 h-screen w-full lg:flex justify-center items-center hidden dark:bg-primary-dark'>
          <Image src='/login.svg' width={500} height={500} alt='banner' priority />
        </div>
        <div className='max-w-md w-full px-10 pt-20 flex flex-col justify-center mx-auto min-h-screen overflow-y-auto lg:h-screen'>
          <div className='pb-8'>
            <div className='flex justify-center items-center h-full'>
              <div className="max-w-full w-[200px]">
                <Image src="/logo.png" alt="logo" width={342} height={63} className='object-contain block' />
              </div>
            </div>
            <p className='mt-1 text-sm w-full text-center'>Join in on our thriving community</p>
          </div>

          <form 
          className="space-y-4 py-5" 
          onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span>Full name</span>
              </label>
              <input type="text" placeholder="John Doe" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Password Field */}
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span>Password</span>
              </label>
              <div className='relative'>
                <input type={showPassword ? "text" : "password"} placeholder={showPassword ? "password" : "--------"} className={`border-2 p-2 rounded-md border-complement dark:border-complement-dark outline-none placeholder:text-text tracking-widest ${!showPassword && "placeholder:text-lg"} dark:placeholder:text-text-dark dark:bg-transparent w-full`} required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textlight dark:text-text-dark focus:outline-none">
                  {showPassword ? <GoEyeClosed className='w-4 h-4' /> : <GoEye className='w-4 h-4' />}
                </button>
              </div>
            </div>

            {/* Username Field */}
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span>Username</span>
              </label>
              <input type="text" placeholder="username" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            {/* Phone number Field */}
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span>Phone</span>
              </label>
              <PhoneInput
              country={"ng"}
              value={phoneNumber} 
              onChange={handleChange}
              buttonStyle={{background:"transparent",outline:"none", border:"none"}}
              buttonClass='button'
              dropdownStyle={{background:"white", color:"black"}}
              inputProps={{
                required:true,
                className:"border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent w-full pl-12 "
              }}
               />
              {!validPhoneNumber && <p className="text-red-400 w-full  text-center">Please enter a valid 10-digit phone number</p>}
            </div>
            {/* Email Field */}
            <div className="text-xs flex flex-col gap-2">
              <label className="font-medium">
                <span>Email</span>
              </label>
              <input type="email" placeholder="email" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Terms and Conditions Checkbox */}
{/* Terms and Conditions Checkbox */}
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="terms-checkbox"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    required
    className="hidden" // Hide the native checkbox
  />
  
  {/* Custom checkbox replacement */}
  <label
    htmlFor="terms-checkbox"
    className={`relative flex items-center justify-center w-4 h-4 border-2 rounded-sm cursor-pointer 
      ${agreedToTerms ? "bg-primary dark:bg-primary-dark" : "bg-transparent"}
      border-primary dark:border-primary-dark`}
  >
    {agreedToTerms && (
      <span className="text-white text-xs font-bold">&#10003;</span>
    )}
  </label>

  {/* Label text */}
  <label htmlFor="terms-checkbox" className="text-xs cursor-pointer">
    I agree to the
    <Link href="/terms" className="text-primary dark:text-primary-dark hover:underline ml-1">
      Terms and Conditions
    </Link>
  </label>
</div>


            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading ? "cursor-not-allowed rounded-full" : "cursor-pointer rounded-md"} text-sm py-2 mt-2`}
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? (
                <div className='w-full flex justify-center'>
                  <FaSpinner className='w-5 h-5 animate-spin' />
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* Already Registered Prompt */}
            <p className="text-xs text-center mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-bold dark:text-primary-dark hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}