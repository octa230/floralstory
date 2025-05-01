import { Router } from "express";
import { createRelationship, getCategoryDetails, getCategoryTree, getNavigationDetails, syncCategoryToNavigation } from "../services/CategoryService.js";
import { CategoryRelations, NavigationItem } from "../models/category.js";
import asyncHandler from "express-async-handler";

const navigationRouter = Router()

navigationRouter.post('/', asyncHandler(async(req, res)=>{
    const {category} = req.body

    try {
        const result = await syncCategoryToNavigation(category, req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}));



navigationRouter.post('/relationships', asyncHandler(async(req, res)=>{
    const {parentId, childId, relationshipType} = req.body
    console.log(req.body)
    try{
        const relationship = await createRelationship(parentId, childId, relationshipType)
        res.status(200).send(relationship);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}))

navigationRouter.delete('/relationships/:id', asyncHandler(async(req, res)=>{
    try{
        await CategoryRelations.findByIdAndDelete(req.params.id)
        res.status(200).send('relationship deleted')
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}))

navigationRouter.get('/', asyncHandler(async(req, res)=>{
    const categories = await NavigationItem.find({})
    res.send(categories)
}))

navigationRouter.get('/:id', asyncHandler(async (req, res) => {
    const navItem = await NavigationItem.findById(req.params.id)
        .populate('category') // Populating category data
        .exec();
    
    if (!navItem) {
        return res.status(404).json({ message: 'Navigation item not found' });
    }

    // Fetch subcategories and related categories based on the category of the navItem
    const category = navItem.category;

    // Fetch descendants and related categories (or subcategories) for this category
    const { descendants, ancestors } = await getCategoryTree(category);

    // You can then send these back as part of the response
    res.send(descendants, ancestors)
}));


export default navigationRouter