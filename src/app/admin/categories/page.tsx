'use client'

import React, {useState, useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAppContext } from '@/context'
import { toast } from "sonner"
import {IoMdClose} from "react-icons/io"
import { CiEdit } from 'react-icons/ci'
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CATEGORY = {
  _id:string;
  category: string;
  image: string;
}

// Validation Schema
const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File, { message: "Image is required" }),
});

const editFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

export default function page() {
    const [isLoading, setIsLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<CATEGORY>({_id:"",image:"",category:""})
    const {categories, fetchCategories} = useAppContext()

    const [searchQuery, setSearchQuery] = React.useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        fetchCategories()
    },[])

    useEffect(() => {
      setFilteredCategories(categories)
    },[categories])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
  
      const filtered = categories.filter((category:CATEGORY) =>
          category.category.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    };

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

            fetchCategories()
            toast.success("Category deleted successfully")
        } catch (error) {
            toast.error('Check internet connection')
            console.log(error)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            image: undefined
        },
    })

    const editForm = useForm<z.infer<typeof editFormSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        category: "",
      },
    });

    async function onSubmit (data: z.infer<typeof formSchema>) {
    try {
        setIsLoading(true)

        const formData = new FormData();

        formData.append("category", data.category);
        formData.append("image", data.image);
        
        const response = await fetch('/api/category', {
          method: 'POST',
          body: formData
        });

        const res =  await response.json()

        if(response.status === 400){
            toast.error(res.message)
        
          }else if(response.status == 409){
            toast.error("Selected category already exists")
        }else if(response.status == 500){
            toast.error("please check internet connection")
        }

        if(response.ok){
            toast.success(res.message)
            form.reset()
            setPreview(null)
        }
    } catch (error) {
        toast.error("Please check internet connection")
        console.log(error)
    }finally{
        setIsLoading(false)
        fetchCategories()
    }
    }

    async function editCategory (data: z.infer<typeof editFormSchema>) {
    try {
        setIsLoading(true)
        setIsOpen(false)

        const formData = new FormData();

        formData.append("category", data.category);
        formData.append("image", currentCategory.image)
        formData.append('id', currentCategory._id)

        const response = await fetch('/api/category', {
          method: 'PATCH',
          body: formData
        });

        const res =  await response.json()
        
        if(response.status === 400){
            toast.error(res.message)
        }else if(response.status === 500){
            toast.error("please check internet connection")
        }

        if(response.ok){
          fetchCategories()
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

    //ufos by leslie kean (harmony/crown)

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

      {/* File Input */}
<FormField
  control={form.control}
  name="image"
  render={({ field: { onChange, value, ...rest } }) => (
    <FormItem>
      <FormLabel>Image</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            onChange(e.target.files && e.target.files[0]); // Update the form state

            // Image Preview
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => setPreview(event.target?.result as string);
              reader.readAsDataURL(file);
            }
          }}
          {...rest}
        />
      </FormControl>
      <FormDescription>Add an image.</FormDescription>
      {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
      <FormMessage />
    </FormItem>
  )}
/>

      <Button type="submit" className="text-text-dark">Submit</Button>
    </form>
  </Form>
  <div className='space-y-5 pr-5 sm:px-0 max-w-md mx-auto'>
    <div className="flex flex-col gap-5 sm:justify-between sm:items-center sm:flex-row">
      <div className=''>
      <h2 className='font-bold text-nowrap'>Product categories</h2>
      </div>
      <Input type="text"  placeholder="Search..." className='w-full sm:w-52' value={searchQuery} onChange={(e) => handleChange(e)}/>
    </div>
    <div className='w-full h-96 gap-3 overflow-auto'>
    {filteredCategories?.map((item:{category:string,_id: string},idx:number) => {
        return(
        <div className='cursor-pointer flex justify-between w-full mx-auto rounded-md capitalize shadow-lg py-2 px-5 items-center bg-neutral-300 dark:bg-neutral-600 hover:rounded-full transition-all duration-300' key={idx}><span className="hover:underline transition-all duration-300">{item?.category}</span> 
        
        <div className='flex gap-2'>
        <TooltipProvider>
        <Tooltip>
        <TooltipTrigger asChild>
        <button onClick={() => {deleteCategory(item._id)}}><IoMdClose className="w-5 h-5"/>
        </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Category</p>
        </TooltipContent>
      </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
        <Tooltip>
        <TooltipTrigger asChild>
        <button className='p-2 w-max h-max rounded-full bg-transparent' onClick={
          () => {
          setCurrentCategory(categories.find((category:CATEGORY) => category._id === item?._id))
          setIsOpen(true)
          }}>
          <CiEdit className='w-5 h-5'/>
        </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit Category</p>
        </TooltipContent>
      </Tooltip>
        </TooltipProvider>
        
            </div></div>)
})}
    </div>

  </div>
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-background dark:bg-background-dark">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <Form {...editForm}>
    <form onSubmit={editForm.handleSubmit(editCategory)} className="w-full max-w-md mx-auto pr-5 space-y-6">
      <FormField
        control={editForm.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="cloth" {...field} />
            </FormControl>
            <FormDescription>
              Change category name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="text-text-dark">Submit</Button>
    </form>
  </Form>
      </DialogContent>
    </Dialog>
    </div>

  )
}
