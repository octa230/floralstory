import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {GetProduct, GetProductById, CreateProduct, FetchAllProducts, EditProduct}from '../services/productService.js'



const ProductRouter = Router()

ProductRouter.get('/:slug', asyncHandler(async(req, res)=> {
    //console.log(req.params)
    const product = await GetProduct(req.params.slug)
    res.send(product)
}))

ProductRouter.get('/:id', asyncHandler(async(req, res)=> {
    console.log(req.params.id)
    const product = await GetProductById(req.params.id)
    res.send(product)
}))

ProductRouter.get('/', asyncHandler(async(req, res)=> {
   const products = await FetchAllProducts()
   res.send(products)
}))


ProductRouter.post('/', asyncHandler(async(req, res)=> {
    //console.log(req.body)
    const product = await CreateProduct(req.body)
    res.send(product)
}))


/* ProductRouter.get('/:id', asyncHandler(async(req, res)=> {
    //console.log(req.params)
    const product = await GetProductById(req.params.id)
    res.send(product)
})) */
ProductRouter.put('/:id', asyncHandler(async(req, res)=> {
    //console.log(req.params)
    const product = await EditProduct(req.params.id, req.body)
    res.send(product)
}))




export default ProductRouter