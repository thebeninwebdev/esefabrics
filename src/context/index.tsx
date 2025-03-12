"use client"

import { DELETE } from '@/app/api/category/route';
import React, {createContext, useContext, useState} from 'react'

const AppContext = createContext<any>(undefined)

export function AppWrapper({children}: {
    children: React.ReactNode;
}){

    const EMAIL:string = "osayivictoryeseosa@gmail.com"
    const COMPANY_NAME:string = "mrEseosa_"
    const [categories, setCategories] = useState([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [variants, setVariants] = useState([])

    const fetchCategories = async () => {
        try {
           const response = await fetch('/api/category') 

           if(!response.ok){
            console.log('failed to fetch categories')
           }

           const data = await response.json()
           setCategories(data.categories)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchVariants = async () => {
        try {
           const response = await fetch('/api/variants') 

           if(!response.ok){
            console.log('failed to fetch categories')
           }

           const data = await response.json()
           setVariants(data.variants)

        } catch (error) {
            console.log(error)
        }
    }
    return(
        <AppContext.Provider value={{EMAIL, COMPANY_NAME, isOpen,setIsOpen, categories, fetchCategories, variants, setVariants, fetchVariants}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}