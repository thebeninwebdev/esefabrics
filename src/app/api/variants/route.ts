import { NextResponse } from "next/server";
import Variants from "../../../../models/variants";
import {connectMongoDB } from "../../../../utils/database";

//Handle GET requests to fetch all variants
export async function GET(req: Request){
    try {
        await connectMongoDB();

        const variants = await Variants.find() //Fetch all variants
        return NextResponse.json({ variants}, { status: 200 })
    } catch (error) {
        console.error('Error fetching variants: ', error)
        return NextResponse.json(
            { message: 'An error occured while fetching variants' },
            { status: 500 }
        )
    }
}

//Handle POST requests to create a variant
export const POST = async (req: Request) => {
    try {
        //Parse the incoming JSON request
        const {variant} = await req.json()

        //Validate the input
        if(!variant){
            return NextResponse.json(
                {message: 'Variant is required'},
                {status: 400}
            )
        }

        //connect to mongodb
        await connectMongoDB()

        //search for duplicate
        const duplicate = await Variants.findOne({ variantType: variant.variantType });


        if(duplicate){
            return NextResponse.json(
                {message: 'Variant already exists'},
                {status: 409}
            )
        }

        //createa a new variant in the database
        await Variants.create(variant)

        return NextResponse.json(
            {message: 'Variant created successfully'},
            {status: 201}
        )

    } catch (error) {
        console.error('Error updating variant: ', error)
        return NextResponse.json(
            {
                message: 
                'An error occured while creating the variant'
            },
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

    const updatedCategory = await Variants.findByIdAndUpdate(id, {category}, {new: true})

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
        const deletedCategory = await Variants.findByIdAndDelete(id)

        if(!deletedCategory){
            return NextResponse.json(
                {
                    message: 'Variant not found'
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {message: 'Variant deleted successfully'},

            {status: 200}
        )
    }catch(error){
        console.error('Error deleting variant:',error)
        return NextResponse.json(
            {
                message: 'An error occured while deleting the variant'
            },
            {status: 500}
        )
    }
}
