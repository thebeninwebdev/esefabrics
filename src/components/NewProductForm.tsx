"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import dynamic from "next/dynamic"
import {motion} from "framer-motion"
import {IoIosClose} from "react-icons/io"
import { toast } from "sonner"
import { FaSpinner } from 'react-icons/fa'
import Image from "next/image"
import { CiTrash } from "react-icons/ci"
import { useAppContext } from "@/context"
import { ColorPicker } from "./ColorPicker"
import "react-quill-new/dist/quill.snow.css"
import "@/styles/quill-custom.css";
import { useLoading } from '@/context/LoadingContext'

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false, // This ensures it only loads in the browser
});

interface Image {       
  id: string;
  url: string;
  size?: string;
  color?: string;
}

export function NewProductForm() {
  const {variants, fetchVariants, categories, fetchCategories} = useAppContext();
  const [color, setColor] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("");
  const [subVariantSelected, setSubVariantSelected] = useState("")
  const [variantArray, setVariantArray] = useState<{variantType:string,subVariant:string}[]>([])
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [retailPrice, setRetailPrice] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [images, setImages] = useState<{ 
    Id:string; image: any; variantType?: string; variant?: string; url:string }[]>([]);
  const [ category, setCategory] = useState<string>("")
  const [categoriesArray, setCategoriesArray] = useState<{category:string,_id: string}[]>([]);
  const {isLoading, setLoading} = useLoading();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchVariants()
    fetchCategories()
  },[])

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const categoryNames: string[] = categoriesArray.map(item => item.category);

    const plainText = description.replace(/<[^>]+>/g, "").trim();

    if (!plainText) {
      toast.error("Description is required.");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ name, description, brand, retailPrice, discountedPrice, stock, images, categories:categoryNames}),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }
  
      toast.success("Product added successfully");
      setName("")
      setBrand("")
      setDescription("")
      setCategory("")
      setCategoriesArray([])
      setColor("")
      setDiscountedPrice("")
      setRetailPrice("")
      setImages([])
      setSelectedVariant("")
      setStock("")
      setSubVariantSelected("")
      setVariantArray([])
    } catch (error) {
      console.error(error);
      toast.error("Please check your internet connection");
    } finally {
      setLoading(false);
    }
  };
  
  const convertToBase64 = (file:any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRemoveImage = (id:string) => {
    setImages((prevImages) => prevImages.filter((image) => image.Id !== id))
  }

  const handleSelect = (value:string) => {
    if(categoriesArray.find((item) => (item._id === value) || (value == ""))) return
    const Obj = categories.find((item:any) => (item._id === value))

    setCategoriesArray((prevState) => [...prevState, Obj ])
  }

  const handleFileChange = async (event:any) => {
    const file = event.target.files[0]
    const base64 = await convertToBase64(file);
    if(!file){
      toast.error("No file selected!")
      return
    }

    const objectUrl = URL.createObjectURL(file)

    setImages((prevState) => [
      ...prevState,
      {
      Id:crypto.randomUUID(),
      image:base64,
      color: color || "",
      url:objectUrl
    }
    ])

    if(fileInputRef.current){
      fileInputRef.current.value = ""
    }

    toast.success("Image successfully added!")
  }

  const handleDelete = (value:string) => {
    if(!(categories.find((item:{category:string,_id: string}) => (item._id === value)))) return

    const filteredCategoriesArray = categoriesArray.filter((item:{category:string,_id: string}) => (item._id !== value))
    setCategoriesArray([...filteredCategoriesArray ])
    if(filteredCategoriesArray.length < 1) setCategory("")
  }
  const handleDeleteVariant = (value:string) => {
    if(!(variantArray.find((item:{subVariant:string,}) => (item.subVariant === value)))) return

    const filteredVariantArray = variantArray.filter((item:{subVariant:string}) => (item.subVariant !== value))
    setVariantArray([...filteredVariantArray ])
    if(filteredVariantArray.length < 1) setCategory("")
  }

  return (
    <form 
    className="space-y-4 w-full max-w-md mx-auto py-20" 
    onSubmit={handleSubmit}>
      {/* Item Name Field */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Item name</span>
        </label>
        <input type="text" placeholder="Polo Shirt" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      {/* DECRIPTION FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Item description</span>
        </label>
        <div className="dark:bg-[#141414] bg-[#f5f5f5] p-2 rounded-lg">
        <ReactQuill value={description} onChange={setDescription} theme="snow" />
      </div>
      </div>
      {/* BRAND FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Brand</span>
        </label>
        <input type="text" placeholder="Gucci" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      </div>
      {/* Retail FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Retail Price</span>
        </label>
        <input type="number" placeholder="3000" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} required />
      </div>
      {/* Discounted Price FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Discounted Price</span>
        </label>
        <input type="number" placeholder="2800" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} required />
      </div>
      {/* Stock FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Quantity in stock</span>
        </label>
        <input 
        type="number" 
        placeholder="50" 
        className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" 
        value={stock} 
        onChange={(e) => setStock(e.target.value)} 
        required />
      </div>
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Pick variants</span>
        </label>
        <select 
        className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a]"
        value={selectedVariant}
        onChange={(e)=> setSelectedVariant(e.target.value)}
        >
          <option value="">{!variants?"loading...":"Select a variant"}</option>
          {variants?.map(({variantType,_id}:{variantType:string,_id:string},idx:number) => {
            return(
              <option value={_id} key={idx} className="">
                {variantType.toUpperCase()}
              </option>
            )})}
        </select>
        {
          (selectedVariant || variants?.find((variant:any) => variant._id === selectedVariant)) &&
          <div>
            {
              <select className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a] w-full mt-5" value={subVariantSelected} onChange={(e)=> {


                if(variantArray.find((item:any) => item.subVariant.toLowerCase() === e.target.value.toLowerCase())) return

                if(e.target.value === "") return

                  setVariantArray((prevState:any) => (
                    [...prevState,{variantType:selectedVariant,
                      subVariant:e.target.value
                    }]
                  ))
                  setSubVariantSelected(e.target.value)
                }}
                  >
                  <option value="">Select a sub variant</option>
                  {variants?.find((variant:any) => variant._id === selectedVariant)?.subVariant.map((key:string,index:number) => {
                      return(
                        <option value={key} key={index} className="">
                        {key.toUpperCase()}
                      </option> 
                      )
                    })}
                </select>
            }
          </div>}
          <div className="w-full flex flex-wrap gap-4 p-4 border-b-[1px] text-slate-200">
          {variantArray?.map((
            {subVariant}:{subVariant:string},idx:number) => {
          return(
            <span key={idx} className="cursor-pointer rounded-md bg-gray-300 dark:bg-gray-700 flex items-center gap-2 px-2 py-1 text-neutral-700 dark:text-slate-200" onClick={() => {
              handleDeleteVariant(subVariant)
            }}>{subVariant.toUpperCase()}<IoIosClose className=""/></span>
          )
        })}
      </div>
      </div>
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>categoriesArray</span>
        </label>
        <select className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a]" value={category} onChange={(e)=> handleSelect(e.target.value)}
          >
          <option value="">{!variants?"loading...":"Select a category"}</option>
          {categories?.map(({category,_id}:{category:string,_id:string},idx:number) => {
            return(
              <option value={_id} key={idx} className="">
                {category.toUpperCase()}
              </option>
            )})}
        </select>
          <div className="w-full flex flex-wrap gap-4 p-4 border-b-[1px] text-slate-200">
          {categoriesArray?.map(({category,_id}:{category:string,_id:string},idx:number) => {
          return(
            <span key={idx} className="cursor-pointer rounded-md bg-gray-300 dark:bg-gray-700 flex items-center gap-2 px-2 py-1 text-neutral-700 dark:text-slate-200" onClick={() => handleDelete(_id)}>{category.toUpperCase()}<IoIosClose className=""/></span>
          )
        })}
      </div>
      </div>
      <div className="text-xs">
        <div className="flex gap-2 items-center">
        <ColorPicker value={color} onChange={(e) => setColor(e)} className="w-5 h-5"/> Is it a colour?</div>
          <input 
          className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a] mt-3 w-full" 
          type="file"
          aria-label="Photo" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange} />
          {images && 
          <div className="py-5 px-2 flex flex-wrap gap-2 ">
            {images.map((param,index) => (
              <div key={index} className="w-max relative group cursor-pointer">
                <span className="absolute inset-0 bg-black bg-opacity-75 text-slate-50 hidden justify-center items-center text-3xl cursor-pointer group-hover:flex ease-in-out hover:transition-all" onClick={
                  () => {handleRemoveImage(param.Id)}
                  }><CiTrash/></span>
                <Image alt={"upload"} src={param.url as string} width={20} height={20} className="h-24 w-auto"/>
              </div>
            ))}
          </div> }
      </div>
      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`disabled:opacity-75 btn dark:bg-primary-dark bg-primary w-[90%] mx-[5%] hover:opacity-90 transition-opacity duration-300 ${isLoading ? "cursor-not-allowed rounded-full" : "cursor-pointer rounded-md"} text-sm py-2 mt-2`}
        disabled={isLoading || images.length === 0}
      >
        {isLoading ? (
          <div className='w-full flex justify-center'>
            <FaSpinner className='w-5 h-5 animate-spin' />
          </div>
        ) : (
          "Create Product"
        )}
      </motion.button>
    </form>
  )
}
