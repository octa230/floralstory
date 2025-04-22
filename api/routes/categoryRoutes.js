import { Router } from "express";
import { createCategory, deleteCategory, getCategories, syncCategoryToNavigation } from "../services/CategoryService.js";
import asyncHandler from "express-async-handler";
import { Category } from "../models/category.js";

const categoryRouter = Router()

categoryRouter.post('/', asyncHandler(async(req, res)=>{
    try{
        const category = await createCategory(req.body)
        res.send(category)
    }catch(error){
        res.send(error)
        throw new Error('error:', error)
    }

}))

categoryRouter.get('/', asyncHandler(async(req, res)=>{
    const categories = await getCategories()
    res.send(categories)
}))

categoryRouter.delete('/:id', asyncHandler(async(req, res)=>{
    const status = await deleteCategory(req.params.id)
    if(status){
        res.send({status: true})
    }
    //await Category.findOneAndDelete(req.params.id)
    //res.send({status: true})
}))




export default categoryRouter