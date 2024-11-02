"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner"
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
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "description must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "brand must be at least 2 characters.",
  }),
  retailPrice: z.number().min(1, {
    message: "retail price must be a number more than a digit.",
  }),
  discountedPrice: z.number().min(1, {
    message: "discount price must be a number more than a digit.",
  }),
  stock: z.number().min(1, {
    message: "stock must be a number more than a digit.",
  }),
  categories: z.number().min(1, {
    message: "categories price must be a number more than a digit.",
  }),
  defaultImage: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Only image files are allowed (e.g., .jpg, .png, .gif)',
    })
})

export function NewProductForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      retailPrice: 200,
      discountedPrice: 100,
      stock: 4
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("submitted successfully")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto pr-5 space-y-6 py-20">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="cloth" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the product you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="can be worn easily" {...field} />
              </FormControl>
              <FormDescription>
                This is the description for the product you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Gucci" {...field} />
              </FormControl>
              <FormDescription>
                What company made this product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="retailPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retail Price</FormLabel>
              <FormControl>
                <Input placeholder="2000" {...field} />
              </FormControl>
              <FormDescription>
                This is the higher market price 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountedPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discounted Price</FormLabel>
              <FormControl>
                <Input placeholder="1500" {...field} />
              </FormControl>
              <FormDescription>
                This is the actual sell price of the product lowe than the retail price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder="40" {...field}/>
              </FormControl>
              <FormDescription>
                How much of these products are in stock
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
