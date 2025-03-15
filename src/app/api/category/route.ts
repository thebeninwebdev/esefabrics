import { NextResponse } from "next/server";
import Categories from "../../../../models/category";
import { connectMongoDB } from "../../../../utils/database";
import { UploadApiResponse } from "cloudinary";
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Handle GET requests to fetch all categories
export async function GET(req: Request){
    try {
        await connectMongoDB();

        const categories = await Categories.find() //Fetch all categories
        return NextResponse.json({ categories}, { status: 200 })
    } catch (error) {
        console.error('Error fetching categories: ', error)
        return NextResponse.json(
            { message: 'An error occured while fetching categories' },
            { status: 500 }
        )
    }
}

//Handle POST requests to create a category
export const POST = async (request: Request) => {
    try {
        //Parse the incoming formData request
        const formData = await request.formData();
        const category = formData.get("category");
        const image = formData.get("image");

        if (!image) {
            throw new Error("No image file provided.");
          }
          
          if (!(image instanceof File)) {
            throw new Error("Expected a file but got a string.");
          }
          
          const photoBuffer = await image.arrayBuffer();
          const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {resource_type: "auto", folder: "categories"},
                (error, result) => {
                    if (error || !result) reject(error)
                    else resolve(result)
                }
            ).end(Buffer.from(photoBuffer))
          })

        //Validate the input
        if(!category || typeof category !== 'string' || category.trim().length === 0){
            return NextResponse.json(
                {message: 'Category is required and must be a valid string'},
                {status: 400}
            )
        }

        //connect to mongodb
        await connectMongoDB()

        //search for duplicate
        const duplicate = await Categories.find({category})

        if(duplicate.length){
            console.log(duplicate)
            return NextResponse.json(
                {message: 'Category already exists'},
                {status: 409}
            )
        }

        //createa a new category in the database
        await Categories.create({category,image:result.public_id,link:result.secure_url})

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
export async function PATCH(request: Request){
    try{
    //Parse the incoming formData request
    const formData = await request.formData();
    const category = formData.get("category");
    const image = formData.get("image");
    const id = formData.get("id");
    const link = formData.get("link")
    
    //Validate input
    if(!id || !category || typeof category !== 'string' || category.trim().length === 0 || !link){
        return NextResponse.json(
            {message: "ID and valid category are required"},
            {status: 400}
        )
    }

    await connectMongoDB();

    const updatedCategory = await Categories.findByIdAndUpdate(id, {category,image,link}, {new: true})

    if(!updatedCategory){
        return NextResponse.json(
            {message: 'Category not found'},
            {status: 404}
        )
    }

    return NextResponse.json(
        {message: 'Category updated successfully', category: updatedCategory},
        {status: 200}
    )
}catch(error){
    console.error('Error updating category: ',error)
    return NextResponse.json(
        {message: 'An error occured while updating the category'},
        {status: 500}
    )
}
}

//Handle DELETE requests to delete a category
export async function DELETE(req: Request){
    try{
        const {id, public_id}: { id: string, public_id:string } = await req.json();

        //validate input
        if (!id || !public_id){
            return NextResponse.json(
                {message: 'ID is required'},
                {status: 400}
            )
        }



        await connectMongoDB()

        cloudinary.uploader.destroy(public_id)
        
        //Delete the category from the database
        const deletedCategory = await Categories.findByIdAndDelete(id)

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
