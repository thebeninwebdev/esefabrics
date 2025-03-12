"use client"
import React, { useState, useEffect } from "react";
import {IoIosClose} from "react-icons/io"
import { motion } from "framer-motion";
import { FaSpinner } from 'react-icons/fa'
import { toast } from "sonner";
import { useAppContext } from '@/context'
import { Input } from "@/components/ui/input";
import { CiTrash } from "react-icons/ci";
import { SelectDemo } from "@/components/VariantItem";
import { TbLoader2 } from "react-icons/tb";

const DynamicVariantForm = () => {
  const {variants, fetchVariants} = useAppContext()
  const [variantType, setVariantType] = useState<string>(""); // Current variant type
  const [subVariantInput, setSubVariantInput] = useState<string>(""); // Input for sub-variant
  const [tempSubVariant, setTempSubVariant] = useState<string[]>([]); // Temporary sub-variant for the current type
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])


  useEffect(() => {
    fetchVariants()
  },[])
  useEffect(() => {
    setSearchResult(variants)
  },[variants])

  useEffect(() => {
    setSearchResult(variants.filter((variant:any) => variant.variantType.toLowerCase().includes(search.toLowerCase())))
  },[search])

  // Add a sub-variant to the temporary list
  const addSubVariant = () => {
    if (subVariantInput && !tempSubVariant.includes(subVariantInput)) {
      setTempSubVariant([...tempSubVariant, subVariantInput]);
      setSubVariantInput("");
    }
  };

  const handleDelete = (item:string) => {
    let filteredArray = tempSubVariant.filter((variant) => item !== variant)
    setTempSubVariant(filteredArray)
  }

  const deleteVariant = async (id:string) => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/variants`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id}),
                })
    
                if(!response.ok){
                    toast.error('Failed to delete category')
                    return
                }
    
                fetchVariants()
                toast.success("Category deleted successfully")
            } catch (error) {
                toast.error('Check internet connection')
                console.log(error)
            }finally{
              setIsLoading(false)
            }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      setIsLoading(true)

      if(tempSubVariant.length < 1){
        toast.error("No sub variant found")
        return
      }

    // Send to backend API
    const response = await fetch("/api/variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({variant:{
        variantType,
        subVariant:[...tempSubVariant]
    }}),
    });

    const res = await response.json()

    if(response.status === 400){
        toast.error(res.message)
    }else if(response.status == 500){
        toast.error("please check internet connection")
    }

    if(response.ok){
        toast.success(res.message)
        setVariantType("")
        setTempSubVariant([])
    }

    }catch(error){
        toast.error("Please check internet connection")
        console.log(error)
    }finally{
      setIsLoading(false)
      fetchVariants()
    }


  };

  return (
    <div className="w-full py-20 relative">
      {/* <div className="inset-0 text-slate-100 bg-black absolute"><TbLoader2/></div> */}
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto py-20" >
      {/* Input for Variant Type */}
      <div className="text-xs flex flex-col gap-2">
        <label
        className="font-medium" htmlFor="variantType">Variant Type:</label>
        <input
          id="variantType"
          type="text"
          value={variantType}
          onChange={(e) => setVariantType(e.target.value)}
          required
          placeholder="e.g., Size, Color, Material"
          className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent"
        />
      </div>

      {/* Input for Sub-Variant */}
      <div className="text-xs flex flex-col gap-2">
        <label htmlFor="subVariant" className="font-medium">Sub Variant:</label>
        <div className="flex items-center gap-5">
        <input
          id="subVariant"
          type="text"
          value={subVariantInput}
          onChange={(e) => setSubVariantInput(e.target.value)}
          placeholder="e.g., Red, Blue, Cotton"
          className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent w-full"
        />
        <button 
          type="button" 
          onClick={addSubVariant}
          className={`disabled:bg-red-500 btn dark:bg-primary-dark bg-primary w-max hover:opacity-90 transition-opacity duration-300 text-sm py-2 rounded-md px-4`}
        >
          Add
        </button>
        </div>
      </div>

      {/* Temporary Sub-Variant Display */}
      <div className="border-b-[1px] py-2">
        <ul className="flex gap-2 flex-wrap">
          {tempSubVariant.map((subVariant, index) => (
            <li key={index} className="cursor-pointer rounded-md bg-gray-300 dark:bg-gray-700 flex items-center gap-2 px-2 py-1 text-neutral-700 dark:text-slate-200 text-sm"
            onClick={() => handleDelete(subVariant)}>{subVariant}<IoIosClose className=""/></li>
          ))}
        </ul>
      </div>
      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`disabled:bg-red-500 btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading ? "cursor-not-allowed rounded-full" : "cursor-pointer rounded-md"} text-sm py-2 mt-2`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className='w-full flex justify-center'>
            <FaSpinner className='w-5 h-5 animate-spin' />
          </div>
        ) : (
          "Submit Variant"
        )}
      </motion.button>
    </form>
    <div className='px-5 pt-2 pb-10 bg-red-500 w-full max-w-md mx-auto border-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent'>
        <div className="space-y-3 pb-3">
          <div>
          <h2 className="font-bold">Search this documents</h2>
          <p className="text-sm">Find any variant in this list with a few letters.</p>
          </div>
          <Input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <hr/>
        <div className="py-3 space-y-4">
          <p className="text-sm">Available variants</p>
          <div className="">
          {variants ? 
          searchResult?.map(({variantType,subVariant,_id}:{variantType:string;subVariant:string[];_id:string},idx:number) => (
        <div className='flex justify-between w-full rounded-md capitalize text-md px-5 py-2 items-center h-16' key={idx}><span>{variantType}</span> 
        <div className='flex gap-2'>
            <button onClick={() => {deleteVariant(_id)}}><CiTrash className="w-5 h-5"/>
            </button>
            <SelectDemo subVariants={subVariant}/>
        </div>
        </div>
      )
):<p>No variant found.</p>
}
          </div>

        </div>

  </div>
    </div>

  );
};

export default DynamicVariantForm;
