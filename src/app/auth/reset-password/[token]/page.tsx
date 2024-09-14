// "use client"

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

// export default function ResetPassword({params}:any) {

//   const router = useRouter()
  
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [verified, setVerified] = useState(false)

//   const [user, setUser] = useState<any>(null)
  
//   const {data: session, status: sessionStatus} = useSession()

//   useEffect(() => {
// const verifyToken = async () => {
//   try {
//     const res = await fetch("/api/verify-reset-token",{
//       method: "POST",
//       headers: {
//         "Content_Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: params.token,
//       })
//     })
//     if(res.status === 400){
//       toast.error("Invalid token or has expired")
//       setVerified(true)
//     }
//     if(res.status === 200){
//       setVerified(true)
//       const userData = await res.json()
//       setUser(userData)
//     }
//   } catch (error) {
//     toast.error("Error, try again")
//     console.log(error)
//   }

// }
// verifyToken()
//   },[params.token])

//   const handleSubmit = async () => {
//     if(password !== confirmPassword){
//       toast.error("Passwords do not match")
//       return
//     }
//     try {
//       setIsLoading(true)
//       const res = await fetch('/api/confirm-account',{
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: user?.email,
//           password,
//           confirmPassword
//         })
//       })

//       if(res.status === 400){
//         toast.error("Something went wrong, please try again")
//       }
//       if(res.status === 200){
//        router.push('/login')
//       }
//     } catch (error) {
//       toast.error("Error, try again")
//       console.log(error)
//     }finally{
//       setIsLoading(false)
//     }
//   }

//   if(sessionStatus === "loading" || !verified){
//     return <div className='w-full h-screen flex place-content-center text-xl'><span className="loading loading-dots loading-md"></span></div>
//   }
//   return (
//     <div className='py-20 px-5 w-full max-w-96 mx-auto'>
//       {sessionStatus !== "authenticated" &&
//       <>
//       <h1 className='text-3xl font-bold'>Confirm your account</h1>
//       <form className="space-y-4 py-5" onSubmit={handleSubmit}>
//       <div className="text-sm flex flex-col gap-2">
//           <label className="font-semibold">
//             <span>Password</span>
//           </label>
//           <input
//            type="password" 
//            placeholder="New password" 
//            className="input input-bordered"
//            value={password}
//            onChange={(e) => setPassword(e.target.value)} 
//            required />
//         </div>
//       <div className="text-sm flex flex-col gap-2">
//           <label className="font-semibold">
//             <span>Confirm password</span>
//           </label>
//           <input
//            type="password" 
//            placeholder="Confirm password" 
//            className="border-2 p-2 rounded-md"
//            value={confirmPassword}
//            onChange={(e) => setConfirmPassword(e.target.value)} 
//            required />
//         </div>
//         <button
// className={
//   `btn bg-[#f7931a] text-slate-100 w-[90%] hover:bg-[#ff8c00] ${isLoading?"cursor-not-allowed":"cursor-pointer"} rounded-md ml-[5%] text-sm py-2 mt-2`
// } 
        
//     >{isLoading?"Submitting...":"Confirm your account"}</button>
//       </form>
//         </>
//   }
//     </div>
//   )
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const ResetPasswordPage = ({params}:any) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { token } = params;

  // Verify the token when the component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Send a request to the verify-reset-token route
        const response = await fetch('/api/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          toast.error('The reset token is invalid or has expired.');
        }
      } catch (error) {
        setIsTokenValid(false);
        toast.error('Failed to verify the reset token.');
      }
    };

    verifyToken();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      // Send a request to the reset-password route to update the password
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password:newPassword }),
      });

      if (response.ok) {
        toast.success('Password has been reset successfully.');
        router.push('/auth/login'); // Redirect to the login page
      } else {
        toast.error('Failed to reset the password.');
      }
    } catch (error) {
      toast.error('An error occurred while resetting the password.');
    }
  };

  // Display loading while verifying the token
  if (isTokenValid === null) {
    return <div className="flex items-center justify-center min-h-screen">Verifying token...</div>;
  }

  // If the token is invalid, show an error message
  if (isTokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600">Invalid or Expired Token</h2>
          <p className="mt-4">Please request a new password reset link.</p>
        </div>
      </div>
    );
  }

  // If the token is valid, show the reset password form
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
