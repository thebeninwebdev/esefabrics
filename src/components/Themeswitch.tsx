// app/components/ThemeSwitch.tsx
'use client'

import { useTheme } from 'next-themes'
import { RxHalf2 } from 'react-icons/rx'

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme()

  
    return  (<button className=''><RxHalf2 className='w-5 h-5' onClick={() => setTheme(
      resolvedTheme === 'light'?'dark':'light'
    )} /></button>)
  

}