import mongoose from "mongoose";



const productSchema = new mongoose.Schema({
    name: String,
    slug: String,
    image: String,
    images: [String],
    sku: {type: String, unique: true},
    inStock: Number,
    price: {type: Number, default: 0},
    unit: String,
    description: String,
    shortDescription: String,
    careTips: String,
    group: String
})

const Product = mongoose.model('Product', productSchema)
export default Product