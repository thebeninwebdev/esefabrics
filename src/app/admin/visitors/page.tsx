'use client'

import { VisitorChart } from '@/components/VisitorsTable'
import React, {useEffect, useState} from 'react'
import { useAppContext } from '@/context'
import Image from 'next/image'
import { VisitorAnalytics } from '@/components/VisitorAnalytics'

export default function page() {
    const {visitors, fetchAllVisitors} = useAppContext()
    const [siteLink, setSiteLink] = useState<string>('');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setSiteLink(window.location.origin);
      }
    }, []);

    useEffect(() => {
        fetchAllVisitors()
    },[])
  return (
    <div className='py-20'>
      <div className='pb-10 space-y-3'>
      <h1 className=' text-3xl md:text-4xl'>Web Analytics</h1>
      <div className='flex gap-1 items-center'>
      <Image 
        src="/favicon.ico" 
        alt="Site Favicon" 
        width={25} 
        height={25}
      /> 
      <p className='text-sm'>{siteLink && siteLink}</p>
      </div>
      
      </div>
      

        {visitors && 
        <div className='space-y-10'>
<VisitorChart visitors={visitors} /> 
<VisitorAnalytics visitors={visitors}/>
        </div>
        
        }

    </div>
  )
}
