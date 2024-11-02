import { NextResponse } from "next/server";
import Categories from "../../../../models/category";
import { connectMongoDB } from "../../../../utils/database";

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
export const POST = async (req: Request) => {
    try {
        //Parse the incoming JSON request
        const {category}:{category: string} = await req.json()

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

        if(duplicate){
            return NextResponse.json(
                {message: 'Category already exists'},
                {status: 409}
            )
        }

        //createa a new category in the database
        await Categories.create({category})

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
    const {id, category}: {id: string; category: string} = await req.json()
    
    //Validate input
    if(!id || !category || typeof category !== 'string' || category.trim().length === 0){
        return NextResponse.json(
            {message: "ID and valid category are required"},
            {status: 400}
        )
    }

    await connectMongoDB();

    const updatedCategory = await Categories.findByIdAndUpdate(id, {category}, {new: true})

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
        const {id}: { id: string } = await req.json();

        //validate input
        if (!id){
            return NextResponse.json(
                {message: 'ID is required'},
                {status: 400}
            )
        }

        await connectMongoDB()
        
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
