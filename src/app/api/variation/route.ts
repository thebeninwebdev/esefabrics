import { NextResponse } from "next/server";
import Variation from "../../../../models/variations";
import { connectMongoDB } from "../../../../utils/database";
import { VariationInterface } from "../../types";

//Handle GET requests to fetch all variants
export async function GET(req: Request){
    try {
        await connectMongoDB();

        const variations = await Variation.find() //Fetch all variants
        return NextResponse.json({ variations}, { status: 200 })
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
        const {Variations} = await req.json()

        //Validate the input
        if(!Variations){
            return NextResponse.json(
                {message: 'Variant is required'},
                {status: 400}
            )
        }

        //connect to mongodb
        await connectMongoDB()

        //createa a new variant in the database
        await Variation.create(Variations)

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
    const {id, variations, reference_id}: {id: string; variations: VariationInterface, reference_id:string} = await req.json()
    
    //Validate input
    if(!id || !variations || !reference_id){
        return NextResponse.json(
            {message: "ID and valid category are required"},
            {status: 400}
        )
    }

    await connectMongoDB();

    const updatedVariation = await Variation.findByIdAndUpdate(id, {reference_id,variations}, {new: true})

    if(!updatedVariation){
        return NextResponse.json(
            {message: 'Category not found'},
            {status: 404}
        )
    }

    return NextResponse.json(
        {message: 'Category updated successfully', variation: updatedVariation},
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
        const deletedCategory = await Variation.findByIdAndDelete(id)

        if(!deletedCategory){
            return NextResponse.json(
                {
                    message: 'Variation not found'
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {message: 'Variation deleted successfully'},

            {status: 200}
        )
    }catch(error){
        console.error('Error deleting variation:',error)
        return NextResponse.json(
            {
                message: 'An error occured while deleting the variation'
            },
            {status: 500}
        )
    }
}
