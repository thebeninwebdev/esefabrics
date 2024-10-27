'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; // Sonner for toasts
import { FaSpinner } from 'react-icons/fa';

export default function VerifyTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params); // Use React's use() to unwrap the Promise and get the token
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setIsTokenValid(false);
        } else {
          setIsTokenValid(true);
          toast.success('Token verified, confirming your account...');
          await confirmAccount(); // Wait for confirmation before proceeding
        }
      } catch (error) {
        setError('An error occurred while verifying the token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const confirmAccount = async () => {
    try {
      const res = await fetch('/api/confirm-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success('Account confirmed successfully!');
        router.push('/auth/login'); // Redirect to login page after confirmation
      }
    } catch (error) {
      toast.error('An error occurred while confirming the account');
    }
  };

  const requestNewToken = async () => {
    try {
      const res = await fetch('/api/verification-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success('Please check your mail');
        router.push('/auth/login'); // Redirect to login page
      }
    } catch (error) {
      toast.error('An error occurred, please try again');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-text dark:text-text-dark">
      <div className="p-6 max-w-md w-full">
        {loading ? (
          <p className="text-center text-primary text-md">Verifying token...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 text-xl">{error}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] 
                hover:opacity-90 transition-opacity duration-300 
                ${loading ? "cursor-not-allowed rounded-full" : "cursor-pointer rounded-md"} 
                text-sm py-2 mt-2
              `}
              onClick={requestNewToken}
              disabled={loading}
            >
              {!loading ? "New token" : <div className='w-full flex justify-center'><FaSpinner className='w-5 h-5 animate-spin' /></div>}
            </motion.button>
          </div>
        ) : isTokenValid ? (
          <p className="text-center text-green-500">Confirming your account...</p>
        ) : null}
      </div>
    </div>
  );
}
