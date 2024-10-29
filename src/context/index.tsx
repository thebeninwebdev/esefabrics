"use client"

import React, {createContext, useContext, useState} from 'react'

const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){

    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return(
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}