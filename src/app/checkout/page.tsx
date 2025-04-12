"use client"

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CartItem } from '../types';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';


export default function CheckoutInfo() {
  const router = useRouter();
  const { cart, delivery, clearCart, createOrder } = useAppContext();
  const {data:session} = useSession();
  const [subTotal, setSubTotal] = useState(0)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    orderNote: '',
  });

  // Validation state
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    address: false,
  });

  // Check if all fields are filled
  const [isFormValid, setIsFormValid] = useState(false);
  // Update form data when user types

  useEffect(() => {
    setSubTotal(
        cart
        .map((item:CartItem) => item.price * (
          item?.variant
          ?
          item?.variant?.quantity
          :
          item?.quantity
        ))
    .reduce((partialSum: number, a: number) => partialSum + a, 0))
  },[cart])

   // Check form validity whenever formData changes
   useEffect(() => {
    const { firstName, lastName, phoneNumber, address } = formData;
    const formHasEmptyFields = 
      !firstName.trim() || 
      !lastName.trim() || !phoneNumber.trim() || !address.trim();
    
    setIsFormValid(!formHasEmptyFields);
  }, [formData]);

  // Load saved data if available
  useEffect(() => {
    const savedInfo = localStorage.getItem('checkoutInfo');
    if (savedInfo) {
      setFormData(JSON.parse(savedInfo));
    }
  }, []);

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it has a value
    if (value.trim()) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  // Validate form and handle submission
  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    // Check for empty fields
    const newErrors = {
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      phoneNumber: formData.phoneNumber.trim() === '',
      address: formData.address.trim() === '',
    };
    
    setErrors(newErrors);

    const handlePayment = async (firstName:string,lastName:string, address:string, orderNote:string) => {
      try {
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const paystack = new PaystackPop();
        paystack.newTransaction({
          key: "pk_test_f251ecc6c7abf64964bd76612536a98b43a56b2f",
          amount: (subTotal+delivery) * 100,
          email: session?.user?.email|| "",
          onSuccess(transaction) {
            createOrder({
              userId: session?.user?._id,
              products:cart.map((item:CartItem) => {
                if(item?.variant){
                  return {
                    productId: item?._id,
                    quantity: item?.variant?.quantity,
                    variant: item?.variant?.variant
                  }
                }else{
                  return {

                    productId: item?._id,
                    quantity: item?.quantity,
                  }
                }
              }),
              totalAmount: subTotal,
              shippingAddress: {fullName:firstName+" "+lastName, address},
              orderNote: orderNote,
              status: 'paid'
            })

            const message = `Transaction complete! Reference: ${transaction.reference}`;
            clearCart()
            toast.success(message);
          },

          onCancel: () => {
            createOrder({
              userId: session?.user?._id,
              products:cart.map((item:CartItem) => {
                if(item?.variant){
                  return {
                    productId: item?._id,
                    quantity: item?.variant?.quantity,
                    variant: item?.variant?.variant
                  }
                }else{
                  return {

                    productId: item?._id,
                    quantity: item?.quantity,
                  }
                }
              }),
              totalAmount: subTotal,
              shippingAddress: {fullName:firstName+" "+lastName, address},
              orderNote: formData.orderNote,
              status: 'cancelled'
            })
            clearCart()
            toast.error("Your transaction has been cancelled");
          },
        });
      } catch (error) {
        console.error('Error initializing payment:', error);
        toast.error('Failed to initialize payment. Please try again.');
      }
    };
    
    // If form is valid, save to state and proceed
    if (!Object.values(newErrors).includes(true)) {
      handlePayment(formData.firstName.trim(),formData.lastName.trim(),formData.address.trim(), formData.orderNote.trim())
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-primary text-text-dark text-center py-10 mb-8 rounded-lg">
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
            1
          </div>
          <h2 className="text-xl font-medium">Your Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">First name is required</p>
              )}
            </div>
            
            <div>
              <label className="block mb-1" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">Last name is required</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1" htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">Phone number is required</p>
            )}
          </div>
          <div className="mb-4">
  <label htmlFor="orderNote" className="block mb-1">Order Note (Optional)</label>
  <textarea
    id="orderNote"
    name="orderNote"
    value={formData.orderNote}
    className="w-full p-3 border rounded-md border-gray-300"
    onChange={handleChange}
    placeholder="Leave a note about your order (optional)..."
    rows={4}
  />
</div>

          <div className="mb-6">
            <label className="block mb-1" htmlFor="address">
              Delivery Address in Benin City <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={`w-full p-3 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your complete delivery address"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">Delivery address is required</p>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/cart" className="text-primary hover:underline mb-4 md:mb-0">
              &larr; Return to cart
            </Link>
            
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-3 rounded-md font-medium ${
                isFormValid 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition`}
            >
              Continue to Payment
            </button>
          </div>

          {!isFormValid && (
            <p className="text-amber-600 text-sm mt-4 text-center">
              Please fill all required fields to continue
            </p>
          )}
        </form>
      </div>
    </div>
  );
}