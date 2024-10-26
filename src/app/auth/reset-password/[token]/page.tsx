'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GoEyeClosed, GoEye } from 'react-icons/go'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResetPasswordPage = ({params}:any) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    return <div className="flex items-center justify-center min-h-screen text-text dark:text-text-dark">Verifying token...</div>;
  }

  // If the token is invalid, show an error message
  if (isTokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-screen text-text dark:text-text-dark">
        <div className="p-6 rounded text-center">
          <h2 className="text-3xl font-bold text-red-600">Invalid or Expired Token</h2>
          <p className="mt-4 text-sm">Please request a new password <Link href="/auth/login?reset=true" className='underline'>reset link.</Link></p>
        </div>
      </div>
    );
  }

  // If the token is valid, show the reset password form
  return (
    <div className="flex items-center justify-center min-h-screen text-text dark:text-text-dark">
      <form onSubmit={handleSubmit} className="p-6 rounded w-96">
        <h1 className="text-3xl font-bold text-complement dark:text-complement-dark pb-6">Reset Password</h1>
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
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textlight dark:text-text-dark focus:outline-none"
        >
          {showPassword ? <GoEyeClosed  className='w-4 h-4'/> : <GoEye className='w-4 h-4'/>}
        </button>
              </div>

            </div>
            <div className="text-xs flex flex-col gap-2 mt-4">
        <label className="font-medium">
                <span className="">Confirm password</span>
              </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder='--------'
            className="placeholder:text-lg border-2 p-2 rounded-md border-complement dark:border-complement-dark outline-none placeholder:text-text tracking-widest  dark:placeholder:text-text-dark dark:bg-transparent w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              className={
                `btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading?"cursor-not-allowed rounded-full":"cursor-pointer rounded-md"}  text-sm py-2 mt-4`
              } 
        disabled={isLoading}
        >
          {isLoading?<div className='w-full flex justify-center'>
          <FaSpinner className='w-5 h-5 animate-spin'/>
          </div>:"Reset password"}
        </motion.button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
