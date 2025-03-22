import { NextResponse } from "next/server";
import Product from "../../../../models/product";
import { connectMongoDB } from "../../../../utils/database";
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Handle GET requests to fetch all products
export async function GET(req: Request){
    try {
        await connectMongoDB();

        const  products = await Product.find() //Fetch all products
        return NextResponse.json({ products}, { status: 200 })
    } catch (error) {
        console.error('Error fetching categories: ', error)
        return NextResponse.json(
            { message: 'An error occured while fetching categories' },
            { status: 500 }
)}}

//Handle POST request to create a product item
    export const POST = async (req: Request) => {

    try {
        //Parse the incoming JSON request
        const {name, description, brand, retailPrice, discountedPrice, stock, categories, images, variantArray} = await req.json()

        //Validate the input
        if(!name || !description || !brand || !retailPrice || !brand || !retailPrice || !discountedPrice || !stock || !categories || !images || !variantArray){
            return NextResponse.json(
                {message: 'All fields are required'},
                {status: 400}
            )
        }

                //connect to mongodb
                await connectMongoDB()
                
        const imageResults = []

        for(let {Id, image} of images){
            const result = await cloudinary.uploader.upload(image, {
                resource_type: "image", // Specify the resource type as an image
                folder: "products", // Optional: Specify a folder in Cloudinary
              });

            const ImageObject = images.find((image:any) => image.Id === Id)

            delete ImageObject.image
            delete ImageObject.url

            imageResults.push({
                ...ImageObject,
                imageId:result.public_id,
                url:result.secure_url,
                id:Id
            })
        }

        //create a new product in the database
        await Product.create({name, description, brand, retailPrice, discountedPrice, stock, categories, images:imageResults, variantArray})

        return NextResponse.json(
            {message: 'Category created successfully'},
            {status: 201}
        )
        
    } catch (error) {
        console.error('Error updating category: ', error)
        return NextResponse.json(
            {message: 'An error occured while creating the category'},
            {status: 500}
        )
    }
}

//Handle PATCH requests to updatea a category
export async function PATCH(req: Request){
    try{
        const {id, name, description, brand, retailPrice, discountedPrice, stock, categories, images, variantArray} = await req.json()
    
        //Validate input
        if(!name || !description || !brand || !retailPrice || !discountedPrice || !stock || !categories || !images || !id ||!variantArray){
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            )
        }

    await connectMongoDB();

    const updatedProduct = await Product.findByIdAndUpdate(id, {name, description, brand, retailPrice, discountedPrice, stock, categories, images, variantArray}, {new: true})

    if(!updatedProduct){
        return NextResponse.json(
            {message: 'Category not found'},
            {status: 404}
        )
    }

    return NextResponse.json(
        {message: 'Category updated successfully', category: updatedProduct},
        {status: 200}
    )
}catch(error){
    console.error('Error updating category: ',error)
    return NextResponse.json(
        {message: 'An error occured while updating the category'},
        {status: 500}
)}}

//Handle DELETE requests to delete a category
export async function DELETE(req: Request){
    try{
        const {id}: { id: string } = await req.json();

        //validate input
        if (!id){
            return NextResponse.json(
                {message: 'ID is required'},
                {status: 400}
            )}

        await connectMongoDB()
        
        //Delete the category from the database
        const deletedCategory = await Product.findByIdAndDelete(id)

        if(!deletedCategory){
            return NextResponse.json(
                {message: 'Category not found'},
                {status: 404}
            )
        }

        return NextResponse.json(
            {message: 'Category delete successfully'},
            {status: 200}
        )
    }catch(error){
        console.error('Error deleting category:',error)
        return NextResponse.json(
            {message: 'An error occured while deleting the category'},
            {status: 500}
        )
    }
}
