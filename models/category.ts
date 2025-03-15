
import {Schema, model, models, Document} from 'mongoose'

interface ICategories extends Document {
    category: string;
    image: string;
    link: string;
  }

const CategoriesSchema = new Schema<ICategories>({
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

const Categories = models.Categories || model<ICategories>('Categories', CategoriesSchema)

export default Categories