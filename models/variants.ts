
import {Schema, model, models, Document} from 'mongoose'

interface IVariants extends Document {
    variantType: string;
    subVariant: string[];
  }

const VariantsSchema = new Schema<IVariants>({
    variantType: {
        type: String,
        required: true
    },
    subVariant:[{
        type: String,
        required: true
    }]
})

const Variants = models.Variants || model<IVariants>('Variants', VariantsSchema)

export default Variants