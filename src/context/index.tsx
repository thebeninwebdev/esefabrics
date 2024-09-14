"use client"

import React, {createContext, useContext} from 'react'

const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){

    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"

    return(
        <AppContext.Provider value={{EMAIL, COMPANY_NAME}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}