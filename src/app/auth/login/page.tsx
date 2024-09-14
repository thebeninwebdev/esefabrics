"use client"

import {useState} from 'react'
import {signIn} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {IoCloseOutline} from "react-icons/io5"
import Image from 'next/image'
import { toast } from 'sonner'

export default function Authentication() {
  const router = useRouter()
    
  const [resetPassword, setResetPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    <div className="bg-base-200 min-h-screen flex">
      <div className='flex flex-row w-full'>
      <div className='bg-green-200 min-h-screen w-full lg:flex justify-center items-center hidden'>
        <Image 
          src='/login.svg'
          width={500}
          height={500}
          alt='banner'
        />
      </div>
      <div className='max-w-md w-full px-10 py-20 flex flex-col justify-center mx-auto'>
      {resetPassword && <div className='relative top-0 left-0 z-50 py-2 cursor-pointer' onClick={() => setResetPassword(false)}>
        <IoCloseOutline/>
      </div>}
        <div>
          <h1 className="text-3xl font-bold">
            {resetPassword?
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
            resetPassword?
            <form className="space-y-4 py-5 " onSubmit={submitResetPassword}>
            <div className="text-sm flex flex-col gap-2">
              <label className="font-semibold">
                <span className="">Email</span>
              </label>
              <input 
              type="email" 
              placeholder="email" 
              className="border-2 p-2 rounded-md" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <button
className={
  `btn bg-[#f7931a] text-slate-100 w-[90%] hover:bg-[#ff8c00] ${isLoading?"cursor-not-allowed":"cursor-pointer"} rounded-md ml-[5%] text-sm py-2 mt-2`
} 
                      disabled={isLoading}
                      >
                        {!isLoading?"Reset password":"Submiting..."}
                      </button>
            </div>
          </form>
          :
          <form className="space-y-4 py-5" onSubmit={handleSubmit}>
            <div className="text-sm flex flex-col gap-2">
              <label className="font-semibold">
                <span className="">Email/Username</span>
              </label>
              <input type="text" placeholder="email" className="border-2 p-2 rounded-md" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-sm flex flex-col gap-2">
              <label className="font-semibold">
                <span className="">Password</span>
              </label>
              <input type="password" placeholder="password" className="border-2 p-2 rounded-md" required               
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              <label className="mt-2 text-right">
                <a onClick={() => setResetPassword(true)} className="mt-2 hover:underline">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="">
            <button
            className={
          `btn bg-[#f7931a] text-slate-100 w-[90%] hover:bg-[#ff8c00] ${isLoading?"cursor-not-allowed":"cursor-pointer"} rounded-md ml-[5%] text-sm py-2 mt-2`
        }
        disabled={isLoading}
        >
          {isLoading?"Logging in...":"Sign in"}
        </button>
            </div>
          </form>
          }
        </div>
      </div>
      </div>

    </div>
  )
}