
import {Schema, model, models, Types} from 'mongoose'

const VariantionSchema = new Schema({
    reference_id: {type: Types.ObjectId, ref: "Product", required: true},
    variations: [{
        retailPrice: {type: Number, required: true},
        discountedPrice: { type: Number, required: true },
    variantType: {
        type: String,
        required: true
    },
    subVariant:[{
        type: String,
        required: true
    }],
    stock: {
        type: Number,
        required: true
    }}]
},
{timestamps: true}
)

const Variation = models.Variantion || model('Variation', VariantionSchema)

export default Variation