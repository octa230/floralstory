import Product from "../models/product.js"
import { generateUUid, stringCleaner } from "../utils.js"


    async function CreateProduct (data){
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
    async function EditProduct (productId, data){
        console.log(data)

        const product = await GetProductById(productId)
        if(!product) throw Error('product not found')

        const newProduct = new Product({
            name: data.name,
            price: data.price,
            sku: await generateUUid(),
            category: data.category,
            slug: await stringCleaner(data.name),
            images: data.images,
            description: data.description,
            image: data.image,
            
        })
        await newProduct.save()
        return newProduct
    }

    async function  FetchAllProducts(){
        const Products = await Product.find({})
        return Products
    } 

    async function GetProduct(slug){
        const product = await Product.findOne({slug})
        return product
    }
    
    async function GetProductById(id){
        const product = await Product.findById(id)
        if(!product) return 'product not found'
        console.log(product)
        return product
    }


export {
    GetProductById, GetProduct, FetchAllProducts,
    CreateProduct, EditProduct
}