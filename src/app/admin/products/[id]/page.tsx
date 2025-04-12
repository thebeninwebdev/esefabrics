"use client"

import React,{ useState, useRef, useEffect, FormEvent } from "react"
import dynamic from "next/dynamic"
import {motion} from "framer-motion"
import {IoIosClose} from "react-icons/io"
import { toast } from "sonner"
import { FaSpinner } from 'react-icons/fa'
import Image from "next/image"
import { CiTrash } from "react-icons/ci"
import { useAppContext } from "@/context"
import { Checkbox} from "@/components/ui/checkbox"
import "react-quill-new/dist/quill.snow.css"
import "@/styles/quill-custom.css";
import { useLoading } from '@/context/LoadingContext'
import {Label} from '@/components/ui/label'
import { VariationInterface } from "@/app/types"
import { Pencil, Trash2 } from "lucide-react"

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



const emptyVariation: VariationInterface = {
  retailPrice: '',
  discountedPrice: '',
  variantType: '',
  subVariant: '',
  stock: '',
};

interface CategoryObject {
  _id: string;
  category: string;
}

export default function EditProductForm({params}: {params: Promise<{id: string}>}) {
  const {variants, fetchVariants, categories, fetchCategories, products, variations:varry, fetchProducts, fetchVariations} = useAppContext();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [retailPrice, setRetailPrice] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [images, setImages] = useState<{ 
    Id:string; image: any; url:string }[]>([]);
  const [ category, setCategory] = useState<string>("")
  const [categoriesArray, setCategoriesArray] = useState<{category:string,_id: string}[]>([]);
  const {isLoading, setLoading} = useLoading();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [variations, setVariations] = useState<VariationInterface[]>([])
  const [isVariant, setIsVariant] = useState<boolean>(false)
  const [variationValues, setVariationValues] = useState<VariationInterface>(emptyVariation)
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([])

  const resolvedParams = React.use(params)


  useEffect(() => {
    fetchVariants();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products && categories && resolvedParams.id) {
      const product = products.find((p: any) => p._id === resolvedParams.id);

      
      function filterByCategory(
        objects: CategoryObject[],
        categories: string[]
      ): CategoryObject[] {
        const filteredObjects: CategoryObject[] = [];
      
        for (const obj of objects) {
          if (categories.includes(obj.category)) {
            filteredObjects.push(obj);
          }
        }
      
        return filteredObjects;
      }


      if (product && categories && varry) {

        const filtered = filterByCategory( categories,product.categories);
        const foundVariation = varry.find((v:any) => v.reference_id === product._id)

        setCurrentProduct(product);
        setName(product.name);
        setDescription(product.description);
        setBrand(product.brand);
        setRetailPrice(product.retailPrice);
        setDiscountedPrice(product.discountedPrice);
        setStock(product.stock);
        setImages(product.images);
        setCategoriesArray(filtered);
        
        if(foundVariation){
          setVariations(foundVariation?.variations.map((variation:any) => {
            return {...variation,subVariant:variation.subVariant[0]}
          }))
        }
        
      }
    }
  }, [products, resolvedParams.id, varry]);

  useEffect(() => {
    setCategoryNames(categoriesArray.map((item) => item.category))
  },[categoriesArray])

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);
  

  const handleEdit = (variation: VariationInterface, index: number) => {
    setVariationValues(variation)
    setVariations(variations.filter((_, i) => i !== index))
    setIsVariant(true)
  }

  const handleDeleteVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const plainText = description.replace(/<[^>]+>/g, "").trim();

    if (!plainText) {
      toast.error("Description is required.");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await fetch(`/api/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ id:resolvedParams.id,name, description, brand, retailPrice, discountedPrice, stock, images, categories:categoryNames}),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      const res = await fetch(`/api/variation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ id:varry.find((v:any) => v.reference_id === currentProduct._id)?._id,reference_id:currentProduct._id,variations}),
      });

      const variationData = await res.json()
  
      if (!response.ok) {
        toast.error(variationData.message || "Something went wrong");
        return;
      }

      toast.success("Product updated successfully");
      fetchProducts()
      fetchVariations()
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
      <div className="flex items-center space-x-2">
      <Checkbox 
        id="product-variation" 
        checked={isVariant}
        onCheckedChange={(checked) => setIsVariant(!!checked)}
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
      <Label 
        htmlFor="product-variation" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Is there a variation?
      </Label>
    </div>
      {isVariant && <><div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Pick variants</span>
        </label>
        <select 
        className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a]"
        value={variationValues.variantType}
        onChange={(e)=> {
          setVariationValues((prevState:VariationInterface) => ({...prevState,variantType:e.target.value}))
        }}
        >
          <option value="">{!variants?"loading...":"Select a variant"}</option>
          {variants?.map(({variantType}:{variantType:string},idx:number) => {
            return(
              <option value={variantType} key={idx} className="">
                {variantType?.toUpperCase()}
              </option>
            )})}
        </select>
        {
          (variationValues?.variantType || variants?.find((variant:any) => variant?.subVariant == variationValues?.subVariant)) &&
          <div>
            {
              <select className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a] w-full mt-5" value={variationValues.subVariant} onChange={(e)=> {

                if(variationValues.subVariant == e.target.value) return

                if(e.target.value === "") return
                  setVariationValues((prevState:VariationInterface) => ({...prevState,subVariant:e.target.value}))
                }}
                  >
                  <option value="">Select a sub variant</option>
                  {variants?.find((variant:any) => variant.variantType === variationValues.variantType)?.subVariant.map((key:string,index:number) => {
                      return(
                        <option value={key} key={index} className="">
                        {key?.toUpperCase()}
                      </option> 
                      )
                    })}
                </select>
            }
          </div>}
      </div>
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Retail Price</span>
        </label>
        <input type="number" placeholder="3000" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={variationValues.retailPrice} 
        onChange={(e) => 
          setVariationValues(
            (prevState:VariationInterface) => 
            ({...prevState,retailPrice:e.target.value})
            )} 
        />
      </div>
      {/* Discounted Price FIELD */}
      <div className="text-xs flex flex-col gap-2">
        <label className="font-medium">
          <span>Discounted Price</span>
        </label>
        <input type="number" placeholder="2800" className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent" value={variationValues?.discountedPrice} 
        onChange={(e) => 
          setVariationValues(
            (prevState:VariationInterface) => 
            ({...prevState,discountedPrice:e.target.value})
            )} 
         />
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
        value={variationValues?.stock} 
        onChange={(e) => 
          setVariationValues(
            (prevState:VariationInterface) => 
            (
              {...prevState,stock:e.target.value})
            )} 
         />
      </div>
      <span onClick={() => {
        if(!variationValues?.variantType || !variationValues?.subVariant || !variationValues?.retailPrice || !variationValues?.discountedPrice || !variationValues?.stock) {
          toast.error("All fields are required")
          return
        }
        setVariations((prevState) => [...prevState,variationValues])
        setVariationValues(emptyVariation)
        setIsVariant(false)
        }} className="text-sm bg-blue-500 text-slate-200 px-3 py-2 my-5 block w-max rounded-md cursor-pointer hover:opacity-80">Add Variation</span></>
        }
        {variations.length > 0 && <div className="space-y-4">
      {variations.map((variation, index) => (
        <div 
          key={index} 
          className="shadow-md rounded-lg p-4 border border-primary hover:shadow-lg transition-shadow duration-300 relative text-text dark:text-text-dark"
        >
          <div className="absolute top-4 right-4 flex space-x-2">
            <button 
              onClick={() => handleEdit(variation, index)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Edit Variation"
            >
              <Pencil size={20} />
            </button>
            <button 
              onClick={() => handleDeleteVariation(index)}
              className="text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Delete Variation"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 pr-10">
            <div>
              <p className="font-semibold">Variation Type:</p>
              <p className="">{variation.variantType || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Sub Variant:</p>
              <p className="">{variation.subVariant || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Retail Price:</p>
              <p className="text-green-600">{Number(variation.retailPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }) || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Discounted Price:</p>
              
              <p className="text-red-600">
              {Number(variation.discountedPrice).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }) || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Stock:</p>
              <p className="text-blue-600">{variation.stock || 'N/A'} units</p>
            </div>
          </div>
        </div>
      ))}
    </div>}
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
                {category?.toUpperCase()}
              </option>
            )})}
        </select>
          <div className="w-full flex flex-wrap gap-4 p-4 border-b-[1px] text-slate-200">
          {categoriesArray?.map(({category,_id}:{category:string,_id:string},idx:number) => {
          return(
            <span key={idx} className="cursor-pointer rounded-md bg-gray-300 dark:bg-gray-700 flex items-center gap-2 px-2 py-1 text-neutral-700 dark:text-slate-200" onClick={() => handleDelete(_id)}>{category?.toUpperCase()}<IoIosClose className=""/></span>
          )
        })}
      </div>
      </div>
      <div className="text-xs">
          <input 
          className="border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a] mt-3 w-full" 
          type="file"
          aria-label="Photo" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange} />
          {images && 
          <div className="py-5 px-2 flex flex-wrap gap-2 ">
            {images.map((param,index) => {
              const link = param.url
              return (
<div key={index} className="w-max relative group cursor-pointer">
                <span className="absolute inset-0 bg-black bg-opacity-75 text-slate-50 hidden justify-center items-center text-3xl cursor-pointer group-hover:flex ease-in-out hover:transition-all" onClick={
                  () => {handleRemoveImage(param.Id)}
                  }><CiTrash/></span>
                <img alt={"upload"} src={link as string} className="h-24 w-auto"/>
              </div>
              )
              
})}
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
          "Update Product"
        )}
      </motion.button>
    </form>
  )
}
