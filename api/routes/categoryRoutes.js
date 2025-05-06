import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryDetails, updateCategory } from "../services/CategoryService.js";
import asyncHandler from "express-async-handler";
import { Category, CategoryRelations } from "../models/category.js";

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
categoryRouter.put('/:id', asyncHandler(async(req, res)=>{
    try{
        const category = await updateCategory(req.params.id, req.body)
        res.send(category)
    }catch(error){
        res.send(error)
        throw new Error('error:', error)
    }

}))

categoryRouter.get('/:id', asyncHandler(async(req, res)=>{
    try{
        const category = await getCategoryById(req.params.id)
        res.send(category)
    }catch(error){
        res.send(error)
        throw new Error('error:', error)
    }

}))

categoryRouter.get('/:id/relationships', asyncHandler(async(req, res)=>{
    try{
        const relationships = await CategoryRelations.find({
            $or: [{ parent: req.params.id }, { child: req.params.id }]
        })
        .populate('parent')
        .populate('child')
        res.status(200).send(relationships)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}))

categoryRouter.get('/:id/details', asyncHandler(async(req, res)=>{
  //console.log(req.params.id)
  try{
    const {category, products, subcategories, relatedCategories} = await 
    getCategoryDetails(req.params.id)
    res.status(200).send({
      category,
      products,
      subcategories,
      relatedCategories
    })
  }catch(error){
    res.status(500).send({ error: error.message });
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