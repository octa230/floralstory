import Product from "../models/product.js"
import { generateUUid, stringCleaner } from "../utils.js"

class ProductService{
    static async Create(data){
        console.log(data)

        const newProduct = new Product({
            name: data.name,
            price: data.price,
            sku: await generateUUid(),
            slug: await stringCleaner(data.name),
            images: data.images,
            description: data.description,
            image: data.image,
            
        })
        await newProduct.save()
        return newProduct
    }

    static async FetchAll(){
        const Products = await Product.find({})
        return Products
    } 

    static async GetProduct(slug){
        const product = await Product.findOne({slug})
        return product
    }

    
}


export default ProductService