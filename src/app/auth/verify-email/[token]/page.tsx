// "use client"

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

// export default function ResetPassword({params}:any) {

//   const router = useRouter()
  
//   const [isLoading, setIsLoading] = useState(false)
//   const [verified, setVerified] = useState(false)

//   const [user, setUser] = useState<any>(null)
  
//   const {data: session, status: sessionStatus} = useSession()

//   useEffect(() => {
// const verifyToken = async () => {
//   try {
//     const res = await fetch("/api/verify-token",{
//       method: "POST",
//       headers: {
//         "Content_Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: params.token,
//       })
//     })
//     if(res.ok){
//       setVerified(true)
//       const userData = await res.json()
//       setUser(userData)
//     }else{
//       toast.error("Invalid token or has expired")
//       setVerified(false)
//     }
//   } catch (error) {
//     toast.error("Error, try again")
//     console.log(error)
//   }


// }
// verifyToken()
//   },[params.token])

//   const handleSubmit = async () => {

//     try {
//       setIsLoading(true)
//       const res = await fetch('/api/confirm-account',{
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: user?.email
//         })
//       })

//       if(res.status === 400){
//         toast.error("Something went wrong, please try again")
//       }
//       if(res.status === 200){
//         router.push('/login')
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
//   }else{
//     return (
//       <div className='py-20 px-5 w-full max-w-96 mx-auto'>
//         {sessionStatus !== "authenticated" &&
//         <>
//         <h1 className='w-full text-center font-bold text-2xl py-2 text-secondary-light'>Confirm your account</h1>
//       <button
// className={
//   `btn bg-[#f7931a] text-slate-100 w-[90%] hover:bg-[#ff8c00] ${isLoading?"cursor-not-allowed":"cursor-pointer"} rounded-md ml-[5%] text-sm py-2 mt-2`
// }  
//         disabled={isLoading}
//           onClick={() => handleSubmit()}
//       >{isLoading?"Submitting...":"Confirm your account"}</button>
//           </>
//     }
//       </div>
  
//     )
//   }

// }

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Sonner for toasts

interface VerifyTokenPageProps {
  params: {
    token: string;
  };
}

export default function VerifyTokenPage({ params }: VerifyTokenPageProps) {
  const { token } = params; // Get the token from the URL
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
          confirmAccount(); // Call the confirm account function
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {loading ? (
          <p className="text-center text-gray-700">Verifying token...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={requestNewToken}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Request New Token
            </button>
          </div>
        ) : isTokenValid ? (
          <p className="text-center text-green-500">Confirming your account...</p>
        ) : null}
      </div>
    </div>
  );
}