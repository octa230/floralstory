import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductService from '../services/productService.js'



const ProductRouter = Router()

ProductRouter.get('/', asyncHandler(async(req, res)=> {
   const products = await ProductService.FetchAll()
   res.send(products)
}))


ProductRouter.post('/', asyncHandler(async(req, res)=> {
    //console.log(req.body)
    const product = await ProductService.Create(req.body)
    res.send(product)
}))

ProductRouter.get('/:slug', asyncHandler(async(req, res)=> {
    //console.log(req.params)
    const product = await ProductService.GetProduct(req.params.slug)
    res.send(product)
}))




export default ProductRouter