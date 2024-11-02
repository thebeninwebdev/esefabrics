'use client'

import React, {useState, useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAppContext } from '@/context'
import { toast } from "sonner"
import {IoMdClose} from "react-icons/io"
import { CiEdit } from 'react-icons/ci'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    category: z.string().min(4, {
      message: "category must be at least 2 characters.",
    }),
  })

export default function page() {
    const [isLoading, setIsLoading] = useState(false)
    const {categories, fetchCategories} = useAppContext()

    useEffect(() => {
        fetchCategories()
    },[])

    const deleteCategory = async (id:string) => {
        try {
            const response = await fetch(`/api/category`,{
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

            toast.success("Category deleted successfully")
        } catch (error) {
            toast.error('Check internet connection')
            console.log(error)
        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
        defaultValues: {
            category: "",
        },
    })

    async function onSubmit (data: z.infer<typeof FormSchema>) {
    try {
        setIsLoading(true)
        const response = await fetch('/api/category',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const res =  await response.json()

        if(response.status === 400){
            toast.error(res.message)
        }else if(response.status == 500){
            toast.error("please check internet connection")
        }

        if(response.ok){
            toast.success(res.message)
        }
    } catch (error) {
        toast.error("Please check internet connection")
        console.log(error)
    }finally{
        setIsLoading(false)
        fetchCategories()
    }
    }
  return (
    <div className='py-20 space-y-10'>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto pr-5 space-y-6">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="cloth" {...field} />
            </FormControl>
            <FormDescription>
              Create a new Category.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  <div className='space-y-5'>
    {categories?.map((item:{category:string,_id: string},idx:number) => {
        return(
        <div className='flex justify-between w-full max-w-md mx-auto bg-primar dark: bg-primary-dark rounded-md text-slate-200 capitalize text-md px-10 py-2 items-center' key={idx}><span>{item?.category}</span> <div className='flex gap-2'>
            <button onClick={() => deleteCategory(item._id)}><IoMdClose className="w-5 h-5"/></button><CiEdit className='w-5 h-5'/></div></div>)
})}
  </div>
    </div>

  )
}
